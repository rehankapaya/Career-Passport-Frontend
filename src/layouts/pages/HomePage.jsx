import React, { useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { BookOpen, Search, Users, ClipboardList } from "lucide-react";

export default function HomePage() {
  const [selectedPath, setSelectedPath] = useState("student");

  const brand = "#0a66c2";
  const brandDark = "#004182";

  const outer = {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: "#f3f2ef",
    minHeight: "100vh",
    color: "#1f2328",
  };

  const top = {
    padding: "4rem 2rem",
    textAlign: "center",
    background: "#ffffff",
  };

  const title = {
    fontSize: "2.6rem",
    fontWeight: 800,
    color: "#1f2328",
    letterSpacing: "-0.5px",
  };

  const subtitle = {
    fontSize: "1.05rem",
    color: "#5a6b7b",
    maxWidth: "52rem",
    margin: "1rem auto 0",
    lineHeight: 1.6,
  };

  const pickCard = {
    marginTop: "2rem",
    padding: "1.75rem",
    backgroundColor: "#fff",
    boxShadow: "0 10px 24px rgba(10,102,194,0.08)",
    borderRadius: "14px",
    maxWidth: "32rem",
    marginLeft: "auto",
    marginRight: "auto",
    border: "1px solid #ececec",
  };

  const optionBase = {
    display: "flex",
    alignItems: "center",
    padding: "0.85rem 1rem",
    marginBottom: "0.6rem",
    borderRadius: "10px",
    border: "1px solid #dfe3e7",
    cursor: "pointer",
    transition: "transform .06s ease",
    gap: ".6rem",
  };

  const optionPicked = {
    ...optionBase,
    backgroundColor: "#eef3f8",
    borderColor: brand,
  };

  const radio = {
    marginRight: ".5rem",
    accentColor: brand,
  };

  const cta = {
    width: "100%",
    padding: "0.9rem",
    backgroundColor: brand,
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "1rem",
    fontSize: "1rem",
    letterSpacing: "0.2px",
  };

  const mid = {
    padding: "4rem 2rem",
    textAlign: "center",
  };

  const h2 = {
    fontSize: "2rem",
    fontWeight: 800,
    color: "#1f2328",
    marginBottom: ".5rem",
  };

  const cards = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "2rem",
  };

  const card = {
    padding: "1.4rem",
    backgroundColor: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
    borderRadius: "12px",
    width: "16rem",
    textAlign: "center",
    border: "1px solid #eef0f2",
  };

  const iconWrap = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "3.25rem",
    height: "3.25rem",
    borderRadius: "999px",
    background: "#e7f0fa",
  };

  const cardTitle = {
    fontSize: "1.1rem",
    fontWeight: 700,
    marginTop: ".85rem",
  };

  const cardDesc = {
    fontSize: ".94rem",
    color: "#5a6b7b",
    marginTop: ".45rem",
    lineHeight: 1.55,
  };

  const line = { width: "100%", height: "1px", backgroundColor: "#e7e7e7" };

  const journey = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
    padding: "4rem 2rem",
    backgroundColor: "#fff",
  };

  const journeyText = {
    maxWidth: "40rem",
    textAlign: "left",
  };

  const small = { fontSize: ".98rem", color: "#5a6b7b", lineHeight: 1.7 };

  const list = { marginTop: "1.2rem", paddingLeft: "1.2rem" };

  const li = { marginBottom: ".5rem" };

  const preview = {
    width: "100%",
    maxWidth: "30rem",
    height: "20rem",
    background: "linear-gradient(135deg, #eef3f8, #ffffff)",
    border: "1px dashed #c6d1db",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#7d8b98",
    fontWeight: 600,
    letterSpacing: ".3px",
  };

  const bottom = {
    backgroundColor: "#101418",
    color: "#fff",
    padding: "4rem 2rem",
    textAlign: "center",
  };

  const footTitle = { fontSize: "2rem", fontWeight: 800 };

  const footSub = { maxWidth: "40rem", margin: "1rem auto 2rem", color: "#cbd5e1" };

  const footBtn = {
    padding: "0.85rem 1.6rem",
    backgroundColor: brand,
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "1rem",
    letterSpacing: "0.2px",
  };

  const handleGetStarted = () => {
    console.log("User selected:", selectedPath);
  };

  const handleRadioChange = (e) => {
    setSelectedPath(e.target.value);
  };

  const paths = [
    { value: "student", label: "Student (Grades 8-12)" },
    { value: "graduate", label: "Graduate (UG/PG)" },
    { value: "professional", label: "Working Professional" },
  ];

  return (
    <>
      <div style={outer}>
        <div style={top}>
          <h1 style={title}>Discover Your Future Path</h1>
          <p style={subtitle}>
            Navigate your educational and career journey with guidance that feels practical and clear. Nothing fancy—just the stuff you actually need to move forward.
          </p>

          {/* <div style={pickCard}>
            <p style={{ fontWeight: 700, marginBottom: "1rem", textAlign: "left" }}>Choose Your Path</p>
            <form>
              {paths.map((p) => (
                <label key={p.value} style={selectedPath === p.value ? optionPicked : optionBase}>
                  <input
                    type="radio"
                    name="path"
                    value={p.value}
                    checked={selectedPath === p.value}
                    onChange={handleRadioChange}
                    style={radio}
                  />
                  {p.label}
                </label>
              ))}
              <button type="button" onClick={handleGetStarted} style={cta} onMouseDown={(e)=>e.currentTarget.style.backgroundColor=brandDark} onMouseUp={(e)=>e.currentTarget.style.backgroundColor=brand}>
                Get Started
              </button>
            </form>
          </div> */}
        </div>

        <div style={mid}>
          <h2 style={h2}>Explore Our Resources</h2>
          <div style={cards}>
            <div style={card}>
              <div style={iconWrap}><BookOpen size={26} color={brand} /></div>
              <h3 style={cardTitle}>Study Materials</h3>
              <p style={cardDesc}>Clear guides and notes that help you actually understand and remember things.</p>
            </div>
            <div style={card}>
              <div style={iconWrap}><Search size={26} color={brand} /></div>
              <h3 style={cardTitle}>Career Paths</h3>
              <p style={cardDesc}>Browse roles, skills, and next steps without the guesswork.</p>
            </div>
            <div style={card}>
              <div style={iconWrap}><Users size={26} color={brand} /></div>
              <h3 style={cardTitle}>Mentorship</h3>
              <p style={cardDesc}>Talk to people who’ve done it before and get friendly direction.</p>
            </div>
            <div style={card}>
              <div style={iconWrap}><ClipboardList size={26} color={brand} /></div>
              <h3 style={cardTitle}>Assessment Tools</h3>
              <p style={cardDesc}>Lightweight quizzes to check where you’re at and what to improve.</p>
            </div>
          </div>
        </div>

        <div style={line}></div>

        <div style={journey}>
          <h2 style={h2}>Your Journey Starts Here</h2>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={journeyText}>
              <p style={small}>
                NextStep Navigator gives practical direction for students, grads, and pros. You’ll find solid resources, straightforward insights, and tools that help you decide your next move.
              </p>
              <ul style={list}>
                <li style={li}>Personalized career recommendations</li>
                <li style={li}>Expert video content and podcasts</li>
                <li style={li}>Downloadable resources and guides</li>
                <li style={li}>Success stories and motivation</li>
              </ul>
            </div>
            <div style={preview}>Platform Preview</div>
          </div>
        </div>

        <div style={line}></div>

        <div style={bottom}>
          <h2 style={footTitle}>Ready to Navigate Your Future?</h2>
          <p style={footSub}>Join thousands who’ve found their path with NextStep Navigator.</p>
          <button style={footBtn} onMouseDown={(e)=>e.currentTarget.style.backgroundColor=brandDark} onMouseUp={(e)=>e.currentTarget.style.backgroundColor=brand}>
            Start Your Journey Today
          </button>
        </div>
      </div>
    </>
  );
}
