import React from "react";
import "./AboutPage.css";


export default function AboutPage() {
  return (

    <>
   
    <section className="about-page">
      <div className="about-container">
        {/* Left: Image */}
        <div className="about-image">
          <img
            src="https://source.unsplash.com/600x400/?career,team,office"
            alt="About PathSeeker"
          />
        </div>

        {/* Right: Text */}
        <div className="about-text">
          <h1>About Us</h1>
          <p>
            Welcome to <span className="highlight">PathSeeker</span>, your
            personalized Career Passport. We aim to guide students, graduates,
            and professionals in discovering the best career paths based on
            their skills, interests, and ambitions.
          </p>
          <p>
            Our platform offers a <strong>Career Bank</strong>, interactive
            quizzes, multimedia resources, and inspiring success stories to help
            you make confident career choices. Whether you're exploring global
            opportunities or refining your skills, PathSeeker is here to support
            your journey.
          </p>
          <button className="cta-btn">Explore Careers</button>
        </div>
      </div>
    </section>
    
    </>
  );
}
