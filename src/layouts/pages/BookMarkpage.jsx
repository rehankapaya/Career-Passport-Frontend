import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookmark } from '../../hooks/useBookmark';
import { BookmarkCheck, ExternalLink, Calendar, Tag } from 'lucide-react';
import axios from 'axios';
import { apiurl } from '../../api';

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, resource, multimedia, career, story

  const { getBookmarks } = useBookmark();

  useEffect(() => {
    fetchBookmarks();
  }, [filter]);

  const fetchItemDetails = async (bookmark) => {
    try {
      let endpoint = '';
      switch (bookmark.itemType) {
        case 'resource':
          endpoint = `${apiurl}/api/resources/${bookmark.itemId}`;
          break;
        case 'multimedia':
          endpoint = `${apiurl}/api/multimedia/${bookmark.itemId}`;
          break;
        case 'career':
          endpoint = `${apiurl}/api/careers/${bookmark.itemId}`;
          break;
        case 'story':
          endpoint = `${apiurl}/api/success-stories/${bookmark.itemId}`;
          break;
        default:
          return bookmark;
      }
      const res = await axios.get(endpoint);
      const data = res.data;
      let displayTitle = 'Bookmarked Item';
      if (bookmark.itemType === 'story') {
        displayTitle = data.rname || data.title || displayTitle;
      } else {
        displayTitle = data.title || displayTitle;
      }
      return { ...bookmark, displayTitle };
    } catch (e) {
      return { ...bookmark, displayTitle: 'Bookmarked Item' };
    }
  };

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const data = await getBookmarks(filter === 'all' ? null : filter);
      const enriched = await Promise.all(data.map(fetchItemDetails));
      setBookmarks(enriched);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const getItemTypeIcon = (type) => {
    switch (type) {
      case 'resource': return '📄';
      case 'multimedia': return '🎥';
      case 'career': return '💼';
      case 'story': return '📖';
      default: return '📌';
    }
  };

  const getItemTypeColor = (type) => {
    switch (type) {
      case 'resource': return '#3b82f6';
      case 'multimedia': return '#8b5cf6';
      case 'career': return '#10b981';
      case 'story': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getItemLink = (bookmark) => {
    switch (bookmark.itemType) {
      case 'resource': return `/resources/${bookmark.itemId}`;
      case 'multimedia': return `/multimedia/${bookmark.itemId}`;
      case 'career': return `/careers/${bookmark.itemId}`;
      case 'story': return `/success-stories/${bookmark.itemId}`;
      default: return '#';
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '2rem' }}>
        <div style={{ maxWidth: '80rem', margin: 'auto' }}>
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p>Loading your bookmarks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '2rem' }}>
      <div style={{ maxWidth: '80rem', margin: 'auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ backgroundColor: '#f59e0b', borderRadius: '0.75rem', padding: '0.75rem', display: 'inline-block', marginBottom: '1rem' }}>
            <BookmarkCheck size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>My Bookmarks</h1>
          <p style={{ color: '#6b7280', maxWidth: '42rem', margin: 'auto' }}>
            All your saved resources, multimedia, careers, and success stories in one place.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All', count: bookmarks.length },
            { key: 'resource', label: 'Resources', count: bookmarks.filter(b => b.itemType === 'resource').length },
            { key: 'multimedia', label: 'Multimedia', count: bookmarks.filter(b => b.itemType === 'multimedia').length },
            { key: 'career', label: 'Careers', count: bookmarks.filter(b => b.itemType === 'career').length },
            { key: 'story', label: 'Stories', count: bookmarks.filter(b => b.itemType === 'story').length }
          ].map(filterOption => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              style={{
                backgroundColor: filter === filterOption.key ? '#1f2937' : '#ffffff',
                color: filter === filterOption.key ? '#ffffff' : '#1f2937',
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: '1px solid #d1d5db',
                cursor: 'pointer',
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {filterOption.label}
              <span style={{
                backgroundColor: filter === filterOption.key ? '#374151' : '#e5e7eb',
                color: filter === filterOption.key ? '#ffffff' : '#6b7280',
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {filterOption.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bookmarks Grid */}
        {bookmarks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📌</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>No bookmarks yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Start bookmarking resources, multimedia, careers, and stories to see them here.
            </p>
            <Link
              to="/resources"
              style={{
                backgroundColor: '#1f2937',
                color: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Browse Resources
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {bookmarks.map((bookmark) => (
              <div key={bookmark._id} style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{getItemTypeIcon(bookmark.itemType)}</span>
                    <span style={{
                      backgroundColor: getItemTypeColor(bookmark.itemType) + '20',
                      color: getItemTypeColor(bookmark.itemType),
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {bookmark.itemType}
                    </span>
                  </div>
                  <ExternalLink size={16} color="#6b7280" />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                    {bookmark.displayTitle || 'Bookmarked Item'}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>
                    ID: {bookmark.itemId}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    <Calendar size={14} />
                    <span>Saved {formatDate(bookmark.createdAt)}</span>
                  </div>
                </div>

                <Link
                  to={getItemLink(bookmark)}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#1f2937',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',   // smaller padding
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textAlign: 'center',
                    marginTop: '0.5rem'
                  }}
                >
                  View Item
                </Link>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}