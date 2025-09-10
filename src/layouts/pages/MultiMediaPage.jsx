import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiurl } from "../../api";

export default function MultimediaPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  // Define all possible categories upfront
  const allCategories = ["all", "video", "audio", "image", "pdf"];

  // Fetch all multimedia
  useEffect(() => {
    setLoading(true);
    axios.get(`${apiurl}/api/multimedia`)
      .then(res => {
        setItems(res.data);
        setFilteredItems(res.data);
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setFilteredItems([]);
        setLoading(false);
      });
  }, []);

  // Filter items based on search query and category
  useEffect(() => {
    let result = items;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (item.transcript && item.transcript.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(item => item.type === selectedCategory);
    }
    
    setFilteredItems(result);
  }, [searchQuery, selectedCategory, items]);

  // Navigate to details page
  const handleViewDetails = (id) => {
    navigate(`/multimedia/${id}`);
  };

  // Function to get the correct URL for display
  const getMediaUrl = (url) => {
    if (url && url.startsWith('uploads/')) {
      return `${apiurl}/${url}`;
    }
    return url;
  };

  // Function to get thumbnail for video (first frame or placeholder)
  const getThumbnail = (item) => {
    if (item.type === "video") {
      if (item.url.startsWith('uploads/')) {
        return "https://via.placeholder.com/320x180/ff6b6b/ffffff?text=Video";
      } else if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
        const videoId = item.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (videoId && videoId[1]) {
          return `https://img.youtube.com/vi/${videoId[1]}/mqdefault.jpg`;
        }
      }
    } else if (item.type === "image") {
      return getMediaUrl(item.url);
    } else if (item.type === "audio") {
      return "https://via.placeholder.com/320x180/4ecdc4/ffffff?text=Audio";
    } else if (item.type === "pdf") {
      return "https://via.placeholder.com/320x180/45b7d1/ffffff?text=PDF";
    }
    
    return "https://via.placeholder.com/320x180/96aab5/ffffff?text=Media";
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div style={{ 
      backgroundColor: "#f9f9f9", 
      minHeight: "100vh",
      padding: "16px 0"
    }}>
      {/* Header */}
      <div style={{
        position: "sticky",
        top: 0,
        backgroundColor: "white",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        zIndex: 100,
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            width: 90,
            height: 20,
            backgroundColor: "#ff0000",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "2px",
            marginRight: "16px"
          }}>
            MEDIA
          </div>
          <h1 style={{ 
            margin: 0, 
            fontSize: "20px",
            fontWeight: 500
          }}>
            Multimedia Library
          </h1>
        </div>
        
        {/* Search Bar */}
        <div style={{
          position: "relative",
          flex: "1",
          maxWidth: "500px",
          minWidth: "200px"
        }}>
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 40px 10px 16px",
              borderRadius: "20px",
              border: "1px solid #ddd",
              fontSize: "16px",
              outline: "none",
              transition: "border-color 0.2s",
              boxSizing: "border-box"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#065fd4";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#ddd";
            }}
          />
          <div style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#606060",
            cursor: "pointer"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="10" r="3"></circle>
            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
          </svg>
        </div>
      </div>

      {/* Category Filters */}
      <div style={{
        backgroundColor: "white",
        padding: "16px",
        borderBottom: "1px solid #e5e5e5",
        overflowX: "auto",
        whiteSpace: "nowrap"
      }}>
        <div style={{
          display: "flex",
          gap: "8px",
          justifyContent: "center"
        }}>
          {allCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: "8px 16px",
                borderRadius: "16px",
                border: "none",
                backgroundColor: selectedCategory === category ? "#0f0f0f" : "#f2f2f2",
                color: selectedCategory === category ? "white" : "#0f0f0f",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s",
                textTransform: "capitalize"
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category) {
                  e.target.style.backgroundColor = "#e5e5e5";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category) {
                  e.target.style.backgroundColor = "#f2f2f2";
                }
              }}
            >
              {category === "all" ? "All Media" : category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <div style={{
          padding: "16px 16px 0",
          color: "#606060",
          fontSize: "14px"
        }}>
          {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'} found
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategory !== "all" && ` in ${selectedCategory}`}
        </div>
      )}

      {/* Content */}
      <div style={{ 
        maxWidth: 1400, 
        margin: "0 auto", 
        padding: "16px" 
      }}>
        {loading ? (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "16px" 
          }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{ 
                backgroundColor: "#fff", 
                borderRadius: "8px", 
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12)" 
              }}>
                <div style={{ 
                  backgroundColor: "#e0e0e0", 
                  height: "180px",
                  width: "100%"
                }}></div>
                <div style={{ padding: "12px" }}>
                  <div style={{ 
                    backgroundColor: "#e0e0e0", 
                    height: "16px", 
                    width: "80%", 
                    marginBottom: "8px",
                    borderRadius: "4px"
                  }}></div>
                  <div style={{ 
                    backgroundColor: "#e0e0e0", 
                    height: "14px", 
                    width: "60%",
                    borderRadius: "4px"
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "50vh",
            color: "#606060",
            textAlign: "center"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3 style={{ margin: "16px 0 8px" }}>No media found</h3>
            <p>
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : `No ${selectedCategory !== "all" ? selectedCategory + " " : ""}media available`
              }
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                style={{
                  marginTop: "16px",
                  padding: "8px 16px",
                  backgroundColor: "#065fd4",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "500"
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "16px" 
          }}>
            {filteredItems.map(item => (
              <div 
                key={item.media_id} 
                style={{
                  backgroundColor: "#fff", 
                  borderRadius: "12px", 
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-4px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.12)";
                }}
                onClick={() => handleViewDetails(item.media_id)}
              >
                {/* Thumbnail */}
                <div style={{ 
                  position: "relative", 
                  paddingBottom: "56.25%", // 16:9 aspect ratio
                  backgroundColor: "#000",
                  overflow: "hidden"
                }}>
                  <img 
                    src={getThumbnail(item)} 
                    alt={item.title}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  
                  {/* Duration badge for videos */}
                  {/* {item.type === "video" && (
                    <div style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      backgroundColor: "rgba(0,0,0,0.8)",
                      color: "white",
                      padding: "2px 4px",
                      borderRadius: "2px",
                      fontSize: "12px",
                      fontWeight: "500"
                    }}>
                      10:25
                    </div>
                  )} */}
                  
                  {/* Media type indicator */}
                  <div style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: "2px",
                    fontSize: "11px",
                    fontWeight: "500",
                    textTransform: "uppercase"
                  }}>
                    {item.type}
                  </div>
                </div>
                
                {/* Content details */}
                <div style={{ padding: "12px" }}>
                  <h3 style={{ 
                    margin: "0 0 8px", 
                    fontSize: "16px",
                    fontWeight: "500",
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    color: "#0f0f0f"
                  }}>
                    {item.title}
                  </h3>
                  
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center",
                    marginBottom: "8px"
                  }}>
                    <span style={{ 
                      fontSize: "14px", 
                      color: "#606060" 
                    }}>
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: "flex", 
                    flexWrap: "wrap",
                    gap: "4px",
                    marginBottom: "12px"
                  }}>
                    {item.tags && item.tags.slice(0, 2).map(tag => (
                      <span key={tag} style={{
                        background: "#f2f2f2", 
                        color: "#606060", 
                        padding: "4px 8px",
                        borderRadius: "12px", 
                        fontSize: "12px", 
                        display: "inline-block"
                      }}>
                        #{tag.length > 15 ? tag.substring(0, 15) + '...' : tag}
                      </span>
                    ))}
                    {item.tags && item.tags.length > 2 && (
                      <span style={{
                        background: "#f2f2f2", 
                        color: "#606060", 
                        padding: "4px 8px",
                        borderRadius: "12px", 
                        fontSize: "12px", 
                        display: "inline-block"
                      }}>
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                  
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center",
                      color: "#606060",
                      fontSize: "13px"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px" }}>
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                      <span>{item.rating_count || 0} ratings</span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(item.media_id);
                      }}
                      style={{
                        background: "transparent",
                        color: "#065fd4",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(6, 95, 212, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "transparent";
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}