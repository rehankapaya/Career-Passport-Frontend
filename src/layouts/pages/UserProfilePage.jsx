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
      <div className="profile-loading">
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
    <div className="profile-container">
      <div className="profile-card">
        {/* Header Section */}
        <div className="profile-header">
          <img
            className="profile-avatar"
            src={
              userProfile?.profile_image
                ? `${apiurl}/${userProfile?.profile_image}`
                : "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"
            }
            alt="Profile"
          />
          <div>
            <h2 className="profile-name">{user.username}</h2>
            <p className="profile-email">{user.email}</p>
            <span className="profile-status">Active Member</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="profile-details">
          <h3>Profile Details</h3>
          <ul>
            <li>
              <strong>Education Level:</strong>{" "}
              {userProfile?.education_level || "Not specified"}
            </li>
            <li>
              <strong>Interests:</strong>{" "}
              {userProfile?.interests && Array.isArray(userProfile.interests)
                ? userProfile.interests.join(", ")
                : userProfile?.interests || "Not specified"}
            </li>
            <li>
              <strong>Role:</strong> {user.role || "User"}
            </li>
            <li>
              <strong>Last Updated:</strong>{" "}
              {userProfile?.updated_at
                ? new Date(userProfile.updated_at).toLocaleDateString()
                : "Never"}
            </li>
          </ul>
        </div>

        <div className="profile-actions">
          <button onClick={() => setShowEdit(true)} className="profile-edit-btn">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <h3>Edit Profile</h3>

            <label>Profile Image</label>
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
            />

            <label>Education Level</label>
            <select
              value={formData.education_level}
              onChange={(e) =>
                setFormData({ ...formData, education_level: e.target.value })
              }
            >
              <option value="">Select education level</option>
              <option value="High School">High School</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Other">Other</option>
            </select>

            <label>Interests</label>
            <textarea
              value={formData.interests}
              onChange={(e) =>
                setFormData({ ...formData, interests: e.target.value })
              }
              placeholder="Separate interests with commas"
              rows={3}
            />

            <div className="profile-modal-actions">
              <button onClick={() => setShowEdit(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleUpdate} className="save-btn">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
