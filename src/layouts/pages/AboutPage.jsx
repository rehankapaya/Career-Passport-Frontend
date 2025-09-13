import React from "react";
import { BookOpen, Target, Eye, Shield, CheckCircle2, MonitorSmartphone, Users, UserRound, Briefcase, Lightbulb, Globe, CalendarDays } from "lucide-react";

export default function AboutPage() {
  const brandBlue = "#0A66C2";
  const brandDeep = "#004182";
  const brandInk = "#1D2226";
  const brandMute = "#56687A";
  const chipBg = "#E9F3FF";
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", padding: "48px 24px", backgroundColor: "#F3F2EF", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif", color: brandInk }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, background: "linear-gradient(90deg,#0A66C2,#004182)", borderRadius: "50%", marginBottom: 12, boxShadow: "0 10px 28px rgba(10,102,194,0.25)", color: "#fff" }}>
            <BookOpen size={32} />
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0, marginBottom: 8 }}>About Us</h1>
          <p style={{ fontSize: 18, color: brandMute, margin: 0 }}>Guiding your career journey with the right resources and mentorship.</p>
        </div>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Our Mission & Vision</h2>
          <p style={{ color: brandMute, margin: "0 auto 24px", maxWidth: 820 }}>NextStep Navigator is dedicated to empowering individuals at every stage of their career journey with comprehensive guidance, resources, and expert insights.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 300px", padding: 24, backgroundColor: "#fff", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #E6E9EC", minHeight: 220, textAlign: "left" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 12, background: chipBg, color: brandBlue, border: "1px solid #D7E9FF", marginBottom: 12 }}>
                <Eye size={22} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Our Vision</h3>
              <p style={{ color: brandMute, fontSize: 14, lineHeight: 1.6, margin: 0 }}>To bridge the gap between people and their aspirations, creating equal opportunities for students, graduates, and professionals worldwide.</p>
            </div>
            <div style={{ flex: "1 1 300px", padding: 24, backgroundColor: "#fff", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #E6E9EC", minHeight: 220, textAlign: "left" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 12, background: chipBg, color: brandBlue, border: "1px solid #D7E9FF", marginBottom: 12 }}>
                <Target size={22} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Our Mission</h3>
              <p style={{ color: brandMute, fontSize: 14, lineHeight: 1.6, margin: 0 }}>To provide accessible, personalized guidance, mentorship, and learning paths that help you make confident, informed career moves.</p>
            </div>
            <div style={{ flex: "1 1 300px", padding: 24, backgroundColor: "#fff", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #E6E9EC", minHeight: 220, textAlign: "left" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 12, background: chipBg, color: brandBlue, border: "1px solid #D7E9FF", marginBottom: 12 }}>
                <Shield size={22} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Our Values</h3>
              <p style={{ color: brandMute, fontSize: 14, lineHeight: 1.6, margin: 0 }}>We champion access, quality, and real-world usefulness for every learner—no matter their background or starting point.</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: 32, flexWrap: "wrap", marginBottom: 48 }}>
          <div style={{ flex: "1 1 420px", padding: 28, backgroundColor: "#fff", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #E6E9EC" }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 14px" }}>What We Offer</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 10, color: brandMute }}>
                <CheckCircle2 size={18} style={{ color: brandBlue }} />
                <span>Comprehensive career bank with detailed profession insights</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 10, color: brandMute }}>
                <CheckCircle2 size={18} style={{ color: brandBlue }} />
                <span>Interactive, interest-based assessment tools</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 10, color: brandMute }}>
                <CheckCircle2 size={18} style={{ color: brandBlue }} />
                <span>Expert multimedia content and learning resources</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 10, color: brandMute }}>
                <CheckCircle2 size={18} style={{ color: brandBlue }} />
                <span>Real success stories and practical guidance</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 10, color: brandMute }}>
                <CheckCircle2 size={18} style={{ color: brandBlue }} />
                <span>Personalized bookmarking and resource management</span>
              </li>
            </ul>
          </div>
          <div style={{ flex: "1 1 420px", minHeight: 300, background: "#EEF3F8", border: "1px solid #E6E9EC", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: brandMute }}>
              <MonitorSmartphone size={22} />
              <span>Platform Illustration</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Meet Our Team</h2>
          <p style={{ color: brandMute, margin: "0 auto 24px", maxWidth: 760 }}>A mix of career experts, educators, and tech folks working to make progress feel simple.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
            <div style={{ padding: 16, backgroundColor: "#fff", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #E6E9EC" }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: chipBg, border: "1px solid #D7E9FF", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: brandBlue }}>
                <UserRound size={36} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Dr. Sarah Mitchell</h3>
              <p style={{ fontSize: 14, color: brandMute, fontStyle: "italic", margin: "4px 0 8px" }}>Founder & CEO</p>
              <p style={{ fontSize: 12, color: brandMute, margin: 0 }}>20+ years in counseling and education, helping learners find direction with calm and clarity.</p>
            </div>
            <div style={{ padding: 16, backgroundColor: "#fff", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #E6E9EC" }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: chipBg, border: "1px solid #D7E9FF", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: brandBlue }}>
                <Briefcase size={36} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Michael Rodriguez</h3>
              <p style={{ fontSize: 14, color: brandMute, fontStyle: "italic", margin: "4px 0 8px" }}>Lead Career Advisor</p>
              <p style={{ fontSize: 12, color: brandMute, margin: 0 }}>Focus on skill-building and confidence so opportunities feel within reach.</p>
            </div>
            <div style={{ padding: 16, backgroundColor: "#fff", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #E6E9EC" }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: chipBg, border: "1px solid #D7E9FF", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: brandBlue }}>
                <Lightbulb size={36} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Dr. Emily Chen</h3>
              <p style={{ fontSize: 14, color: brandMute, fontStyle: "italic", margin: "4px 0 8px" }}>Educational Psychologist</p>
              <p style={{ fontSize: 12, color: brandMute, margin: 0 }}>Designs assessment tools that feel natural and reveal what motivates you.</p>
            </div>
            <div style={{ padding: 16, backgroundColor: "#fff", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #E6E9EC" }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: chipBg, border: "1px solid #D7E9FF", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: brandBlue }}>
                <Users size={36} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>James Thompson</h3>
              <p style={{ fontSize: 14, color: brandMute, fontStyle: "italic", margin: "4px 0 8px" }}>Technology Director</p>
              <p style={{ fontSize: 12, color: brandMute, margin: 0 }}>Builds a secure, simple platform so you can focus on growth, not clicks.</p>
            </div>
            <div style={{ padding: 16, backgroundColor: "#fff", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #E6E9EC" }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: chipBg, border: "1px solid #D7E9FF", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: brandBlue }}>
                <BookOpen size={36} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Lisa Parker</h3>
              <p style={{ fontSize: 14, color: brandMute, fontStyle: "italic", margin: "4px 0 8px" }}>Content Strategist</p>
              <p style={{ fontSize: 12, color: brandMute, margin: 0 }}>Curates clear, trustworthy content so learning feels friendly and fresh.</p>
            </div>
            <div style={{ padding: 16, backgroundColor: "#fff", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #E6E9EC" }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: chipBg, border: "1px solid #D7E9FF", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: brandBlue }}>
                <Globe size={36} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>David Kim</h3>
              <p style={{ fontSize: 14, color: brandMute, fontStyle: "italic", margin: "4px 0 8px" }}>Industry Relations Manager</p>
              <p style={{ fontSize: 12, color: brandMute, margin: 0 }}>Connects learners with mentors and networks that actually reply.</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Our Journey</h2>
          <p style={{ color: brandMute, margin: "0 auto 24px", maxWidth: 720 }}>Key milestones in our mission to transform career guidance</p>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 220px", background: "#fff", border: "1px solid #E6E9EC", borderRadius: 14, padding: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: brandBlue, marginBottom: 6 }}>
                <CalendarDays size={18} />
                <strong>2022</strong>
              </div>
              <div style={{ fontSize: 14, color: brandMute, fontStyle: "italic", marginBottom: 6 }}>Platform Launch</div>
              <p style={{ fontSize: 13, color: brandMute, margin: 0 }}>Founded with a vision to democratize career guidance.</p>
            </div>
            <div style={{ flex: "1 1 220px", background: "#fff", border: "1px solid #E6E9EC", borderRadius: 14, padding: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: brandBlue, marginBottom: 6 }}>
                <CalendarDays size={18} />
                <strong>2023</strong>
              </div>
              <div style={{ fontSize: 14, color: brandMute, fontStyle: "italic", marginBottom: 6 }}>10k+ Users</div>
              <p style={{ fontSize: 13, color: brandMute, margin: 0 }}>Supported thousands in making informed career decisions.</p>
            </div>
            <div style={{ flex: "1 1 220px", background: "#fff", border: "1px solid #E6E9EC", borderRadius: 14, padding: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: brandBlue, marginBottom: 6 }}>
                <CalendarDays size={18} />
                <strong>2024</strong>
              </div>
              <div style={{ fontSize: 14, color: brandMute, fontStyle: "italic", marginBottom: 6 }}>Partnership Network</div>
              <p style={{ fontSize: 13, color: brandMute, margin: 0 }}>Joined forces with 50+ institutions and career centers.</p>
            </div>
            <div style={{ flex: "1 1 220px", background: "#fff", border: "1px solid #E6E9EC", borderRadius: 14, padding: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: brandBlue, marginBottom: 6 }}>
                <CalendarDays size={18} />
                <strong>2025</strong>
              </div>
              <div style={{ fontSize: 14, color: brandMute, fontStyle: "italic", marginBottom: 6 }}>Global Expansion</div>
              <p style={{ fontSize: 13, color: brandMute, margin: 0 }}>Reaching more learners across regions and cultures.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
