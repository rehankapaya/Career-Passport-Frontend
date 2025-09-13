import React, { useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

export default function HomePage() {
  const [selectedPath, setSelectedPath] = useState("student");

  const containerStyle = {
    fontFamily: 'sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    color: '#333'
  };

  const headerStyle = {
    padding: '4rem 2rem',
    textAlign: 'center',
    backgroundColor: '#fff',
  };

  const mainTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#333'
  };

  const mainSubtitleStyle = {
    fontSize: '1.1rem',
    color: '#666',
    maxWidth: '50rem',
    margin: '1rem auto 0'
  };

  const pathSelectionCardStyle = {
    marginTop: '2rem',
    padding: '2rem',
    backgroundColor: '#fff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.75rem',
    maxWidth: '28rem',
    margin: '2rem auto'
  };

  const pathLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    marginBottom: '0.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #ddd',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const selectedPathLabelStyle = {
    ...pathLabelStyle,
    backgroundColor: '#f0f4ff',
    borderColor: '#007bff'
  };

  const pathInputStyle = {
    marginRight: '0.75rem',
    accentColor: '#007bff'
  };

  const getStartedButtonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
    fontSize: '1rem',
  };

  const resourcesSectionStyle = {
    padding: '4rem 2rem',
    textAlign: 'center'
  };

  const sectionTitleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#333',
    marginBottom: '0.5rem'
  };

  const cardsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem'
  };

  const resourceCardStyle = {
    padding: '1.5rem',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    borderRadius: '0.5rem',
    width: '15rem',
    textAlign: 'center',
    border: '1px solid #eee'
  };

  const resourceIconStyle = {
    fontSize: '2rem',
    color: '#007bff'
  };
  
  const resourceTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginTop: '0.75rem'
  };

  const resourceDescriptionStyle = {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: '0.5rem'
  };

  const journeySectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    padding: '4rem 2rem',
    backgroundColor: '#fff',
  };

  const journeyContentStyle = {
    maxWidth: '40rem',
    textAlign: 'left'
  };

  const previewBoxStyle = {
    width: '100%',
    maxWidth: '30rem',
    height: '20rem',
    backgroundColor: '#f0f0f0',
    borderRadius: '0.75rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#999'
  };

  const footerSectionStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '4rem 2rem',
    textAlign: 'center'
  };

  const footerTitleStyle = {
    fontSize: '2rem',
    fontWeight: '700'
  };

  const footerSubtitleStyle = {
    maxWidth: '40rem',
    margin: '1rem auto 2rem'
  };
  
  const footerButtonStyle = {
    padding: '0.75rem 2rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  const handleGetStarted = () => {
    console.log("User selected:", selectedPath);
    // Add logic for navigation or further actions
  };

  const handleRadioChange = (e) => {
    setSelectedPath(e.target.value);
  };

  const pathOptions = [
    { value: "student", label: "Student (Grades 8-12)" },
    { value: "graduate", label: "Graduate (UG/PG)" },
    { value: "professional", label: "Working Professional" },
  ];

  return (
    <>
      <div style={containerStyle}>
        {/* Header Section */}
        <div style={headerStyle}>
          <h1 style={mainTitleStyle}>Discover Your Future Path</h1>
          <p style={mainSubtitleStyle}>
            Navigate your educational and career journey with personalized guidance, expert insights, and comprehensive resources tailored to your goals.
          </p>

          <div style={pathSelectionCardStyle}>
            <p style={{ fontWeight: '600', marginBottom: '1rem', textAlign: 'left' }}>Choose Your Path</p>
            <form>
              {pathOptions.map((option) => (
                <label 
                key={option.value}
                  style={selectedPath === option.value ? selectedPathLabelStyle : pathLabelStyle}
                >
                  <input
                    type="radio"
                    name="path"
                    value={option.value}
                    checked={selectedPath === option.value}
                    onChange={handleRadioChange}
                    style={pathInputStyle}
                  />
                  {option.label}
                </label>
              ))}
              <button 
                type="button" 
                onClick={handleGetStarted} 
                style={getStartedButtonStyle}
              >
                Get Started
              </button>
            </form>
          </div>
        </div>

        {/* Resources Section */}
        <div style={resourcesSectionStyle}>
          <h2 style={sectionTitleStyle}>Explore Our Resources</h2>
          <div style={cardsContainerStyle}>
            <div style={resourceCardStyle}>
              <div style={resourceIconStyle}>&#128218;</div> {/* Book icon */}
              <h3 style={resourceTitleStyle}>Study Materials</h3>
              <p style={resourceDescriptionStyle}>
                Comprehensive guides and resources for academic success.
              </p>
            </div>
            <div style={resourceCardStyle}>
              <div style={resourceIconStyle}>&#128269;</div> {/* Magnifying glass icon */}
              <h3 style={resourceTitleStyle}>Career Paths</h3>
              <p style={resourceDescriptionStyle}>
                Discover various career opportunities and requirements.
              </p>
            </div>
            <div style={resourceCardStyle}>
              <div style={resourceIconStyle}>&#129509;</div> {/* Hands icon */}
              <h3 style={resourceTitleStyle}>Mentorship</h3>
              <p style={resourceDescriptionStyle}>
                Connect with industry experts and experienced professionals.
              </p>
            </div>
            <div style={resourceCardStyle}>
              <div style={resourceIconStyle}>&#128100;</div> {/* User icon */}
              <h3 style={resourceTitleStyle}>Assessment Tools</h3>
              <p style={resourceDescriptionStyle}>
                Interactive quizzes and self-assessment instruments.
              </p>
            </div>
          </div>
        </div>

        <div style={{width: '100%', height: '1px', backgroundColor: '#e0e0e0'}}></div>

        {/* Journey Starts Here Section */}
        <div style={journeySectionStyle}>
          <h2 style={sectionTitleStyle}>Your Journey Starts Here</h2>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={journeyContentStyle}>
              <p style={{fontSize: '0.9rem', color: '#666'}}>
                NextStep Navigator provides personalized guidance for students, graduates, and professionals. Our platform offers comprehensive resources, expert insights, and interactive tools to help you make informed decisions about your future.
              </p>
              <ul style={{marginTop: '1.5rem', listStyleType: 'disc', paddingLeft: '1.5rem'}}>
                <li style={{marginBottom: '0.5rem'}}>Personalized career recommendations</li>
                <li style={{marginBottom: '0.5rem'}}>Expert video content and podcasts</li>
                <li style={{marginBottom: '0.5rem'}}>Downloadable resources and guides</li>
                <li>Success stories and motivation</li>
              </ul>
            </div>
            <div style={previewBoxStyle}>
              Platform Preview
            </div>
          </div>
        </div>
        
        <div style={{width: '100%', height: '1px', backgroundColor: '#e0e0e0'}}></div>

        {/* Footer Section */}
        <div style={footerSectionStyle}>
          <h2 style={footerTitleStyle}>Ready to Navigate Your Future?</h2>
          <p style={footerSubtitleStyle}>
            Join thousands of students and professionals who have found their path with NextStep Navigator.
          </p>
          <button style={footerButtonStyle}>
            Start Your Journey Today
          </button>
        </div>
      </div>

      
                    </>
  );
}
