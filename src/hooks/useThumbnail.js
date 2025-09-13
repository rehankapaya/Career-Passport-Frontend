import { apiurl } from "../api";


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


// Function to get the correct URL for display
const getMediaUrl = (url) => {
    if (url && url.startsWith("uploads/")) {
        console.log(url)
        return `${apiurl}/${url}`;
    }
    return url;
};

// --- NEW: smarter thumbnails (YouTube, Drive, Images) ---
const getThumbnail = (item) => {
    // Prefer a server-provided thumbnail if it exists
    if (item.thumbnail_url) {
        return item.thumbnail_url.startsWith("uploads/")
            ? getMediaUrl(item.thumbnail_url)
            : item.thumbnail_url;
    }

    const url = item.url || "";

    // Type-specific logic
    if (item.type === "image") {
        if (!url) return placeholder("96aab5", "Image");
        if (isDriveUrl(url)) return getDriveImageViewUrl(url);
        return getMediaUrl(url);
    }

    if (item.type === "video") {
        // YouTube
        const yt = getYouTubeId(url);
        if (yt) return `https://img.youtube.com/vi/${yt}/mqdefault.jpg`;

        // Google Drive video/pdf thumbnails
        if (isDriveUrl(url)) {
            const t = getDriveThumbnailUrl(url);
            if (t) return t;
        }

        // Local uploads (no built-in thumb) → placeholder
        if (url && url.startsWith("uploads/")) {
            return "https://via.placeholder.com/300x180/1f2937/ffffff?text=Video";
        }

        // Unknown video host → generic
        return "https://via.placeholder.com/300x180/1f2937/ffffff?text=Video";
    }

    if (item.type === "pdf") {
        // Drive often returns a thumbnail for PDFs
        if (isDriveUrl(url)) {
            const t = getDriveThumbnailUrl(url);
            if (t) return t;
        }
        return "https://via.placeholder.com/300x180/0ea5e9/ffffff?text=PDF";
    }

    if (item.type === "audio") {
        return "/audio.png";
    }

    // Fallback
    return "https://via.placeholder.com/300x180/96aab5/ffffff?text=Media";
};

export default getThumbnail;