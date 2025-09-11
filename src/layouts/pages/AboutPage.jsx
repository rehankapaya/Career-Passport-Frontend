import React from "react";
// import "./AboutPage.css";


export default function AboutPage() {
  return (

    <>
 <div style={{ display: 'flex', flexDirection: 'column', padding: '4rem', backgroundColor: '#f3f4f6' }}>
    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
      <div style={{ display: 'inline-block', padding: '1rem', backgroundColor: '#d1e7fd', borderRadius: '50%', marginBottom: '1rem' }}>
        <svg style={{ width: '2.5rem', height: '2.5rem', color: '#2563eb' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0010 16a5.979 5.979 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
        </svg>
      </div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>About Us</h1>
      <p style={{ fontSize: '1.125rem', color: '#4b5563' }}>Guiding your career journey with the right resources and mentorship.</p>
    </div>

    {/* Our Mission & Vision */}
    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Our Mission & Vision</h2>
      <p style={{ color: '#4b5563', marginBottom: '2rem' }}>NextStep Navigator is dedicated to empowering individuals at every stage of their career journey with comprehensive guidance, resources, and expert insights.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', padding: '2rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <svg style={{ width: '2rem', height: '2rem', color: '#2563eb', marginBottom: '0.5rem' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.093 6.649 2 12 2s10.268 3.093 11.542 8c-1.274 4.907-6.19 8-11.542 8S1.732 14.907.458 10zM14.54 8.796a4 4 0 00-5.715 0 2 2 0 102.857 2.857 4.002 4.002 0 002.858-2.857z" clipRule="evenodd" /></svg>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Our Vision</h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>To be the leading platform that bridges the gap between individuals and their career aspirations, providing equal opportunities for students, graduates, and professionals worldwide.</p>
        </div>
        <div style={{ flex: '1 1 300px', padding: '2rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <svg style={{ width: '2rem', height: '2rem', color: '#2563eb', marginBottom: '0.5rem' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.5 3.5 0 0013 10a3.5 3.5 0 00-2.25.906A5.972 5.972 0 008 15v3h8z" /></svg>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Our Mission</h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>To provide accessible, comprehensive career guidance and a suite of personalized career support, mentorship, and personalized learning opportunities that lead to informed career decisions.</p>
        </div>
        <div style={{ flex: '1 1 300px', padding: '2rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <svg style={{ width: '2rem', height: '2rem', color: '#2563eb', marginBottom: '0.5rem' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 3.105a2 2 0 100 3.79 2 2 0 000-3.79zM15 9a3 3 0 11-6 0 3 3 0 016 0z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-5-8a5 5 0 0110 0v1h-10v-1z" clipRule="evenodd" /></svg>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Our Values</h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>We believe in industry, accessibility, and excellence. We are committed to providing key career guidance regardless of their background or current stage in life.</p>
        </div>
      </div>
    </div>

    {/* What We Offer */}
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
      <div style={{ flex: '1 1 400px', padding: '2rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>What We Offer</h2>
        <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>&bull;</span>
            <p style={{ color: '#4b5563' }}>Comprehensive career bank with detailed profession insights</p>
          </li>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>&bull;</span>
            <p style={{ color: '#4b5563' }}>Interactive interest-based assessment tools</p>
          </li>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>&bull;</span>
            <p style={{ color: '#4b5563' }}>Expert multimedia content and educational resources</p>
          </li>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>&bull;</span>
            <p style={{ color: '#4b5563' }}>Professional success stories and career guidance</p>
          </li>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>&bull;</span>
            <p style={{ color: '#4b5563' }}>Personalized bookmarking and resource management</p>
          </li>
        </ul>
      </div>
      <div style={{ flex: '1 1 400px', height: '300px', backgroundColor: '#e5e7eb', borderRadius: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#6b7280' }}>Platform Illustration</p>
      </div>
    </div>

    {/* Meet Our Team */}
    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Meet Our Team</h2>
      <p style={{ color: '#4b5563', marginBottom: '2rem' }}>Our diverse team of career experts, educators, and technology professionals are dedicated to your success.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#cbd5e1', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '3rem', height: '3rem', color: '#6b7280' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0010 16a5.979 5.979 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Dr. Sarah Mitchell</h3>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', fontStyle: 'italic', marginBottom: '0.5rem' }}>Founder & CEO</p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>20+ years of experience in counseling and educational leadership, passionate about helping students find their purpose.</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#cbd5e1', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '3rem', height: '3rem', color: '#6b7280' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0010 16a5.979 5.979 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Michael Rodriguez</h3>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', fontStyle: 'italic', marginBottom: '0.5rem' }}>Lead Career Advisor</p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Passionate about career development, with a focus on investment and professional skill-building for our users.</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#cbd5e1', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '3rem', height: '3rem', color: '#6b7280' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0010 16a5.979 5.979 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Dr. Emily Chen</h3>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', fontStyle: 'italic', marginBottom: '0.5rem' }}>Educational Psychologist</p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Expert in developing assessment tools and helping individuals discover their true career interests.</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#cbd5e1', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '3rem', height: '3rem', color: '#6b7280' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0010 16a5.979 5.979 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>James Thompson</h3>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', fontStyle: 'italic', marginBottom: '0.5rem' }}>Technology Director</p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Focuses on building a robust platform to provide accessible, user-friendly, and secure career tools.</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#cbd5e1', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '3rem', height: '3rem', color: '#6b7280' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0010 16a5.979 5.979 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Lisa Parker</h3>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', fontStyle: 'italic', marginBottom: '0.5rem' }}>Content Strategist</p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Creates and curates high-quality content and educational resources to ensure quality and relevance.</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#cbd5e1', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '3rem', height: '3rem', color: '#6b7280' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0010 16a5.979 5.979 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>David Kim</h3>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', fontStyle: 'italic', marginBottom: '0.5rem' }}>Industry Relations Manager</p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Builds strong relationships with industry professionals to provide mentorship and networking opportunities.</p>
        </div>
      </div>
    </div>

    {/* Our Journey */}
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Our Journey</h2>
      <p style={{ color: '#4b5563', marginBottom: '2rem' }}>Key milestones in our mission to transform career guidance</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2022</p>
          <p style={{ fontSize: '1rem', color: '#6b7280', fontStyle: 'italic', marginBottom: '0.5rem' }}>Platform Launch</p>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>NextStep Navigator was founded with a vision to democratize career guidance.</p>
        </div>
        <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2023</p>
          <p style={{ fontSize: '1rem', color: '#6b7280', fontStyle: 'italic', marginBottom: '0.5rem' }}>10k+ Users</p>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Reached our first milestone of helping over 10,000 users with their career decisions.</p>
        </div>
        <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2024</p>
          <p style={{ fontSize: '1rem', color: '#6b7280', fontStyle: 'italic', marginBottom: '0.5rem' }}>Partnership Network</p>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Established partnerships with 50+ educational institutions and career centers.</p>
        </div>
        <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2025</p>
          <p style={{ fontSize: '1rem', color: '#6b7280', fontStyle: 'italic', marginBottom: '0.5rem' }}>Global Expansion</p>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Expanding our reach to serve career seekers across more countries and cultures.</p>
        </div>
      </div>
    </div>
  </div>

    </>
  );
}
