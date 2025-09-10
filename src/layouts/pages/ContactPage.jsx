import React from "react";
import "./ContactPage.css";
import UserProfilePage from "./UserProfilePage";

export default function ContactPage() {
  return (
    <>
<section className="contact-page">
      <h1>Contact Us</h1>
      <p className="intro-text">
        Have questions or need guidance? Get in touch with us, and our team will
        be happy to assist you.
      </p>

      <div className="contact-container">
        {/* Contact Form */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit" className="cta-btn">Send Message</button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p><strong>Address:</strong> 123 Career Street, Path City, World</p>
          <p><strong>Phone:</strong> +123 456 7890</p>
          <p><strong>Email:</strong> support@pathseeker.com</p>

          {/* Map */}
          <div className="map">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509592!2d144.95592831531693!3d-37.81720997975195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577e43b8c8aef5!2sMelbourne!5e0!3m2!1sen!2sau!4v1614031802553!5m2!1sen!2sau"
              width="100%"
              height="220"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
    <UserProfilePage/>
    </>
  );
}
