import React from "react";
import "./HomePage.css";

// Slider Images (placeholder)
const sliderData = [
  {
    id: 1,
    title: "Discover Your Career Path",
    subtitle: "Tailored guidance for Students, Graduates & Professionals",
    img: "https://source.unsplash.com/1600x600/?career,office",
  },
  {
    id: 2,
    title: "Explore Global Careers",
    subtitle: "Search roles, skills & opportunities worldwide",
    img: "https://source.unsplash.com/1600x600/?jobs,technology",
  },
  {
    id: 3,
    title: "Learn & Grow",
    subtitle: "Access multimedia, resources & success stories",
    img: "https://source.unsplash.com/1600x600/?learning,success",
  },
];

export default function HomePage() {
  return (
    <>
    <div className="homepage">
      {/* Hero Slider */}
      <section className="hero-slider">
        <div className="slides">
          {sliderData.map((slide) => (
            <div
              key={slide.id}
              className="slide"
              style={{ backgroundImage: `url(${slide.img})` }}
            >
              <div className="overlay">
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
                <button className="cta-btn">Get Started</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="about">
        <h2>About PathSeeker</h2>
        <p>
          PathSeeker is your personalized Career Passport. We help you discover
          the best career paths based on your interests, skills, and goals.
          Whether you are a student, graduate, or professional, explore careers,
          take interactive quizzes, and unlock resources to achieve your dreams.
        </p>
      </section>

      {/* Features */}
      <section className="features">
        <h2>Our Features</h2>
        <div className="feature-grid">
          <div className="feature-card">Career Bank</div>
          <div className="feature-card">Interest Quiz</div>
          <div className="feature-card">Multimedia Center</div>
          <div className="feature-card">Success Stories</div>
          <div className="feature-card">Resources</div>
        </div>
      </section>

      {/* Trending Careers */}
      <section className="trending">
        <h2>Trending Careers</h2>
        <div className="career-cards">
          <div className="career-card">Software Engineer</div>
          <div className="career-card">Data Scientist</div>
          <div className="career-card">UI/UX Designer</div>
          <div className="career-card">Digital Marketer</div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="stories">
        <h2>Success Stories</h2>
        <div className="story-cards">
          <div className="story-card">Ali - From Student to Engineer</div>
          <div className="story-card">Sara - Data Scientist Journey</div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to Begin Your Career Journey?</h2>
        <button className="cta-btn">Join Now</button>
      </section>
    </div>
    </>
  );
}
