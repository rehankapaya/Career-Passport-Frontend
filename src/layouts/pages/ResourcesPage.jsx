import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { apiurl } from '../../api';
import { Link } from 'react-router-dom';
import { useBookmark } from '../../hooks/useBookmark';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { UserContext } from '../../context/UserContext';

// Resource Card Component with Bookmark
const ResourceCard = ({ resource }) => {
  const { isBookmarked, loading, toggleBookmark } = useBookmark('resource', resource.resource_id);
  const { user } = useContext(UserContext);

  const formattedDate = resource?.createdAt
    ? new Date(resource.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  async function saveHistory() {
    try {
      const payload = {
        userId: user._id,
        categoryType: "resources",
        itemId: resource._id || resource.resource_id || resource.career_id,
        title: resource.title,
        subCategory: resource.category || null,
        meta: resource,
      };
      await axios.post(`${apiurl}/api/history`, payload);
    } catch (err) {
      console.error("Error saving history", err);
    }
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'transform 0.2s',
        minHeight: '320px', // ensures card height consistency
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {/* Bookmark Button */}
      <button
        onClick={toggleBookmark}
        disabled={loading}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          padding: '0.5rem',
          borderRadius: '0.375rem',
          color: isBookmarked ? '#f59e0b' : '#9ca3af',
          transition: 'all 0.2s',
        }}
        title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
      >
        {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
      </button>

      {/* Content */}
      <div style={{ flexGrow: 1 }}>
        {/* Icon + Date row (no conflict with bookmark now) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#6b7280',
            fontSize: '0.875rem',
            marginBottom: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>📄</span>
          <span>{formattedDate}</span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.5rem',
            lineHeight: '1.4',
          }}
        >
          {resource.title}
        </h3>

        {/* Description */}
        <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.5' }}>
          {resource.description}
        </p>
      </div>

      {/* Read Article Button (always stays inside card) */}
      <div style={{ marginTop: 'auto' }}>
        <Link
          onClick={saveHistory}
          to={`/resources/${resource.resource_id}`}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            border: 'none',
            textDecoration: 'none',
            display: 'block',
            textAlign: 'center',
            fontWeight: '500',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          Read Article
        </Link>
      </div>
    </div>
  );
};

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);

  const featuredResources = [
    { title: 'Career Planning Toolkit', description: 'Comprehensive guides and worksheets to map your career journey from start to success.' },
    { title: 'Industry Insights Hub', description: 'Stay updated with the latest trends, skills demands, and opportunities across industries.' },
    { title: 'Skill Development Center', description: 'Curated learning paths and resources to build in-demand skills for your target career.' },
  ];

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${apiurl}/api/resources`);
      console.log(response.data);

      setResources(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '80rem', margin: 'auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              backgroundColor: '#e5e7eb',
              borderRadius: '0.75rem',
              padding: '0.75rem',
              display: 'inline-block',
              marginBottom: '1rem',
            }}
          >
            <span style={{ fontSize: '2rem' }}>📖</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
            Your Career Resources in One Place
          </h1>
          <p style={{ color: '#6b7280', maxWidth: '42rem', margin: 'auto' }}>
            Access comprehensive learning materials, guides, and tools to accelerate your career journey and make informed decisions.
          </p>
        </div>

        {/* Resources Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {resources.map((r, index) => (
            <ResourceCard key={index} resource={r} />
          ))}
        </div>

        {/* Load More */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <button
            style={{
              backgroundColor: '#e5e7eb',
              color: '#374151',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            + Load More Articles
          </button>
        </div>

        {/* Featured Resources */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
            Featured Resources
          </h2>
          <p style={{ color: '#6b7280' }}>Handpicked resources to accelerate your career development</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {featuredResources.map((resource, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.75rem',
                padding: '2rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                textAlign: 'center',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {index === 0 && '🛠️'}
                {index === 1 && '💡'}
                {index === 2 && '📚'}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                {resource.title}
              </h3>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{resource.description}</p>
              <button
                style={{
                  backgroundColor: '#ffffff',
                  color: '#2563eb',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #2563eb',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#2563eb';
                }}
              >
                {index === 0 && 'Explore Toolkit'}
                {index === 1 && 'View Insights'}
                {index === 2 && 'Start Learning'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
