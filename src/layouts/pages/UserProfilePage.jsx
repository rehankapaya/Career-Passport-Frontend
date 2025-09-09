import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiurl } from '../../api';

export default function UserProfilePage() {
  const [profile, setProfile] = useState(null);
  const [education_level, setEducationLevel] = useState('');
  const [interests, setInterests] = useState('');
  const [profile_image, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch profile on mount
  useEffect(() => {
    axios.get(`${apiurl}/api/user-profile`, { withCredentials: true })
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  // Preview selected image
  useEffect(() => {
    if (!profile_image) return setPreview(null);
    const objectUrl = URL.createObjectURL(profile_image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profile_image]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('education_level', education_level);
    formData.append('interests', interests);
    if (profile_image) formData.append('profile_image', profile_image);

    try {
      const res = await axios.post(`${apiurl}/api/user-profile`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(res.data);
      setProfileImage(null);
      setPreview(null);
    } catch (err) {
      alert('Error updating profile');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 500 }}>
      <h2>User Profile</h2>
      {profile && (
        <div className="card" style={{ marginBottom: 32 }}>
          {profile.profile_image && (
            <img
              src={`/${profile.profile_image.replace(/\\/g, '/')}`}
              alt="Profile"
              style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }}
            />
          )}
          <div><strong>Education Level:</strong> {profile.education_level}</div>
          <div><strong>Interests:</strong> {profile.interests && profile.interests.join(', ')}</div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="card">
        <label>
          Education Level:
          <input
            type="text"
            value={education_level}
            onChange={e => setEducationLevel(e.target.value)}
            placeholder="e.g. Bachelor's, Master's"
          />
        </label>
        <label>
          Interests (comma separated):
          <input
            type="text"
            value={interests}
            onChange={e => setInterests(e.target.value)}
            placeholder="e.g. Coding, Design"
          />
        </label>
        <label>
          Profile Image:
          <input
            type="file"
            accept="image/*"
            onChange={e => setProfileImage(e.target.files[0])}
          />
        </label>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }}
          />
        )}
        <button type="submit" style={{ marginTop: 16 }}>Save Profile</button>
      </form>
    </div>
  );
}