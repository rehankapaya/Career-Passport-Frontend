import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiurl } from '../../api';

const AdminAddResourcePage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    file_url: '',
    tag: ''
  });

  // Fetch resources on component mount
  useEffect(() => {
    fetchResources();
  }, []);

  // Filter resources when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = resources.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.tag && Array.isArray(resource.tag) && 
          resource.tag.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setFilteredResources(filtered);
    } else {
      setFilteredResources(resources);
    }
  }, [searchTerm, resources]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiurl}/api/resources`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true
      });
      setResources(response.data);
      setFilteredResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setMessage('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditClick = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      category: resource.category,
      description: resource.description,
      file_url: resource.file_url,
      tag: Array.isArray(resource.tag) ? resource.tag.join(', ') : resource.tag || ''
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      let response;
      
      // Prepare tag data
      const tagArray = formData.tag 
        ? formData.tag.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const requestData = {
        ...formData,
        tag: tagArray
      };

      if (editingResource) {
        // Update existing resource
        response = await axios.put(
          `${apiurl}/api/resources/${editingResource._id}`,
          requestData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );
        setMessage('Resource updated successfully!');
      } else {
        // Create new resource
        response = await axios.post(
          `${apiurl}/api/resources`,
          requestData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );
        setMessage('Resource added successfully!');
      }

      // Reset form and refresh resources
      resetForm();
      fetchResources();
    } catch (error) {
      if (error.response?.status === 400) {
        setMessage('All required fields must be provided.');
      } else if (error.response?.status === 401) {
        setMessage('Unauthorized. Please log in as admin.');
      } else {
        setMessage('Server error. Please try again.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiurl}/api/resources/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true
      });
      
      setMessage('Resource deleted successfully!');
      fetchResources(); // Refresh the list
    } catch (error) {
      setMessage('Failed to delete resource');
      console.error('Delete error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      file_url: '',
      tag: ''
    });
    setEditingResource(null);
    setShowAddForm(false);
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
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading resources...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Resource Management</h1>
        <div style={styles.controls}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={styles.toggleButton}
          >
            {showAddForm ? 'View Resources' : 'Add New Resource'}
          </button>
          {!showAddForm && (
            <div style={styles.viewControls}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  ...styles.viewButton,
                  ...(viewMode === 'list' ? styles.activeViewButton : {})
                }}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  ...styles.viewButton,
                  ...(viewMode === 'grid' ? styles.activeViewButton : {})
                }}
              >
                Grid View
              </button>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div style={{
          ...styles.message,
          ...(message.includes('success') ? styles.successMessage : styles.errorMessage)
        }}>
          {message}
          <button 
            onClick={() => setMessage('')} 
            style={styles.messageClose}
          >
            ×
          </button>
        </div>
      )}

      {showAddForm ? (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>
            {editingResource ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Enter resource title"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Enter category"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                style={styles.textarea}
                placeholder="Enter description"
                rows="4"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>File URL *</label>
              <input
                type="url"
                name="file_url"
                value={formData.file_url}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="https://example.com/file.pdf"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Tags</label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                style={styles.input}
                placeholder="Comma-separated tags (e.g., Beginner, Scholarship)"
              />
            </div>

            <div style={styles.formActions}>
              <button
                type="button"
                onClick={resetForm}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                style={{
                  ...styles.submitButton,
                  ...(formLoading && styles.buttonDisabled)
                }}
              >
                {formLoading 
                  ? (editingResource ? 'Updating...' : 'Adding...') 
                  : (editingResource ? 'Update Resource' : 'Add Resource')
                }
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <span style={styles.resourceCount}>
              {filteredResources.length} resource(s) found
            </span>
          </div>

          {filteredResources.length === 0 ? (
            <div style={styles.emptyState}>
              <h3>No resources found</h3>
              <p>{searchTerm ? 'Try a different search term' : 'Add your first resource to get started'}</p>
            </div>
          ) : viewMode === 'list' ? (
            <div style={styles.listContainer}>
              <div style={styles.tableHeader}>
                <div style={styles.tableCell}>Title</div>
                <div style={styles.tableCell}>Category</div>
                <div style={styles.tableCell}>Views</div>
                <div style={styles.tableCell}>Created</div>
                <div style={styles.tableCell}>Actions</div>
              </div>
              {filteredResources.map(resource => (
                <div key={resource._id} style={styles.tableRow}>
                  <div style={styles.tableCell}>
                    <div style={styles.resourceTitle}>{resource.title}</div>
                    <div style={styles.resourceDescription}>
                      {resource.description.length > 100 
                        ? `${resource.description.substring(0, 100)}...` 
                        : resource.description
                      }
                    </div>
                  </div>
                  <div style={styles.tableCell}>
                    <span style={styles.categoryBadge}>{resource.category}</span>
                  </div>
                  <div style={styles.tableCell}>
                    <span style={styles.viewsCount}>{resource.views_count}</span>
                  </div>
                  <div style={styles.tableCell}>
                    {formatDate(resource.createdAt)}
                  </div>
                  <div style={styles.tableCell}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleEditClick(resource)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(resource._id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.gridContainer}>
              {filteredResources.map(resource => (
                <div key={resource._id} style={styles.gridCard}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{resource.title}</h3>
                    <span style={styles.cardCategory}>{resource.category}</span>
                  </div>
                  <p style={styles.cardDescription}>{resource.description}</p>
                  <div style={styles.cardMeta}>
                    <span style={styles.cardViews}>{resource.views_count} views</span>
                    <span style={styles.cardDate}>{formatDate(resource.createdAt)}</span>
                  </div>
                  {resource.tag && resource.tag.length > 0 && (
                    <div style={styles.cardTags}>
                      {resource.tag.map((tag, index) => (
                        <span key={index} style={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                  <div style={styles.cardActions}>
                    <button
                      onClick={() => handleEditClick(resource)}
                      style={styles.cardEditButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resource._id)}
                      style={styles.cardDeleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  pageTitle: {
    color: '#2c3e50',
    margin: '0'
  },
  controls: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  toggleButton: {
    padding: '10px 20px',
    backgroundColor: '#4b6cb7',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.3s ease'
  },
  viewControls: {
    display: 'flex',
    gap: '8px'
  },
  viewButton: {
    padding: '8px 16px',
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  activeViewButton: {
    backgroundColor: '#4b6cb7',
    color: 'white',
    borderColor: '#4b6cb7'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    color: '#666'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4b6cb7',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px'
  },
  message: {
    padding: '12px 20px',
    borderRadius: '6px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '500'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  messageClose: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: 'inherit'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px'
  },
  formTitle: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
    fontSize: '24px',
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontWeight: '600',
    color: '#333',
    fontSize: '14px'
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
    transition: 'border-color 0.3s ease'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '10px'
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
    border: '1px solid #e9ecef',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#4b6cb7',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.3s ease'
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed'
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  searchInput: {
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    minWidth: '300px',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  },
  resourceCount: {
    color: '#6c757d',
    fontSize: '14px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  listContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 0.5fr 1fr 1fr',
    padding: '15px 20px',
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    color: '#495057',
    borderBottom: '1px solid #e9ecef'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 0.5fr 1fr 1fr',
    padding: '15px 20px',
    borderBottom: '1px solid #e9ecef',
    alignItems: 'center',
    transition: 'background-color 0.2s ease'
  },
  tableRowHover: {
    backgroundColor: '#f8f9fa'
  },
  tableCell: {
    padding: '0 10px'
  },
  resourceTitle: {
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '5px'
  },
  resourceDescription: {
    color: '#6c757d',
    fontSize: '14px'
  },
  categoryBadge: {
    padding: '4px 10px',
    backgroundColor: '#e7f3ff',
    color: '#007bff',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  viewsCount: {
    fontWeight: '600',
    color: '#495057'
  },
  actionButtons: {
    display: 'flex',
    gap: '10px'
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease'
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  gridCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  gridCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px'
  },
  cardTitle: {
    margin: '0',
    color: '#2c3e50',
    fontSize: '18px',
    fontWeight: '600',
    flex: '1'
  },
  cardCategory: {
    padding: '4px 8px',
    backgroundColor: '#e7f3ff',
    color: '#007bff',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    marginLeft: '10px'
  },
  cardDescription: {
    color: '#6c757d',
    marginBottom: '15px',
    lineHeight: '1.5'
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    fontSize: '14px',
    color: '#6c757d'
  },
  cardTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '15px'
  },
  tag: {
    padding: '4px 8px',
    backgroundColor: '#f8f9fa',
    color: '#495057',
    borderRadius: '4px',
    fontSize: '12px',
    border: '1px solid #e9ecef'
  },
  cardActions: {
    display: 'flex',
    gap: '10px'
  },
  cardEditButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    flex: '1',
    transition: 'background-color 0.3s ease'
  },
  cardDeleteButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    flex: '1',
    transition: 'background-color 0.3s ease'
  }
};

// Add CSS animation for spinner
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default AdminAddResourcePage;