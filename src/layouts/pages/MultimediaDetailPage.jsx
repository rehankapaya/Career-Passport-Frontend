import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { apiurl } from "../../api";

export default function MultimediaDetailPage() {
  const [multimedia, setMultimedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 16, height: 9 });
  
  const { id } = useParams();

  // Fetch single multimedia item
  useEffect(() => {
    const fetchMultimedia = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiurl}/api/multimedia/${id}`);
        setMultimedia(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load multimedia");
        setLoading(false);
        toast.error("Error loading multimedia");
        console.error(err);
      }
    };

    fetchMultimedia();
  }, [id]);

  // Function to get the correct URL for display
  const getMediaUrl = (url) => {
    if (url && url.startsWith('uploads/')) {
      return `${apiurl}/${url}`;
    }
    return url;
  };

  // Function to handle video metadata load and get dimensions
  const handleVideoLoad = (e) => {
    const video = e.target;
    const width = video.videoWidth;
    const height = video.videoHeight;
    setVideoDimensions({ width, height });
  };

  // Calculate aspect ratio and container styles
  const getVideoContainerStyle = () => {
    const aspectRatio = videoDimensions.width / videoDimensions.height;
    const isPortrait = aspectRatio < 1;
    
    if (isPortrait) {
      // For portrait videos, we'll center them in a landscape container
      return {
        container: {
          width: "100%",
          height: 0,
          paddingBottom: "56.25%", // 16:9 aspect ratio
          position: "relative",
          backgroundColor: "#000",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "24px"
        },
        video: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: "100%",
          width: "auto",
          maxWidth: "none"
        }
      };
    } else {
      // For landscape videos, standard responsive layout
      return {
        container: {
          width: "100%",
          position: "relative",
          backgroundColor: "#000",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "24px"
        },
        video: {
          width: "100%",
          height: "auto",
          display: "block"
        }
      };
    }
  };

  // Submit rating
  const handleRate = async (value) => {
    try {
      await axios.post(`${apiurl}/api/multimedia/${id}/rate`, { rating: value });
      toast.success("Thank you for your feedback!");
      
      // Refresh the data to show updated rating
      const response = await axios.get(`${apiurl}/api/multimedia/${id}`);
      setMultimedia(response.data);
    } catch (err) {
      toast.error("Error submitting rating");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "50vh" 
      }}>
        <div>Loading multimedia content...</div>
      </div>
    );
  }

  if (error || !multimedia) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "50vh" 
      }}>
        <div>{error || "Multimedia not found"}</div>
      </div>
    );
  }

  const videoStyles = getVideoContainerStyle();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <h1 style={{ marginBottom: 24 }}>{multimedia.title}</h1>
      
      <div style={{ 
        background: "#fff", 
        padding: 24, 
        borderRadius: 12, 
        boxShadow: "0 2px 8px #dfe6e9",
        marginBottom: 24
      }}>
        {/* Media display based on type */}
        <div style={{ marginBottom: 24 }}>
          {multimedia.type === "video" && (
            multimedia.url.startsWith('uploads/') ? (
              <div style={videoStyles.container}>
                <video
                  controls
                  style={videoStyles.video}
                  onLoadedMetadata={handleVideoLoad}
                >
                  <source src={getMediaUrl(multimedia.url)} />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div style={{
                width: "100%",
                height: 0,
                paddingBottom: "56.25%", // 16:9 aspect ratio
                position: "relative",
                backgroundColor: "#000",
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "24px"
              }}>
                <iframe
                  src={getMediaUrl(multimedia.url)}
                  title={multimedia.title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none"
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )
          )}
          
          {multimedia.type === "audio" && (
            <div style={{ textAlign: "center" }}>
              <audio controls style={{ width: "100%", maxWidth: 500 }}>
                <source src={getMediaUrl(multimedia.url)} />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          
          {multimedia.type === "image" && (
            <div style={{
              width: "100%",
              textAlign: "center",
              backgroundColor: "#000",
              borderRadius: "12px",
              padding: "20px 0",
              marginBottom: "24px"
            }}>
              <img
                src={getMediaUrl(multimedia.url)}
                alt={multimedia.title}
                style={{ 
                  maxWidth: "100%", 
                  maxHeight: "500px",
                  height: "auto"
                }}
              />
            </div>
          )}
          
          {multimedia.type === "pdf" && (
            <div style={{ textAlign: "center" }}>
              <a
                href={getMediaUrl(multimedia.url)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "#0984e3",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  margin: "10px 0"
                }}
              >
                Open PDF Document
              </a>
              <p style={{ color: "#636e72", fontSize: "0.9rem" }}>
                Click the button above to view the PDF document
              </p>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            marginBottom: 12 
          }}>
            <span style={{ 
              background: "#dfe6e9", 
              color: "#636e72", 
              padding: "4px 12px", 
              borderRadius: "16px", 
              fontSize: "0.9rem",
              fontWeight: "500",
              marginRight: 12
            }}>
              {multimedia.type.toUpperCase()}
            </span>
            <span style={{ color: "#636e72", fontSize: "0.9rem" }}>
              Created: {new Date(multimedia.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 16 }}>
            {multimedia.tags && multimedia.tags.map((tag, index) => (
              <span 
                key={index}
                style={{
                  background: "#dff9fb", 
                  color: "#0984e3", 
                  padding: "4px 12px",
                  borderRadius: "999px", 
                  fontSize: "0.85rem", 
                  marginRight: 8,
                  marginBottom: 8,
                  display: "inline-block"
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Transcript */}
        {multimedia.transcript && (
          <div style={{ marginBottom: 24 }}>
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              style={{
                background: "#0984e3", 
                color: "#fff", 
                padding: "8px 16px",
                borderRadius: "6px", 
                border: "none", 
                fontWeight: "bold", 
                cursor: "pointer",
                marginBottom: 12
              }}
            >
              {showTranscript ? "Hide Transcript" : "Show Transcript"}
            </button>
            {showTranscript && (
              <div style={{
                background: "#f5f6fa", 
                padding: 16,
                borderRadius: 8, 
                fontSize: "1rem", 
                color: "#2d3436",
                lineHeight: 1.5
              }}>
                {multimedia.transcript}
              </div>
            )}
          </div>
        )}

        {/* Rating */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 8 }}>Rate this content</h3>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            {[1, 2, 3, 4, 5].map((val) => (
              <span
                key={val}
                onClick={() => handleRate(val)}
                style={{
                  cursor: "pointer",
                  color: val <= Math.round(multimedia.rating_avg || 0) ? "#fdcb6e" : "#b2bec3",
                  fontSize: "1.8rem",
                  marginRight: 8
                }}
              >
                ★
              </span>
            ))}
          </div>
          <div style={{ color: "#636e72", fontSize: "0.95rem" }}>
            Average: {multimedia.rating_avg ? multimedia.rating_avg.toFixed(1) : "0.0"} 
            ({multimedia.rating_count || 0} ratings)
          </div>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => window.history.back()}
        style={{
          background: "#dfe6e9", 
          color: "#2d3436", 
          padding: "10px 20px",
          borderRadius: "6px", 
          border: "none", 
          fontWeight: "bold", 
          cursor: "pointer"
        }}
      >
        ← Back to Library
      </button>
    </div>
  );
}