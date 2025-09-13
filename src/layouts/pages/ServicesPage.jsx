import React from "react";
import { Briefcase, Sparkles, PlayCircle, Star, BookOpen, Users, Layers, HeartHandshake } from "lucide-react";

export default function ServicesPages() {
  const services = [
    { title: "Career Bank", desc: "Explore detailed information about hundreds of careers across industries.", img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg", icon: <Briefcase size={20} /> },
    { title: "Interest Quiz", desc: "Take our interactive quiz to discover careers that match your passions.", img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg", icon: <Sparkles size={20} /> },
    { title: "Multimedia Center", desc: "Learn through videos, podcasts, and visual guides tailored to your needs.", img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg", icon: <PlayCircle size={20} /> },
    { title: "Success Stories", desc: "Get inspired by real people who achieved their dream careers.", img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg", icon: <Star size={20} /> },
    { title: "Resources", desc: "Access guides, templates, and materials to strengthen your career journey.", img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg", icon: <BookOpen size={20} /> },
    { title: "Mentorship", desc: "Connect with mentors who provide valuable career advice and direction.", img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg", icon: <Users size={20} /> },
    { title: "Resources", desc: "Access guides, templates, and materials to strengthen your career journey.", img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg", icon: <Layers size={20} /> },
    { title: "Mentorship", desc: "Connect with mentors who provide valuable career advice and direction.", img: "https://cdn.pixabay.com/photo/2014/07/23/15/04/euro-400249_640.jpg", icon: <HeartHandshake size={20} /> }
  ];

  const brandBlue = "#0A66C2";
  const brandDeep = "#004182";
  const brandInk = "#1D2226";
  const brandMute = "#56687A";
  const line = "#E6E9EC";

  return (
    <>
      <section
        style={{
          padding: "40px 20px",
          backgroundColor: "#F3F2EF",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
          color: brandInk,
          minHeight: "100vh"
        }}
      >
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0, marginBottom: 8 }}>Our Services</h1>
            <p style={{ margin: 0, color: brandMute, maxWidth: 760, marginInline: "auto" }}>
              PathSeeker provides a wide range of tools and resources to help you identify, explore, and succeed in your career journey.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 16
            }}
          >
            {services.map((service, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid " + line,
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
                  transition: "transform 120ms ease, box-shadow 120ms ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.06)";
                }}
              >
                <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#EEF3F8" }}>
                  <img
                    src={service.img}
                    alt={service.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "#E9F3FF",
                      color: brandBlue,
                      border: "1px solid #D7E9FF",
                      padding: "6px 10px",
                      borderRadius: 999,
                      fontWeight: 800,
                      fontSize: 12
                    }}
                  >
                    {service.icon}
                    {service.title}
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <h3 style={{ margin: 0, marginBottom: 6, fontSize: 18, fontWeight: 900, color: brandInk }}>{service.title}</h3>
                  <p style={{ margin: 0, color: brandMute, lineHeight: 1.6 }}>{service.desc}</p>
                  <button
                    style={{
                      marginTop: 12,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid " + brandBlue,
                      color: "#fff",
                      background: brandBlue,
                      fontWeight: 900,
                      cursor: "pointer",
                      transition: "background-color 120ms ease"
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = brandDeep)}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brandBlue)}
                  >
                    Learn more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
