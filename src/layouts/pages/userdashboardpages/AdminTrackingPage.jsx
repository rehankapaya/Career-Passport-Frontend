import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  BookmarkCheck,
  ExternalLink,
  Calendar,
  FileText,
  Video,
  Briefcase,
  Book,
  Pin,
  Users,
} from "lucide-react";
import { apiurl } from "../../../api";

export default function AdminTrackingPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiurl}/api/bookmarks/admin/all`);
        const data = res.data;

        // ✅ Aggregate by itemId
        const grouped = data.reduce((acc, curr) => {
          const key = `${curr.itemType}-${curr.itemId}`;
          if (!acc[key]) {
            acc[key] = {
              ...curr,
              userCount: 0,
              users: new Set(),
            };
          }
          acc[key].userCount += 1;
          acc[key].users.add(curr.user._id);
          return acc;
        }, {});

        const enriched = await Promise.all(
          Object.values(grouped).map(async (item) => {
            try {
              // Step 1: Identify cache key
              let cacheKey = "";
              if (item.itemType === "resource") cacheKey = "resources_cache_v1";
              else if (item.itemType === "multimedia") cacheKey = "multimedia_cache_v1";
              else if (item.itemType === "career") cacheKey = "career_bank_cache_v1";
              else if (item.itemType === "story") cacheKey = "success_stories_cache_v1";

              let itemData = null;
              if (cacheKey) {
                const cacheRaw = localStorage.getItem(cacheKey);
                if (cacheRaw) {
                  const cache = JSON.parse(cacheRaw);
                  itemData = cache.items.find(
                    (i) =>
                      i._id === item.itemId ||
                      i.career_id === item.itemId ||
                      i.resource_id === item.itemId ||
                      i.media_id === item.itemId ||
                      i.story_id === item.itemId
                  );
                }
              }

              // Step 2: Fallback to API
              if (!itemData) {
                let endpoint = "";
                if (item.itemType === "resource")
                  endpoint = `${apiurl}/api/resources/${item.itemId}`;
                else if (item.itemType === "multimedia")
                  endpoint = `${apiurl}/api/multimedia/${item.itemId}`;
                else if (item.itemType === "career")
                  endpoint = `${apiurl}/api/careers/${item.itemId}`;
                else if (item.itemType === "story")
                  endpoint = `${apiurl}/api/success-stories/${item.itemId}`;

                if (endpoint) {
                  const res = await axios.get(endpoint);
                  itemData = res.data;
                }
              }

              const displayTitle =
                itemData?.title ||
                itemData?.rname ||
                "Untitled Item";

              return {
                ...item,
                displayTitle,
                popularity: item.userCount,
              };
            } catch {
              return { ...item, displayTitle: "Untitled Item", popularity: item.userCount };
            }
          })
        );

        setItems(enriched);
      } catch (err) {
        console.error("Error fetching admin bookmarks:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const getItemTypeIcon = (type) => {
    const common = { size: 18, style: { color: "#0A66C2" } };
    if (type === "resource") return <FileText {...common} />;
    if (type === "multimedia") return <Video {...common} />;
    if (type === "career") return <Briefcase {...common} />;
    if (type === "story") return <Book {...common} />;
    return <Pin {...common} />;
  };

  if (loading) {
    return <p style={{ textAlign: "center", padding: "40px" }}>Loading admin stats…</p>;
  }

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 24 }}>
        📊 Admin – Downloads & Popularity Tracking
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {items.map((item) => (
          <div
            key={item.itemId}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {getItemTypeIcon(item.itemType)}
                <span style={{ fontWeight: 600, fontSize: 12, color: "#0A66C2" }}>
                  {item.itemType.toUpperCase()}
                </span>
              </div>
              <ExternalLink size={16} color="#6B7280" />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>
              {item.displayTitle}
            </h3>
            <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>
              ID: {item.itemId}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Users size={14} color="#0A66C2" />
              <span style={{ fontSize: 14 }}>
                User View Count: <strong>{item.popularity}</strong>
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B7280" }}>
              <Calendar size={14} />
              <span>First saved: {new Date(item.createdAt).toLocaleDateString()}</span>
            </div>

            <Link
              to={`/${item.itemType}/${item.itemId}`}
              style={{
                marginTop: 12,
                display: "inline-block",
                backgroundColor: "#0A66C2",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              View Item
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
