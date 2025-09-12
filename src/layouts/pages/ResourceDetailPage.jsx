import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './ResourceDetailsPage.css';
import { useBookmark } from '../../hooks/useBookmark';
import { Bookmark, BookmarkCheck } from 'lucide-react';
export default function ResourceDetailsPage() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'download'
  
  // Bookmark functionality
  const { isBookmarked, loading: bookmarkLoading, toggleBookmark } = useBookmark('resource', id);

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:5000/api/resources/${id}`);
      console.log(response.data)
      setResource(response.data);
    } catch (error) {
      setError('Failed to fetch resource. Please try again.');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileType = (filename) => {
    if (!filename) return 'Unknown';
    const extension = filename.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return 'PDF Document';
    if (['doc', 'docx'].includes(extension)) return 'Word Document';
    if (['xls', 'xlsx'].includes(extension)) return 'Excel Spreadsheet';
    if (['ppt', 'pptx'].includes(extension)) return 'PowerPoint Presentation';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'Image';
    return 'File';
  };

  const handleDownload = () => {
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = resource.file_url;
    link.setAttribute('download', resource.title || 'resource');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="resource-loading">
        <div className="loading-spinner"></div>
        <p>Loading resource details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resource-error">
        <div className="error-content">
          <h3>{error}</h3>
          <button onClick={fetchResource} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="resource-not-found">
        <h3>Resource not found</h3>
        <p>The requested resource could not be found.</p>
      </div>
    );
  }

  return (
    <div className="resource-details-container">
      <div className="resource-details-content">
        {/* Back Button */}
        <button onClick={() => window.history.back()} className="back-button">
          ← Back to Resources
        </button>

        {/* Main Card */}
        <div className="resource-card">
          {/* Header */}
          <div className="resource-header">
            <div className="resource-title-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h1>{resource.title}</h1>
                <button
                  onClick={toggleBookmark}
                  disabled={bookmarkLoading}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: bookmarkLoading ? 'not-allowed' : 'pointer',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    color: isBookmarked ? '#f59e0b' : '#6b7280',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                >
                  {isBookmarked ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </span>
                </button>
              </div>
              <div className="resource-badges">
                <span className="category-badge">{resource.category}</span>
                <span className="views-badge">{resource.views_count} views</span>
              </div>
            </div>

            <p className="resource-description">{resource.description}</p>
          </div>

          {/* Content */}
          <div className="resource-content">
            {/* File Actions */}
            <div className="file-actions-section">
              <div className="view-mode-toggle">
                <button 
                  className={viewMode === 'preview' ? 'toggle-active' : ''}
                  onClick={() => setViewMode('preview')}
                >
                  Preview
                </button>
                <button 
                  className={viewMode === 'download' ? 'toggle-active' : ''}
                  onClick={() => setViewMode('download')}
                >
                  Download
                </button>
              </div>

   {viewMode === 'preview' ? (
  <div className="preview-section">
    <h3>Document Preview</h3>
    <div className="preview-container">
      {resource.file_url ? (
        <iframe
          src={
            resource.file_url.includes("drive.google.com")
              ? `https://drive.google.com/file/d/${
                  resource.file_url.split("/d/")[1].split("/")[0]
                }/preview`
              : resource.file_url
          }
          className="document-preview"
          title="Document Preview"
        />
      ) : (
        <p>No file available.</p>
      )}
    </div>
  </div>
) : (
  <div className="download-section">
  <h3>Download Resource</h3>
  <div className="download-info">
    <div className="file-type">{getFileType(resource.file_url)}</div>
    <p>Click the button below to download this resource to your device.</p>
  </div>
  <div className="download-actions">
    <button
      onClick={() => {
        let fileUrl = resource.file_url;

        // Agar Google Drive ka link hai to download link me convert karo
        if (fileUrl.includes("drive.google.com")) {
          const fileId = fileUrl.match(/\/d\/(.*?)\//)?.[1];
          if (fileId) {
            fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
          }
        }

        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", resource.title || "resource");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }}
      className="download-button"
    >
      Download Now
    </button>

    <Link
      to={resource.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="open-link"
    >
      Open in New Tab
    </Link>
  </div>

  </div>
)}

            </div>

            {/* Tags */}
            {resource.tag && resource.tag.length > 0 && (
              <div className="tags-section">
                <h3>Tags</h3>
                <div className="tags-container">
                  {resource.tag.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="metadata-section">
              <h3>Details</h3>
              <div className="metadata-grid">
                <div className="metadata-item">
                  <label>Created By</label>
                  <span>{resource.created_by || 'Not specified'}</span>
                </div>

                <div className="metadata-item">
                  <label>Created</label>
                  <span>{formatDate(resource.createdAt)}</span>
                </div>

                <div className="metadata-item">
                  <label>Updated</label>
                  <span>{formatDate(resource.updatedAt)}</span>
                </div>

                <div className="metadata-item">
                  <label>File Type</label>
                  <span>{getFileType(resource.file_url)}</span>
                </div>

                <div className="metadata-item full-width">
                  <label>Resource ID</label>
                  <span className="resource-id">{resource._id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="resource-footer">
            <p>Resource ID: {resource._id} • Version: {resource.__v}</p>
          </div>
        </div>
      </div>
    </div>
  );
}