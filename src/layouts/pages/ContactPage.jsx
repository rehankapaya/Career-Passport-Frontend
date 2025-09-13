import React from "react";
import { Phone, Mail, MapPin, Clock, Send, Users, HelpCircle, UserRound } from "lucide-react";

export default function ContactPage() {
  const teamMembers = [
    { name: "Sarah Johnson", title: "Career Guidance Director", image: "https://placehold.co/40x40/E2E8F0/A0AEC0?text=SJ" },
    { name: "Michael Chen", title: "Account Manager", image: "https://placehold.co/40x40/E2E8F0/A0AEC0?text=MC" },
    { name: "Emily Rodriguez", title: "Professional Development Advisor", image: "https://placehold.co/40x40/E2E8F0/A0AEC0?text=ER" },
    { name: "David Thompson", title: "Technical Support Lead", image: "https://placehold.co/40x40/E2E8F0/A0AEC0?text=DT" }
  ];

  const faqItems = [
    { question: "How can I book a one-on-one career counseling session?", answer: "Contact us via email or phone to schedule a personalized career guidance session with our expert counselors." },
    { question: "Is the platform free to use?", answer: "Yes, NextStep Navigator is completely free for students, graduates, and professionals exploring career opportunities." },
    { question: "Do you provide resume review services?", answer: "Our team offers resume review and improvement suggestions. Contact us to schedule a review session." },
    { question: "Can institutions partner with NextStep Navigator?", answer: "We welcome partnerships with educational institutions and career centers. Reach out to discuss collaboration opportunities." }
  ];

  const brandBlue = "#0A66C2";
  const brandDeep = "#004182";
  const brandInk = "#1D2226";
  const brandMute = "#56687A";
  const chipBg = "#E9F3FF";
  const line = "#E6E9EC";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F3F2EF", padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif", color: brandInk }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", borderRadius: 16, padding: 24, backgroundColor: "#FFFFFF", boxShadow: "0 10px 24px rgba(0,0,0,0.06)", border: "1px solid " + line }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(90deg,#0A66C2,#004182)", color: "#fff", boxShadow: "0 10px 28px rgba(10,102,194,0.25)" }}>
            <Phone size={28} />
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0, marginBottom: 8 }}>Get in Touch With Us</h1>
          <p style={{ color: brandMute, margin: "0 auto", maxWidth: 680 }}>We’re here to help with your career journey. Reach out for guidance, support, or any questions.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: 32 }}>
          <div style={{ backgroundColor: "#FAFBFC", borderRadius: 14, padding: 20, boxShadow: "0 1px 2px rgba(0,0,0,0.04)", border: "1px solid " + line }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0, marginBottom: 12 }}>Contact Information</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, color: brandMute }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: chipBg, border: "1px solid #D7E9FF", color: brandBlue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: brandInk, fontWeight: 800 }}>Email Us</h3>
                  <p style={{ margin: "4px 0 0" }}>info@nextstepnavigator.com</p>
                  <p style={{ margin: "2px 0 0" }}>support@nextstepnavigator.com</p>
                </div>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: chipBg, border: "1px solid #D7E9FF", color: brandBlue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Phone size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: brandInk, fontWeight: 800 }}>Call Us</h3>
                  <p style={{ margin: "4px 0 0" }}>+1 (555) 123-4567</p>
                  <p style={{ margin: "2px 0 0" }}>+1 (555) 987-6543</p>
                </div>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: chipBg, border: "1px solid #D7E9FF", color: brandBlue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: brandInk, fontWeight: 800 }}>Visit Us</h3>
                  <p style={{ margin: "4px 0 0" }}>123 Career Avenue, Suite 456</p>
                  <p style={{ margin: "2px 0 0" }}>Anytown, Anystate 12345</p>
                </div>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: chipBg, border: "1px solid #D7E9FF", color: brandBlue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: brandInk, fontWeight: 800 }}>Support Hours</h3>
                  <p style={{ margin: "4px 0 0" }}>Mon–Fri: 9:00 AM – 6:00 PM</p>
                  <p style={{ margin: "2px 0 0" }}>Saturday: 10:00 AM – 4:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          <div style={{ backgroundColor: "#FFFFFF", borderRadius: 14, padding: 20, boxShadow: "0 1px 2px rgba(0,0,0,0.04)", border: "1px solid " + line }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0, marginBottom: 12 }}>Send Us a Message</h2>
            <form style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label htmlFor="fullName" style={{ display: "block", color: brandInk, fontWeight: 800, marginBottom: 6, fontSize: 14 }}>Full name</label>
                <input id="fullName" type="text" placeholder="Enter your full name" style={{ display: "block", width: "100%", borderRadius: 12, border: "1px solid " + line, padding: "10px 12px", background: "#FAFBFC", fontSize: 14, outline: "none" }} />
              </div>
              <div>
                <label htmlFor="emailAddress" style={{ display: "block", color: brandInk, fontWeight: 800, marginBottom: 6, fontSize: 14 }}>Email Address</label>
                <input id="emailAddress" type="email" placeholder="Enter your email" style={{ display: "block", width: "100%", borderRadius: 12, border: "1px solid " + line, padding: "10px 12px", background: "#FAFBFC", fontSize: 14, outline: "none" }} />
              </div>
              <div>
                <label htmlFor="subject" style={{ display: "block", color: brandInk, fontWeight: 800, marginBottom: 6, fontSize: 14 }}>Subject</label>
                <select id="subject" style={{ display: "block", width: "100%", borderRadius: 12, border: "1px solid " + line, padding: "10px 12px", background: "#FFFFFF", fontSize: 14, outline: "none" }}>
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" style={{ display: "block", color: brandInk, fontWeight: 800, marginBottom: 6, fontSize: 14 }}>Message</label>
                <textarea id="message" rows={4} placeholder="Tell us how we can help you..." style={{ display: "block", width: "100%", borderRadius: 12, border: "1px solid " + line, padding: 12, background: "#FFFFFF", fontSize: 14, outline: "none", resize: "vertical" }} />
              </div>
              <button
                type="submit"
                style={{
                  width: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 16px",
                  border: "1px solid " + brandBlue,
                  fontSize: 16,
                  fontWeight: 900,
                  borderRadius: 12,
                  color: "#FFFFFF",
                  backgroundColor: brandBlue,
                  cursor: "pointer",
                  transition: "background-color 120ms ease"
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = brandDeep)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brandBlue)}
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div style={{ backgroundColor: "#FAFBFC", borderRadius: 14, padding: 20, boxShadow: "0 1px 2px rgba(0,0,0,0.04)", border: "1px solid " + line, marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={20} style={{ color: brandBlue }} />
            Our Team
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
            {teamMembers.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: 12, borderRadius: 12, border: "1px solid " + line, background: "#FFFFFF" }}>
                <div style={{ width: 64, height: 64, marginBottom: 8, borderRadius: 999, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: chipBg, border: "1px solid #D7E9FF" }}>
                  {m.image ? <img src={m.image} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <UserRound size={28} style={{ color: brandBlue }} />}
                </div>
                <h3 style={{ margin: 0, color: brandInk, fontWeight: 800, fontSize: 16 }}>{m.name}</h3>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: brandMute }}>{m.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, margin: 0, marginBottom: 8 }}>Frequently Asked Questions</h2>
          <p style={{ color: brandMute, margin: "0 auto", maxWidth: 600 }}>Quick answers to common questions about our platform and services.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
          {faqItems.map((item, index) => (
            <div key={index} style={{ backgroundColor: "#FAFBFC", borderRadius: 14, padding: 18, boxShadow: "0 1px 2px rgba(0,0,0,0.04)", border: "1px solid " + line, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, color: brandInk, fontWeight: 800 }}>
                <HelpCircle size={18} style={{ color: brandBlue }} />
                <h3 style={{ margin: 0, fontSize: 16 }}>{item.question}</h3>
              </div>
              <p style={{ margin: 0, color: brandMute, lineHeight: 1.6 }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
