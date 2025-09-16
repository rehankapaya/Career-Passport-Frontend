// utils/getThumbnail.js
import { apiurl } from "../api";

/* =========================
   DUMMY PLACEHOLDERS (edit paths to your assets)
   ========================= */
const DUMMY = {
  image: "/placeholders/image-placeholder.png",
  video: "/placeholders/video-placeholder.png",
  audio: "/placeholders/audio-placeholder.png",
  pdf:   "/placeholders/pdf-placeholder.png",
  any:   "/placeholders/multimedia-placeholder.png",
};

/* =========================
   URL helpers (Drive / YouTube)
   ========================= */
const isDriveUrl = (url = "") =>
  typeof url === "string" &&
  (url.includes("drive.google.com") ||
    url.includes("docs.google.com/uc?") ||
    /[?&]id=/.test(url) ||
    /\/file\/d\//.test(url));

const extractDriveId = (urlOrId = "") => {
  if (!urlOrId) return "";
  if (!urlOrId.includes("/") && !urlOrId.includes("?")) return urlOrId.trim();
  const m1 = urlOrId.match(/\/file\/d\/([^/]+)/);
  if (m1?.[1]) return m1[1];
  const m2 = urlOrId.match(/[?&]id=([^&]+)/);
  if (m2?.[1]) return m2[1];
  return "";
};

const getDriveThumbnailUrl = (urlOrId = "", size = "w320-h180") => {
  const id = extractDriveId(urlOrId);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=${size}` : "";
};

const getDriveImageViewUrl = (urlOrId = "") => {
  const id = extractDriveId(urlOrId);
  return id ? `https://drive.google.com/uc?export=view&id=${id}` : "";
};

const getYouTubeId = (url = "") => {
  if (!url) return "";
  const m = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return m?.[1] || "";
};

/* =========================
   Cloudinary helpers
   ========================= */
const isHttpUrl = (u = "") => /^https?:\/\//i.test(String(u));
const isCloudinaryUrl = (u = "") => /res\.cloudinary\.com/i.test(String(u));

/**
 * Insert a Cloudinary transform after /upload/ and before the version segment (v123...)
 * Handles:
 *   - .../upload/v1234/...
 *   - .../upload/c_scale,w_600/v1234/...
 *   - .../upload/... (no version)
 */
const withCldTransform = (url, transform) => {
  if (!isCloudinaryUrl(url)) return url;

  // /upload/v1234/ → insert before version
  if (/\/upload\/v\d+\//.test(url)) {
    return url.replace(/\/upload\/v(\d+)\//, `/upload/${transform}/v$1/`);
  }

  // /upload/<existing-transform>/v1234/ → prepend our transform
  const existing = url.match(/\/upload\/([^/]+)\/v\d+\//);
  if (existing && existing[1]) {
    return url.replace(
      /\/upload\/([^/]+)\/v(\d+)\//,
      `/upload/${transform},$1/v$2/`
    );
  }

  // Plain /upload/
  return url.replace("/upload/", `/upload/${transform}/`);
};

// Image: crop + auto quality/format
const cldImageThumb = (url, w = 640, h = 360, crop = "c_fill") =>
  withCldTransform(url, [`w_${w}`, `h_${h}`, crop, "q_auto", "f_auto"].join(","));

// Video/Audio: grab a poster frame (second 2), jpg thumbnail
const cldVideoThumb = (url, w = 640, h = 360, crop = "c_fill") =>
  withCldTransform(url, [`so_2`, `w_${w}`, `h_${h}`, crop, "q_auto", "f_jpg"].join(","));

/* =========================
   Media URL normalizer (exported)
   ========================= */
export const getMediaUrl = (url) => {
  if (!url) return "";
  if (isHttpUrl(url)) return url;                  // Cloudinary or absolute URL
  if (String(url).startsWith("uploads/")) return `${apiurl}/${url}`; // legacy local path
  return url;                                      // fallback
};

/* =========================
   Dummy chooser (exported)
   ========================= */
export const getDummyThumb = (type = "") => {
  const t = String(type || "").toLowerCase();
  if (t === "image") return DUMMY.image;
  if (t === "video") return DUMMY.video;
  if (t === "audio") return DUMMY.audio;
  if (t === "pdf")   return DUMMY.pdf;
  return DUMMY.any;
};

/**
 * Helper for <img onError>:
 *   <img src={thumb} onError={thumbOnError(item)} ... />
 */
export const thumbOnError = (item) => (e) => {
  e.currentTarget.onerror = null; // avoid loops
  e.currentTarget.src = getDummyThumb(item?.type);
};

/* =========================
   Main thumbnail chooser (export default)
   ========================= */
const getThumbnail = (item) => {
  // 1) Explicit thumbnail from server wins
  if (item?.thumbnail_url) {
    const thumb = item.thumbnail_url;
    return isCloudinaryUrl(thumb) ? thumb : getMediaUrl(thumb);
  }

  const url = item?.url || "";
  const type = String(item?.type || "").toLowerCase();

  // 2) Type-based logic (with Cloudinary first, dummy fallback)

  // ---- IMAGE ----
  if (type === "image") {
    if (!url) return getDummyThumb("image");
    if (isCloudinaryUrl(url)) return cldImageThumb(url, 960, 540) || getDummyThumb("image");
    if (isDriveUrl(url)) return getDriveImageViewUrl(url) || getDummyThumb("image");
    return getMediaUrl(url) || getDummyThumb("image");
  }

  // ---- VIDEO ----
  if (type === "video") {
    // YouTube
    const yt = getYouTubeId(url);
    if (yt) return `https://img.youtube.com/vi/${yt}/mqdefault.jpg`;

    // Drive video
    if (isDriveUrl(url)) {
      return getDriveThumbnailUrl(url) || getDummyThumb("video");
    }

    // Cloudinary video → frame
    if (isCloudinaryUrl(url)) return cldVideoThumb(url, 960, 540) || getDummyThumb("video");

    // Legacy local uploads
    if (url && url.startsWith("uploads/")) return getDummyThumb("video");

    // Unknown host
    return getDummyThumb("video");
  }

  // ---- AUDIO ----
  if (type === "audio") {
    // Cloudinary (audio is under resource_type 'video') → generate poster frame
    if (isCloudinaryUrl(url)) return cldVideoThumb(url, 640, 360) || getDummyThumb("audio");
    return getDummyThumb("audio");
  }

  // ---- PDF / DOCS ----
  if (type === "pdf") {
    if (isDriveUrl(url)) {
      return getDriveThumbnailUrl(url) || getDummyThumb("pdf");
    }
    // Cloudinary raw PDFs typically don't auto-thumb; use dummy
    return getDummyThumb("pdf");
  }

  // 3) Fallback (unknown type)
  if (isCloudinaryUrl(url)) return cldImageThumb(url, 640, 360) || getDummyThumb("any");
  return getDummyThumb("any");
};

export default getThumbnail;
