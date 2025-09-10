import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiurl } from "../../api";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    education_level: "",
    interests: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    if (storedUser) {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${apiurl}/api/user-profiles/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }, withCredentials: true
      });
      if (res.data) {
        setUserProfile(res.data);
        console.log(res.data);
        setFormData({
          education_level: res.data.education_level || "",
          interests: Array.isArray(res.data.interests)
            ? res.data.interests.join(", ")
            : res.data.interests || "",
        });
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  if (!user) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f5f6fa"
      }}>
        <p style={{ color: "#636e72", fontSize: "18px" }}>Loading profile...</p>
      </div>
    );
  }

  const handleUpdate = async () => {
    try {
      const form = new FormData();
      form.append("education_level", formData.education_level || "");
      const interestsArray = formData.interests
        ? formData.interests.split(',').map(item => item.trim()).filter(item => item)
        : [];
      form.append("interests", JSON.stringify(interestsArray));
      if (formData.profile_image) {
        form.append("profile_image", formData.profile_image);
      }
      const res = await axios.post(`${apiurl}/api/user-profiles/`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        withCredentials: true
      });
      if (res.data) {
        toast.success("Profile updated successfully!");
        setUserProfile(res.data);
        setShowEdit(false);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e3f2fd 0%, #f5f6fa 100%)",
      padding: "24px"
    }}>
      <div style={{
        maxWidth: "700px",
        margin: "0 auto",
        background: "#fff",
        boxShadow: "0 8px 32px rgba(45,52,54,0.12)",
        borderRadius: "18px",
        padding: "40px",
        animation: "fade-in 0.6s"
      }}>
        {/* Header Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <img
            style={{
              width: "112px",
              height: "112px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid #0984e3",
              boxShadow: "0 2px 8px rgba(45,52,54,0.08)",
              transition: "transform 0.3s"
            }}
            src={userProfile?.profile_image
              ? `${apiurl}/${userProfile?.profile_image}`
              : "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"}
            alt="Profile"
          />
          <div>
            <h2 style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#2d3436", marginBottom: "4px" }}>
              {user.username}
            </h2>
            <p style={{ color: "#636e72", fontSize: "1rem" }}>{user.email}</p>
            <span style={{
              display: "inline-block",
              marginTop: "12px",
              background: "#dff9fb",
              color: "#00b894",
              fontSize: "0.85rem",
              padding: "6px 18px",
              borderRadius: "999px"
            }}>
              Active Member
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div style={{ marginTop: "36px" }}>
          <div style={{
            background: "#f5f6fa",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(45,52,54,0.04)",
            marginBottom: "24px"
          }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#2d3436", marginBottom: "16px" }}>Profile Details</h3>
            <ul style={{ color: "#636e72", fontSize: "1rem", listStyle: "none", padding: 0 }}>
              <li>
                <strong>Education Level:</strong> {userProfile?.education_level || "Not specified"}
              </li>
              <li>
                <strong>Interests:</strong> {userProfile?.interests && Array.isArray(userProfile.interests)
                  ? userProfile.interests.join(", ")
                  : userProfile?.interests || "Not specified"}
              </li>
              <li>
                <strong>Role:</strong> {user.role || "User"}
              </li>
              <li>
                <strong>Last Updated:</strong> {userProfile?.updated_at
                  ? new Date(userProfile.updated_at).toLocaleDateString()
                  : "Never"}
              </li>
            </ul>
          </div>
          <div style={{ textAlign: "right" }}>
            <button
              onClick={() => setShowEdit(true)}
              style={{
                background: "linear-gradient(90deg, #0984e3 0%, #6c5ce7 100%)",
                color: "#fff",
                padding: "10px 28px",
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow: "0 2px 8px rgba(45,52,54,0.08)",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.2s"
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.35)",
          zIndex: 50
        }}>
          <div style={{
            background: "#fff",
            padding: "32px",
            borderRadius: "18px",
            boxShadow: "0 8px 32px rgba(45,52,54,0.12)",
            width: "380px",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "18px" }}>Edit Profile</h3>
            <label style={{ display: "block", color: "#636e72", fontWeight: "500", marginBottom: "6px" }}>Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && !file.type.startsWith("image/")) {
                  toast.error("Only image files are allowed!");
                  return;
                }
                setFormData({ ...formData, profile_image: file });
              }}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #dfe6e9",
                borderRadius: "8px",
                marginBottom: "18px"
              }}
            />
            <label style={{ display: "block", color: "#636e72", fontWeight: "500", marginBottom: "6px" }}>Education Level</label>
            <select
              value={formData.education_level}
              onChange={(e) =>
                setFormData({ ...formData, education_level: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #dfe6e9",
                borderRadius: "8px",
                marginBottom: "18px"
              }}
            >
              <option value="">Select education level</option>
              <option value="High School">High School</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Other">Other</option>
            </select>
            <label style={{ display: "block", color: "#636e72", fontWeight: "500", marginBottom: "6px" }}>Interests</label>
            <textarea
              value={formData.interests}
              onChange={(e) =>
                setFormData({ ...formData, interests: e.target.value })
              }
              placeholder="Separate interests with commas"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #dfe6e9",
                borderRadius: "8px",
                marginBottom: "18px",
                resize: "vertical"
              }}
              rows={3}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => setShowEdit(false)}
                style={{
                  padding: "8px 18px",
                  background: "#dfe6e9",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "500",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                style={{
                  padding: "8px 18px",
                  background: "#0984e3",
                  color: "#fff",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "500",
                  cursor: "pointer"
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}