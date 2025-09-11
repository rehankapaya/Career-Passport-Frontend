import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiurl } from "../../api";
import "./UserProfilePage.css";

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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      if (res.data) {
        setUserProfile(res.data);
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          color: "#555",
        }}
      >
        <p>Loading profile...</p>
      </div>
    );
  }

  const handleUpdate = async () => {
    try {
      const form = new FormData();
      form.append("education_level", formData.education_level || "");
      const interestsArray = formData.interests
        ? formData.interests
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item)
        : [];
      form.append("interests", JSON.stringify(interestsArray));
      if (formData.profile_image) {
        form.append("profile_image", formData.profile_image);
      }
      const res = await axios.post(`${apiurl}/api/user-profiles/`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
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
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f4f7f9",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          width: "100%",
          maxWidth: "700px",
          padding: "40px",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "25px",
            borderBottom: "1px solid #eee",
            paddingBottom: "25px",
            marginBottom: "25px",
          }}
        >
          <img
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid #f0f4f7",
            }}
            src={
              userProfile?.profile_image
                ? `${apiurl}/${userProfile?.profile_image}`
                : "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"
            }
            alt="Profile"
          />
          <div>
            <h2
              style={{
                fontSize: "2rem",
                color: "#2c3e50",
                margin: "0 0 5px 0",
              }}
            >
              {user.username}
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "#7f8c8d",
                margin: "0 0 10px 0",
              }}
            >
              {user.email}
            </p>
            <span
              style={{
                backgroundColor: "#e8f6f3",
                color: "#27ae60",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "bold",
              }}
            >
              Active Member
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              fontSize: "1.5rem",
              color: "#34495e",
              borderBottom: "2px solid #3498db",
              paddingBottom: "10px",
              marginBottom: "20px",
            }}
          >
            Profile Details
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: "0",
              margin: "0",
            }}
          >
            <li style={{ marginBottom: "15px", fontSize: "1.1rem" }}>
              <strong style={{ color: "#555" }}>Education Level:</strong>{" "}
              {userProfile?.education_level || "Not specified"}
            </li>
            <li style={{ marginBottom: "15px", fontSize: "1.1rem" }}>
              <strong style={{ color: "#555" }}>Interests:</strong>{" "}
              {userProfile?.interests && Array.isArray(userProfile.interests)
                ? userProfile.interests.join(", ")
                : userProfile?.interests || "Not specified"}
            </li>
            <li style={{ marginBottom: "15px", fontSize: "1.1rem" }}>
              <strong style={{ color: "#555" }}>Role:</strong>{" "}
              {user.role || "User"}
            </li>
            <li style={{ marginBottom: "15px", fontSize: "1.1rem" }}>
              <strong style={{ color: "#555" }}>Last Updated:</strong>{" "}
              {userProfile?.updated_at
                ? new Date(userProfile.updated_at).toLocaleDateString()
                : "Never"}
            </li>
          </ul>
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setShowEdit(true)}
            style={{
              padding: "12px 30px",
              backgroundColor: "#3498db",
              color: "#fff",
              border: "none",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(52, 152, 219, 0.4)",
              transition: "background-color 0.3s ease",
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
              width: "100%",
              maxWidth: "500px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                color: "#2c3e50",
                marginBottom: "10px",
              }}
            >
              Edit Profile
            </h3>

            <label style={{ color: "#555", fontWeight: "bold" }}>
              Profile Image
            </label>
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
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            />

            <label style={{ color: "#555", fontWeight: "bold" }}>
              Education Level
            </label>
            <select
              value={formData.education_level}
              onChange={(e) =>
                setFormData({ ...formData, education_level: e.target.value })
              }
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            >
              <option value="">Select education level</option>
              <option value="High School">High School</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Other">Other</option>
            </select>

            <label style={{ color: "#555", fontWeight: "bold" }}>
              Interests
            </label>
            <textarea
              value={formData.interests}
              onChange={(e) =>
                setFormData({ ...formData, interests: e.target.value })
              }
              placeholder="Separate interests with commas"
              rows={3}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                resize: "vertical",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => setShowEdit(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ecf0f1",
                  color: "#7f8c8d",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background-color 0.3s ease",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2ecc71",
                  color: "#fff",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background-color 0.3s ease",
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
