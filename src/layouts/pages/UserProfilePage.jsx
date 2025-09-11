import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiurl } from "../../api";
import "./UserProfilePage.css";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    education_level: "",
    interests: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    if (storedUser) {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${apiurl}/api/user-profiles/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      if (res.data) {
        console.log(res.data);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error("Please select a file to upload.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      await axios.post(`${apiurl}/api/user-profiles/resume`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      toast.success("Resume uploaded successfully!");
      fetchUserProfile();
      setResumeFile(null);
    } catch (err) {
      console.error("Error uploading resume:", err);
      toast.error("Resume upload failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadResume = async () => {
    try {
      const response = await axios.get(`${apiurl}/${userProfile.resume}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the resume:', error);
      toast.error('Failed to download the resume.');
    }
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header Section */}
        <div className="profile-header">
          <div className="avatar-container">
            <img
              className="profile-avatar"
              src={
                userProfile?.profile_image
                  ? `${apiurl}/${userProfile?.profile_image}`
                  : "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"
              }
              alt="Profile"
            />
            <div className="avatar-overlay">
              <label htmlFor="avatar-upload" className="avatar-upload-label">
                <i className="upload-icon">📷</i>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && !file.type.startsWith("image/")) {
                    toast.error("Only image files are allowed!");
                    return;
                  }
                  setFormData({ ...formData, profile_image: file });
                }}
              />
            </div>
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{user.username}</h2>
            <p className="profile-email">{user.email}</p>
            <span className="profile-badge">
              {user.role || "User"}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <i className="tab-icon">👤</i> Profile
          </button>
          <button 
            className={`tab-button ${activeTab === "resume" ? "active" : ""}`}
            onClick={() => setActiveTab("resume")}
          >
            <i className="tab-icon">📄</i> Resume
          </button>
          {/* <button 
            className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <i className="tab-icon">⚙️</i> Settings
          </button> */}
        </div>

        {/* Profile Details Section */}
        {activeTab === "profile" && (
          <div className="profile-section">
            <h3 className="section-title">Profile Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-icon">🎓</div>
                <div className="detail-content">
                  <span className="detail-label">Education Level</span>
                  <span className="detail-value">
                    {userProfile?.education_level || "Not specified"}
                  </span>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">❤️</div>
                <div className="detail-content">
                  <span className="detail-label">Interests</span>
                  <span className="detail-value">
                    {userProfile?.interests && Array.isArray(userProfile.interests)
                      ? userProfile.interests.join(", ")
                      : userProfile?.interests || "Not specified"}
                  </span>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">🔄</div>
                <div className="detail-content">
                  <span className="detail-label">Last Updated</span>
                  <span className="detail-value">
                    {userProfile?.updated_at
                      ? new Date(userProfile.updated_at).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">📅</div>
                <div className="detail-content">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">
                    {new Date(userProfile?.created_at || user.date_joined).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            {userProfile?.user_id ==user?.user_id &&<div className="action-buttons">
              <button
                onClick={() => setShowEdit(true)}
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Edit Profile"}
              </button>
            </div>}
          </div>
        )}

        {/* Resume Section */}
        {activeTab === "resume" && (
          <div className="profile-section">
            {userProfile?.user_id == user?.user_id && <h3 className="section-title">Resume Management</h3>}

            {userProfile?.user_id == user?.user_id && <div className="resume-status">
              <div className="resume-status-icon">
                {userProfile?.resume ? "✅" : "📝"}
              </div>
              <div className="resume-status-content">
                <h4>Current Resume Status</h4>
                <p>
                  {userProfile?.resume 
                    ? "Your resume has been uploaded and is ready to be viewed by employers."
                    : "You haven't uploaded a resume yet. Add one to increase your job opportunities."
                  }
                </p>
              </div>
            </div>}

            {userProfile?.resume && (
              <div className="resume-actions">
                <h4>Resume Actions</h4>
                <div className="action-buttons">
                  <button
                    onClick={() => setShowResumePreview(!showResumePreview)}
                    className="btn-secondary"
                  >
                    {showResumePreview ? "Hide Preview" : "Preview Resume"}
                  </button>
                  <button
                    onClick={handleDownloadResume}
                    className="btn-secondary"
                  >
                    Download Resume
                  </button>
                </div>

                {showResumePreview && (
                  <div className="resume-preview">
                    <iframe
                      src={`${apiurl}/${userProfile.resume}`}
                      title="Resume Preview"
                      className="resume-iframe"
                    ></iframe>
                  </div>
                )}
              </div>
            )}

            {userProfile?.user_id ==user?.user_id &&<div className="resume-upload">
              <h4>{userProfile?.resume ? "Update Your Resume" : "Upload Your Resume"}</h4>
              <p>Supported formats: PDF, DOC, DOCX</p>
              <form onSubmit={handleResumeUpload} className="upload-form">
                <div className="file-input-container">
                  <label htmlFor="resume-upload" className="file-input-label">
                    <i className="upload-icon">📁</i>
                    {resumeFile ? resumeFile.name : "Choose file"}
                  </label>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="file-input"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!resumeFile || isLoading}
                >
                  {isLoading ? "Uploading..." : "Upload Resume"}
                </button>
              </form>
            </div>}
          </div>
        )}

        {/* Settings Section */}
        {/* {activeTab === "settings" && (
          <div className="profile-section">
            <h3 className="section-title">Account Settings</h3>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-icon">🔒</div>
                <div className="setting-content">
                  <h4>Privacy & Security</h4>
                  <p>Manage your account security and privacy settings</p>
                </div>
                <button className="setting-action">Configure</button>
              </div>
              <div className="setting-item">
                <div className="setting-icon">🔔</div>
                <div className="setting-content">
                  <h4>Notifications</h4>
                  <p>Control how we contact you and what notifications you receive</p>
                </div>
                <button className="setting-action">Manage</button>
              </div>
              <div className="setting-item">
                <div className="setting-icon">🎨</div>
                <div className="setting-content">
                  <h4>Appearance</h4>
                  <p>Customize how the app looks and feels</p>
                </div>
                <button className="setting-action">Customize</button>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button 
                onClick={() => setShowEdit(false)}
                className="modal-close"
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Education Level</label>
                <select
                  value={formData.education_level}
                  onChange={(e) =>
                    setFormData({ ...formData, education_level: e.target.value })
                  }
                  className="form-select"
                >
                  <option value="">Select education level</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Doctorate">Doctorate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Interests</label>
                <textarea
                  value={formData.interests}
                  onChange={(e) =>
                    setFormData({ ...formData, interests: e.target.value })
                  }
                  placeholder="Separate interests with commas (e.g., Programming, Design, Marketing)"
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Profile Image</label>
                <div className="file-input-container">
                  <label htmlFor="profile-image-upload" className="file-input-label">
                    <i className="upload-icon">📷</i>
                    {formData.profile_image ? formData.profile_image.name : "Choose profile image"}
                  </label>
                  <input
                    id="profile-image-upload"
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
                    className="file-input"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowEdit(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}