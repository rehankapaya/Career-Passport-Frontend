import React from 'react'

export default function BookMarkpage() {
    const bookmarks = [
  {
    icon: '💻',
    title: 'Software Engineer',
    description: 'Design, develop, and maintain software applications and systems using various programming languages.',
    date: 'Jan 15, 2025',
    notes: 'Great career path with high demand. Need to focus on learning Python and JavaScript. Consider getting AWS certification.'
  },
  {
    icon: '📈',
    title: 'Data Scientist',
    description: 'Analyze complex data sets to extract insights and help organizations make data-driven decisions.',
    date: 'Jan 12, 2025',
    notes: 'Requires strong math and statistics background. Python, R, and SQL are essential. Consider pursuing a Master\'s in Data Science.'
  },
  {
    icon: '📝',
    title: 'Resume Writing Guide',
    description: 'Comprehensive guide on creating professional resumes that get noticed by employers and ATS systems.',
    date: 'Jan 10, 2025',
    notes: 'Excellent tips on ATS optimization. Need to update my resume format and add more quantified achievements.'
  },
  {
    icon: '🎨',
    title: 'UX/UI Designer',
    description: 'Create intuitive and visually appealing user interfaces and experiences for digital products and applications.',
    date: 'Jan 8, 2025',
    notes: 'Perfect blend of creativity and technology. Need to build a strong portfolio. Figma and Adobe Creative Suite are must-haves.'
  },
  {
    icon: '✔️',
    title: 'Interview Preparation Checklist',
    description: 'Complete checklist and strategies for acing job interviews, from preparation to follow-up.',
    date: 'Jan 5, 2025',
    notes: 'Very comprehensive guide. STAR method examples are particularly helpful. Need to practice mock interviews more.'
  },
  {
    icon: '📣',
    title: 'Digital Marketing Specialist',
    description: 'Plan and execute digital marketing campaigns across various online channels to drive brand awareness and growth.',
    date: 'Jan 3, 2025',
    notes: 'Growing field with lots of opportunities. Google Ads and Facebook Ads certifications would be valuable additions.'
  }
];

  return (
    <div>
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '80rem', margin: 'auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ backgroundColor: '#e5e7eb', borderRadius: '0.75rem', padding: '0.75rem', display: 'inline-block', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🔖</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>My Bookmarks</h1>
          <p style={{ color: '#6b7280', maxWidth: '42rem', margin: 'auto' }}>
            Your saved careers, resources, and notes - all organized in one place for easy access and sharing.
          </p>
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#4b5563', fontWeight: '500' }}>12 bookmarks saved</span>
            <span style={{ color: '#6b7280' }}>Filter:</span>
            <select style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}>
              <option>All Bookmarks</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ padding: '0.75rem 1.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#1f2937', cursor: 'pointer' }}>
              Export All
            </button>
            <button style={{ padding: '0.75rem 1.5rem', borderRadius: '0.375rem', border: 'none', backgroundColor: '#1f2937', color: '#ffffff', cursor: 'pointer' }}>
              Share Collection
            </button>
          </div>
        </div>

        {/* Bookmarks Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.5rem' }}>
          {bookmarks.map((bookmark, index) => (
            <div key={index} style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: '#e5e7eb', borderRadius: '0.5rem', padding: '0.5rem', display: 'inline-block' }}>
                    <span style={{ fontSize: '1.5rem' }}>{bookmark.icon}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>{bookmark.title}</h3>
                </div>
                <span style={{ fontSize: '1.5rem', color: '#9ca3af', cursor: 'pointer' }}>⭐</span>
              </div>

              {/* Description */}
              <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '1rem' }}>{bookmark.description}</p>
              
              {/* Notes Section */}
              <div style={{ backgroundColor: '#f9fafb', borderLeft: '3px solid #d1d5db', padding: '1rem', borderRadius: '0.25rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>My Notes:</h4>
                  <span style={{ fontSize: '1rem', color: '#6b7280', cursor: 'pointer' }}>✏️</span>
                </div>
                <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>{bookmark.notes}</p>
              </div>

              {/* Date and Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Saved on {bookmark.date}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button style={{ color: '#4b5563', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '1rem' }}>
                    📖
                  </button>
                  <button style={{ color: '#4b5563', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '1rem' }}>
                    🔗
                  </button>
                  <button style={{ color: '#4b5563', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '1rem' }}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>      
    </div>
  )
}
