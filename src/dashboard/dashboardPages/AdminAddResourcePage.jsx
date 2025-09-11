import React, { useState } from 'react';
import axios from 'axios';
import { apiurl } from '../../api';

const AdminAddResourcePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    file_url: '',
    tag: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Get admin token from localStorage or context
      const token = localStorage.getItem('token'); // Adjust based on your auth implementation
      
      const response = await axios.post(`${apiurl}/api/resources`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials:true
      });

      console.log('Resource added:', response.data);

      setMessage('Resource added successfully!');
      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        file_url: '',
        tag: '',
      });
    } catch (error) {
      if (error.response?.status === 400) {
        setMessage('All required fields must be provided.');
      } else if (error.response?.status === 401) {
        setMessage('Unauthorized. Please log in as admin.');
      } else {
        setMessage('Server error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add New Resource</h2>
        
        {message && (
          <div style={{
            ...styles.message,
            ...(message.includes('success') ? styles.successMessage : styles.errorMessage)
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
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
            <label style={styles.label}>Tag</label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              style={styles.input}
              placeholder="Optional tag"
            />
          </div>

        
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading && styles.buttonDisabled)
            }}
          >
            {loading ? 'Adding Resource...' : 'Add Resource'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px'
  },
  title: {
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
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
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
    transition: 'border-color 0.3s ease',
    ':focus': {
      borderColor: '#007bff'
    }
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
    transition: 'border-color 0.3s ease',
    ':focus': {
      borderColor: '#007bff'
    }
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    ':hover': {
      backgroundColor: '#0056b3'
    }
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
    ':hover': {
      backgroundColor: '#6c757d'
    }
  },
  message: {
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center',
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
  }
};

// Add focus styles (React doesn't support pseudo-classes in inline styles)
const addFocusStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    input:focus, textarea:focus {
      border-color: #007bff !important;
    }
  `;
  document.head.appendChild(style);
};

// Call this function in componentDidMount or useEffect
// For simplicity, you can add this to your main CSS file instead

export default AdminAddResourcePage;