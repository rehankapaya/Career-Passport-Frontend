import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiurl } from '../../api';

const AdminCareerBankPage = () => {
  const [careers, setCareers] = useState([]);
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    required_skills: '', // comma-separated in UI
    education_path: '',
    expected_salary: ''   // number
  });

  // Fetch careers on mount
  useEffect(() => {
    fetchCareers();
  }, []);

  // Filter careers when search changes
  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const filtered = careers.filter(c =>
        c.title?.toLowerCase().includes(term) ||
        c.domain?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        (Array.isArray(c.required_skills) &&
          c.required_skills.some(s => s.toLowerCase().includes(term)))
      );
      setFilteredCareers(filtered);
    } else {
      setFilteredCareers(careers);
    }
  }, [searchTerm, careers]);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      // Public GET; token not required for read, but harmless if present
      const response = await axios.get(`${apiurl}/api/careers`, { withCredentials: true });
      setCareers(response.data || []);
      setFilteredCareers(response.data || []);
    } catch (error) {
      console.error('Error fetching careers:', error);
      setMessage('Failed to fetch careers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Basic guard: expected_salary numeric-only (but allow empty)
    if (name === 'expected_salary') {
      const clean = value.replace(/[^\d.]/g, '');
      setFormData(prev => ({ ...prev, [name]: clean }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (career) => {
    setEditingCareer(career);
    setFormData({
      title: career.title || '',
      description: career.description || '',
      domain: career.domain || '',
      required_skills: Array.isArray(career.required_skills) ? career.required_skills.join(', ') : (career.required_skills || ''),
      education_path: career.education_path || '',
      expected_salary: career.expected_salary != null ? String(career.expected_salary) : ''
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      // Prepare required_skills array
      const skillsArray = formData.required_skills
        ? formData.required_skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      // Prepare expected_salary number
      const salaryNumber = formData.expected_salary === '' ? null : Number(formData.expected_salary);

      if (salaryNumber != null && Number.isNaN(salaryNumber)) {
        setMessage('Expected salary must be a valid number.');
        setFormLoading(false);
        return;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        domain: formData.domain,
        required_skills: skillsArray,
        education_path: formData.education_path,
        expected_salary: salaryNumber
      };

      if (editingCareer) {
        await axios.put(
          `${apiurl}/api/careers/${editingCareer._id}`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );
        setMessage('Career updated successfully!');
      } else {
        await axios.post(
          `${apiurl}/api/careers`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );
        setMessage('Career added successfully!');
      }

      resetForm();
      fetchCareers();
    } catch (error) {
      console.error('Save error:', error);
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
    if (!window.confirm('Are you sure you want to delete this career?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiurl}/api/careers/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true
      });
      setMessage('Career deleted successfully!');
      fetchCareers();
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('Failed to delete career');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      domain: '',
      required_skills: '',
      education_path: '',
      expected_salary: ''
    });
    setEditingCareer(null);
    setShowAddForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatSalary = (n) => {
    if (n == null) return '-';
    try {
      return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    } catch {
      return String(n);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading careers...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Career Bank Management</h1>
        <div style={styles.controls}>
          <button onClick={() => setShowAddForm(!showAddForm)} style={styles.toggleButton}>
            {showAddForm ? 'View Careers' : 'Add New Career'}
          </button>
          {!showAddForm && (
            <div style={styles.viewControls}>
              <button
                onClick={() => setViewMode('list')}
                style={{ ...styles.viewButton, ...(viewMode === 'list' ? styles.activeViewButton : {}) }}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                style={{ ...styles.viewButton, ...(viewMode === 'grid' ? styles.activeViewButton : {}) }}
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
          ...(message.toLowerCase().includes('success') ? styles.successMessage : styles.errorMessage)
        }}>
          {message}
          <button onClick={() => setMessage('')} style={styles.messageClose}>×</button>
        </div>
      )}

      {showAddForm ? (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>{editingCareer ? 'Edit Career' : 'Add New Career'}</h2>

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
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Domain *</label>
                <input
                  type="text"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="e.g., Information Technology"
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
                placeholder="Role overview, typical responsibilities..."
                rows="4"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Required Skills * (comma-separated)</label>
              <input
                type="text"
                name="required_skills"
                value={formData.required_skills}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Programming, Problem Solving, Algorithms, Teamwork"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Education Path *</label>
              <input
                type="text"
                name="education_path"
                value={formData.education_path}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g., Bachelor's degree in CS or related field"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Expected Salary *</label>
              <input
                type="text"
                name="expected_salary"
                value={formData.expected_salary}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g., 85000"
              />
            </div>

            <div style={styles.formActions}>
              <button type="button" onClick={resetForm} style={styles.cancelButton}>Cancel</button>
              <button
                type="submit"
                disabled={formLoading}
                style={{ ...styles.submitButton, ...(formLoading && styles.buttonDisabled) }}
              >
                {formLoading
                  ? (editingCareer ? 'Updating...' : 'Adding...')
                  : (editingCareer ? 'Update Career' : 'Add Career')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search careers by title, domain, skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <span style={styles.resourceCount}>
              {filteredCareers.length} career(s) found
            </span>
          </div>

          {filteredCareers.length === 0 ? (
            <div style={styles.emptyState}>
              <h3>No careers found</h3>
              <p>{searchTerm ? 'Try a different search term' : 'Add the first career to get started'}</p>
            </div>
          ) : viewMode === 'list' ? (
            <div style={styles.listContainer}>
              <div style={styles.tableHeader}>
                <div style={styles.tableCell}>Title</div>
                <div style={styles.tableCell}>Domain</div>
                <div style={styles.tableCell}>Salary</div>
                <div style={styles.tableCell}>Created</div>
                <div style={styles.tableCell}>Actions</div>
              </div>
              {filteredCareers.map(career => (
                <div key={career._id} style={styles.tableRow}>
                  <div style={styles.tableCell}>
                    <div style={styles.resourceTitle}>{career.title}</div>
                    <div style={styles.resourceDescription}>
                      {career.description?.length > 110
                        ? `${career.description.substring(0, 110)}...`
                        : career.description}
                    </div>
                    {Array.isArray(career.required_skills) && career.required_skills.length > 0 && (
                      <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {career.required_skills.slice(0, 6).map((s, i) => (
                          <span key={i} style={styles.tag}>{s}</span>
                        ))}
                        {career.required_skills.length > 6 && (
                          <span style={{ ...styles.tag, background: '#eef2ff', borderColor: '#c7d2fe' }}>
                            +{career.required_skills.length - 6} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={styles.tableCell}>
                    <span style={styles.categoryBadge}>{career.domain}</span>
                  </div>

                  <div style={styles.tableCell}>
                    <span style={styles.viewsCount}>{formatSalary(career.expected_salary)}</span>
                  </div>

                  <div style={styles.tableCell}>{formatDate(career.createdAt)}</div>

                  <div style={styles.tableCell}>
                    <div style={styles.actionButtons}>
                      <button onClick={() => handleEditClick(career)} style={styles.editButton}>Edit</button>
                      <button onClick={() => handleDelete(career._id)} style={styles.deleteButton}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.gridContainer}>
              {filteredCareers.map(career => (
                <div key={career._id} style={styles.gridCard}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{career.title}</h3>
                    <span style={styles.cardCategory}>{career.domain}</span>
                  </div>

                  <p style={styles.cardDescription}>{career.description}</p>

                  <div style={styles.cardMeta}>
                    <span style={styles.cardViews}>{formatSalary(career.expected_salary)}</span>
                    <span style={styles.cardDate}>{formatDate(career.createdAt)}</span>
                  </div>

                  {Array.isArray(career.required_skills) && career.required_skills.length > 0 && (
                    <div style={styles.cardTags}>
                      {career.required_skills.map((s, i) => (
                        <span key={i} style={styles.tag}>{s}</span>
                      ))}
                    </div>
                  )}

                  <div style={styles.cardActions}>
                    <button onClick={() => handleEditClick(career)} style={styles.cardEditButton}>Edit</button>
                    <button onClick={() => handleDelete(career._id)} style={styles.cardDeleteButton}>Delete</button>
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

/* ---- styles cloned & adapted from AdminAddResourcePage ---- */
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' },
  pageTitle: { color: '#2c3e50', margin: 0 },
  controls: { display: 'flex', gap: '15px', alignItems: 'center' },
  toggleButton: { padding: '10px 20px', backgroundColor: '#4b6cb7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, transition: 'background-color 0.3s ease' },
  viewControls: { display: 'flex', gap: '8px' },
  viewButton: { padding: '8px 16px', backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #e9ecef', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.3s ease' },
  activeViewButton: { backgroundColor: '#4b6cb7', color: '#fff', borderColor: '#4b6cb7' },
  loadingContainer: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: '#666' },
  spinner: { width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #4b6cb7', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 15 },
  message: { padding: '12px 20px', borderRadius: '6px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 500 },
  successMessage: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
  errorMessage: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
  messageClose: { background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'inherit' },
  formContainer: { backgroundColor: '#fff', padding: 30, borderRadius: 8, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: 20 },
  formTitle: { textAlign: 'center', color: '#333', marginBottom: 30, fontSize: 24, fontWeight: 600 },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontWeight: 600, color: '#333', fontSize: 14 },
  input: { padding: 12, border: '1px solid #ddd', borderRadius: 4, fontSize: 16, outline: 'none', transition: 'border-color 0.3s ease' },
  textarea: { padding: 12, border: '1px solid #ddd', borderRadius: 4, fontSize: 16, outline: 'none', resize: 'vertical', minHeight: 100, transition: 'border-color 0.3s ease' },
  formActions: { display: 'flex', justifyContent: 'flex-end', gap: 15, marginTop: 10 },
  cancelButton: { padding: '12px 24px', backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #e9ecef', borderRadius: 4, cursor: 'pointer', fontWeight: 500, transition: 'all 0.3s ease' },
  submitButton: { padding: '12px 24px', backgroundColor: '#4b6cb7', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 500, transition: 'background-color 0.3s ease' },
  buttonDisabled: { backgroundColor: '#6c757d', cursor: 'not-allowed' },
  searchContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 15 },
  searchInput: { padding: '12px 16px', border: '1px solid #ddd', borderRadius: 6, fontSize: 16, minWidth: 300, outline: 'none', transition: 'border-color 0.3s ease' },
  resourceCount: { color: '#6c757d', fontSize: 14 },
  emptyState: { textAlign: 'center', padding: 40, color: '#6c757d', backgroundColor: '#f8f9fa', borderRadius: 8 },
  listContainer: { backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr 1fr 1fr', padding: '15px 20px', backgroundColor: '#f8f9fa', fontWeight: 600, color: '#495057', borderBottom: '1px solid #e9ecef' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr 1fr 1fr', padding: '15px 20px', borderBottom: '1px solid #e9ecef', alignItems: 'center', transition: 'background-color 0.2s ease' },
  tableCell: { padding: '0 10px' },
  resourceTitle: { fontWeight: 600, color: '#2c3e50', marginBottom: 5 },
  resourceDescription: { color: '#6c757d', fontSize: 14 },
  categoryBadge: { padding: '4px 10px', backgroundColor: '#e7f3ff', color: '#007bff', borderRadius: 12, fontSize: 12, fontWeight: 500 },
  viewsCount: { fontWeight: 600, color: '#495057' },
  actionButtons: { display: 'flex', gap: 10 },
  editButton: { padding: '6px 12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14, transition: 'background-color 0.3s ease' },
  deleteButton: { padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14, transition: 'background-color 0.3s ease' },
  gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
  gridCard: { backgroundColor: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  cardTitle: { margin: 0, color: '#2c3e50', fontSize: 18, fontWeight: 600, flex: 1 },
  cardCategory: { padding: '4px 8px', backgroundColor: '#e7f3ff', color: '#007bff', borderRadius: 12, fontSize: 12, fontWeight: 500, marginLeft: 10 },
  cardDescription: { color: '#6c757d', marginBottom: 15, lineHeight: 1.5 },
  cardMeta: { display: 'flex', justifyContent: 'space-between', marginBottom: 15, fontSize: 14, color: '#6c757d' },
  cardTags: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  tag: { padding: '4px 8px', backgroundColor: '#f8f9fa', color: '#495057', borderRadius: 4, fontSize: 12, border: '1px solid #e9ecef' },
  cardActions: { display: 'flex', gap: 10 },
  cardEditButton: { padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14, flex: 1, transition: 'background-color 0.3s ease' },
  cardDeleteButton: { padding: '8px 16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14, flex: 1, transition: 'background-color 0.3s ease' }
};

// Add CSS animation for spinner (guard for environments without stylesheets)
try {
  const sheet = document.styleSheets?.[0];
  if (sheet) {
    sheet.insertRule(`
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `, sheet.cssRules.length);
  }
} catch { /* no-op */ }

export default AdminCareerBankPage;
