import React, { useEffect, useState, useContext } from "react";
import { apiurl } from "../../../api";
import { UserContext } from "../../../context/UserContext";

export default function RecentActivityPage() {
  const [activities, setActivities] = useState([]);
  const { user } = useContext(UserContext);
  const userId = user.user_id;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(`${apiurl}/api/history/${userId}`);
        const data = await res.json();
        if (data.success) {
          setActivities(data.data);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, [userId]);

  const formatDate = (dateString) => {
    const now = new Date();
    const viewed = new Date(dateString);
    const diffMs = now - viewed;

    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <div>
      <h1 style={{ color: "#2563eb", marginBottom: "15px" }}>Recent Activity</h1>
      {activities.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No activity</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {activities.map((activity) => (
            <li
              key={activity._id}
              style={{
                padding: "12px 15px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                marginBottom: "10px",
                backgroundColor: "#f9fafb",
              }}
            >
              <p style={{ margin: 0, fontWeight: "500", color: "#374151" }}>
                {activity.categoryType.toUpperCase()} – {activity.title}
              </p>
              <small style={{ color: "#6b7280" }}>
                {formatDate(activity.viewedAt)}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
