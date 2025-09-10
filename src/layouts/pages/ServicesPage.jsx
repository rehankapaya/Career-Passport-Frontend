import React from "react";
import "./ServicesPages.css";

export default function ServicesPages() {
  const services = [
    {
      title: "Career Bank",
      desc: "Explore detailed information about hundreds of careers across industries.",
      img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg",
    },
    {
      title: "Interest Quiz",
      desc: "Take our interactive quiz to discover careers that match your passions.",
      img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg",
    },
    {
      title: "Multimedia Center",
      desc: "Learn through videos, podcasts, and visual guides tailored to your needs.",
      img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg",
    },
    {
      title: "Success Stories",
      desc: "Get inspired by real people who achieved their dream careers.",
      img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg",
    },
    {
      title: "Resources",
      desc: "Access guides, templates, and materials to strengthen your career journey.",
      img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg",
    },
    {
      title: "Mentorship",
      desc: "Connect with mentors who provide valuable career advice and direction.",
      img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg",
    },
    {
      title: "Resources",
      desc: "Access guides, templates, and materials to strengthen your career journey.",
      img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg",
    },
    {
      title: "Mentorship",
      desc: "Connect with mentors who provide valuable career advice and direction.",
      img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg",
    },
  ];

  return (
    <>
<section className="services-page">
      <h1>Our Services</h1>
      <p className="intro-text">
        PathSeeker provides a wide range of tools and resources to help you
        identify, explore, and succeed in your career journey.
      </p>

      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <img src={service.img} alt={service.title} />
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}
