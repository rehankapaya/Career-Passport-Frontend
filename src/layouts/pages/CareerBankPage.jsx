import React from 'react'

export default function CareerBankPage() {
    const careerPaths = [
  {
    icon: '⚕️',
    title: 'Doctor',
    description: 'Diagnose and treat patients, provide medical care and health guidance to improve quality of life.',
    skills: ['Medical Knowledge', 'Communication', 'Problem Solving'],
    education: 'MBBS → Residency → Specialization',
    salary: '$160,000 - $350,000'
  },
  {
    icon: '👨‍💻',
    title: 'Software Engineer',
    description: 'Design, develop, and maintain software applications and systems for various platforms and industries.',
    skills: ['Programming', 'Logic', 'Teamwork'],
    education: 'CS Degree → Internships → Full-time',
    salary: '$95,000 - $200,000'
  },
  {
    icon: '📊',
    title: 'Financial Analyst',
    description: 'Analyze financial data, create reports, and provide investment recommendations for businesses and clients.',
    skills: ['Analytics', 'Excel', 'Research'],
    education: 'Finance Degree → CFA → Senior Analyst',
    salary: '$65,000 - $120,000'
  },
  {
    icon: '👩‍🏫',
    title: 'Teacher',
    description: 'Educate and inspire students, develop curriculum, and foster learning in academic environments.',
    skills: ['Communication', 'Patience', 'Leadership'],
    education: 'Education Path: Education Degree → Teaching License → Master\'s',
    salary: '$45,000 - $75,000'
  },
  {
    icon: '📢',
    title: 'Marketing Manager',
    description: 'Develop marketing strategies, manage campaigns, and drive brand awareness for products and services.',
    skills: ['Creativity', 'Strategy', 'Analytics'],
    education: 'Education Path: Marketing Degree → Experience → Manager Role',
    salary: '$70,000 - $130,000'
  },
  {
    icon: '👷',
    title: 'Civil Engineer',
    description: 'Design and oversee construction of infrastructure projects like roads, bridges, and buildings.',
    skills: ['Math', 'CAD', 'Project Management'],
    education: 'Education Path: Engineering Degree → PE License → Senior Engineer',
    salary: '$75,000 - $140,000'
  },
  {
    icon: '🎨',
    title: 'Graphic Designer',
    description: 'Create visual concepts and designs for print, digital media, and branding purposes.',
    skills: ['Creativity', 'Adobe Suite', 'Typography'],
    education: 'Design Degree → Portfolio → Freelance/Agency',
    salary: '$45,000 - $85,000'
  },
  {
    icon: '⚖️',
    title: 'Lawyer',
    description: 'Provide legal counsel, represent clients in court, and draft legal documents and contracts.',
    skills: ['Research', 'Writing', 'Negotiation'],
    education: 'Education Path: Law Degree → Bar Exam → Practice',
    salary: '$85,000 - $250,000'
  }
];

  return (
    <div>
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '80rem', margin: 'auto' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ backgroundColor: '#e5e7eb', borderRadius: '0.75rem', padding: '0.75rem', display: 'inline-block', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🏦</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>Career Bank</h1>
          <p style={{ color: '#6b7280', maxWidth: '42rem', margin: 'auto' }}>
            Explore hundreds of career paths with detailed insights, requirements, and growth opportunities
          </p>
        </div>

        {/* Filters and Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#6b7280' }}>Filter by Industry:</span>
            <select style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}>
              <option>All Industries</option>
            </select>
            <span style={{ color: '#6b7280' }}>Sort by:</span>
            <select style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}>
              <option>Alphabetical</option>
            </select>
          </div>
          <div style={{ color: '#4b5563' }}>Showing 24 of 156 careers</div>
        </div>

        {/* Career Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {careerPaths.map((career, index) => (
            <div key={index} style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ backgroundColor: '#e5e7eb', borderRadius: '0.5rem', padding: '0.5rem', display: 'inline-block', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{career.icon}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>{career.title}</h3>
                <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '1rem' }}>{career.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {career.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} style={{ backgroundColor: '#e5e7eb', color: '#6b7280', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: '500' }}>Education Path:</span> <br/>{career.education}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>{career.salary}</div>
                <button style={{ width: '100%', backgroundColor: '#1f2937', color: '#ffffff', padding: '0.75rem 1rem', borderRadius: '0.375rem', cursor: 'pointer', border: 'none' }}>
                  View Career
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  

    </div>
  )
}
