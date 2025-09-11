import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ResourceDetailsPage() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:5000/api/resources/${id}`);
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

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '40px 20px'
      }}>
        <div style={{
          fontSize: '16px',
          color: '#666',
          textAlign: 'center'
        }}>
          Loading resource details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '40px 20px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{
            color: '#dc3545',
            fontSize: '18px',
            marginBottom: '16px',
            fontWeight: '500'
          }}>
            {error}
          </div>
          <button
            onClick={fetchResource}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '40px 20px'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '500' }}>
            Resource not found
          </div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            The requested resource could not be found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: '#007bff',
            border: '1px solid #007bff',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '24px',
            fontWeight: '500'
          }}
        >
          â† Back
        </button>

        {/* Main Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #eaeaea',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '32px',
            borderBottom: '1px solid #eaeaea'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <h1 style={{
                margin: '0',
                fontSize: '28px',
                fontWeight: '600',
                color: '#1a1a1a',
                lineHeight: '1.3'
              }}>
                {resource.title}
              </h1>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: '#f8f9fa',
                  color: '#495057',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  border: '1px solid #e9ecef'
                }}>
                  {resource.category}
                </span>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: '#e7f3ff',
                  color: '#007bff',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {resource.views_count} views
                </span>
              </div>
            </div>

            <p style={{
              color: '#666',
              lineHeight: '1.6',
              fontSize: '16px',
              margin: '0',
              marginTop: '16px'
            }}>
              {resource.description}
            </p>
          </div>

          {/* Content */}
          <div style={{
            padding: '32px'
          }}>
            {/* File Download */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <a
                  href={resource.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>ðŸ“„</span>
                  Download Resource
                </a>
                <span style={{
                  color: '#999',
                  fontSize: '14px'
                }}>
                  PDF Document
                </span>
              </div>
            </div>

            {/* Tags */}
            {resource.tag && resource.tag.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  color: '#333',
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  Tags
                </h3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {resource.tag.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f8f9fa',
                        color: '#495057',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500',
                        border: '1px solid #e9ecef'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Grid */}
            <div>
              <h3 style={{
                color: '#333',
                margin: '0 0 20px 0',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Details
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <div>
                  <div style={{
                    color: '#999',
                    fontSize: '13px',
                    fontWeight: '500',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Created By
                  </div>
                  <div style={{
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {resource.created_by || 'Not specified'}
                  </div>
                </div>

                <div>
                  <div style={{
                    color: '#999',
                    fontSize: '13px',
                    fontWeight: '500',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Created
                  </div>
                  <div style={{
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {formatDate(resource.createdAt)}
                  </div>
                </div>

                <div>
                  <div style={{
                    color: '#999',
                    fontSize: '13px',
                    fontWeight: '500',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Updated
                  </div>
                  <div style={{
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {formatDate(resource.updatedAt)}
                  </div>
                </div>

                <div>
                  <div style={{
                    color: '#999',
                    fontSize: '13px',
                    fontWeight: '500',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    ID
                  </div>
                  <div style={{
                    color: '#666',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all'
                  }}>
                    {resource._id}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '24px 32px',
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #eaeaea',
            textAlign: 'center'
          }}>
            <div style={{
              color: '#999',
              fontSize: '13px'
            }}>
              Resource ID: {resource._id} â€¢ Version: {resource.__v}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};