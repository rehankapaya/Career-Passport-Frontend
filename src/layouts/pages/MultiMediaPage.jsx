import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiurl } from "../../api";
import MultimediaPageeXTRA from "./MultimediaPageeXTRA";
import {
  Video as VideoIcon,
  Mic as AudioIcon,
  FileText as PdfIcon,
  Image as ImageIcon,
  Star as StarIcon,
  Search as SearchIcon,
  PlayCircle
} from "lucide-react";

export default function MultimediaPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const allCategories = ["all", "video", "audio", "pdf", "image"];

  const generateRandomSuggestions = (sourceItems, count) => {
    if (sourceItems.length <= count) {
      return [...sourceItems];
    }
    const shuffled = [...sourceItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`${apiurl}/api/multimedia`)
      .then(res => {
        const sortedItems = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setItems(sortedItems);
        setFilteredItems(sortedItems);
        setSuggestedItems(generateRandomSuggestions(sortedItems, 4));
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setFilteredItems([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = items;
    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(item => item.type === selectedCategory);
    }
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(query) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (item.transcript && item.transcript.toLowerCase().includes(query))
      );
    }
    setFilteredItems(result);
  }, [selectedCategory, searchQuery, items]);

  const handleViewDetails = (id) => {
    navigate(`/multimedia/${id}`);
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'video':
        return <VideoIcon size={20} style={{ marginRight: '8px' }} />;
      case 'audio':
        return <AudioIcon size={20} style={{ marginRight: '8px' }} />;
      case 'pdf':
        return <PdfIcon size={20} style={{ marginRight: '8px' }} />;
      case 'image':
        return <ImageIcon size={20} style={{ marginRight: '8px' }} />;
      default:
        return null;
    }
  };

  const getThumbnailUrl = (item) => {
    if (item.type === "video") {
      if (item.url && (item.url.includes('youtube.com') || item.url.includes('youtu.be'))) {
        const videoId = item.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return videoId ? `https://img.youtube.com/vi/${videoId[1]}/mqdefault.jpg` : "https://via.placeholder.com/320x180/000000/FFFFFF?text=Video";
      } else if (item.url && item.url.startsWith('uploads/')) {
        return "https://via.placeholder.com/320x180/000000/FFFFFF?text=Video";
      }
    } else if (item.type === "image") {
      return item.url && item.url.startsWith('uploads/') ? `${apiurl}/${item.url}` : item.url;
    } else if (item.type === "audio") {
      return "https://via.placeholder.com/320x180/6a5acd/FFFFFF?text=AUDIO";
    } else if (item.type === "pdf") {
      return "https://via.placeholder.com/320x180/6a5acd/FFFFFF?text=PDF";
    }
    return "https://via.placeholder.com/320x180/6a5acd/FFFFFF?text=MEDIA";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', padding: '0 2rem', fontFamily: 'Inter, sans-serif' }}>
        {/* Header */}
        <div style={{
          padding: "1rem 0",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0"
        }}>
          <div style={{
            backgroundColor: "#ff0000",
            color: "white",
            fontWeight: "bold",
            padding: "0.25rem 0.75rem",
            borderRadius: "4px",
            fontSize: "1.2rem",
            marginRight: "1rem"
          }}>
            MEDIA
          </div>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#333",
            margin: 0
          }}>
            Multimedia Library
          </h1>
        </div>

        {/* Centered Search Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '2rem 0'
        }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "600px" }}>
            <input
              type="text"
              placeholder="Search for videos, articles, podcasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 3rem 0.75rem 1.5rem",
                borderRadius: "50px",
                border: "1px solid #ddd",
                outline: "none",
                fontSize: '1rem',
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                transition: "border-color 0.2s"
              }}
            />
            <SearchIcon
              size={24}
              color="#999"
              style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          {allCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '1.5rem',
                border: `1px solid ${selectedCategory === category ? '#6a5acd' : '#ddd'}`,
                backgroundColor: selectedCategory === category ? '#6a5acd' : 'transparent',
                color: selectedCategory === category ? 'white' : '#6a5acd',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                textTransform: 'capitalize',
                transition: 'all 0.3s'
              }}
            >
              {category === "all" ? "All Media" : category}s
            </button>
          ))}
        </div>

        {/* Latest Content Heading */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>
          Latest Content
        </h2>

        {/* Content Section with Cards or "No Content" Message */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', justifyContent: 'center' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", overflow: "hidden", height: '300px' }}>
                <div style={{ backgroundColor: "#e0e0e0", height: "180px", width: "100%" }}></div>
                <div style={{ padding: "1rem" }}>
                  <div style={{ backgroundColor: "#e0e0e0", height: "1.5rem", width: "80%", marginBottom: "0.5rem", borderRadius: "4px" }}></div>
                  <div style={{ backgroundColor: "#e0e0e0", height: "1.2rem", width: "60%", borderRadius: "4px" }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 320px)', gap: '2rem', justifyContent: 'center' }}>
            {filteredItems.map(item => (
              <div
                key={item.media_id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  cursor: "pointer"
                }}
                onClick={() => handleViewDetails(item.media_id)}
              >
                {/* Thumbnail Section */}
                <div style={{
                  position: "relative",
                  height: '180px',
                  overflow: "hidden",
                  backgroundColor: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.type === 'video' || item.type === 'image' ? (
                    <>
                      <img
                        src={getThumbnailUrl(item)}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          position: "absolute",
                          top: 0,
                          left: 0
                        }}
                      />
                      {item.type === 'video' && (
                        <PlayCircle
                          size={64}
                          color="white"
                          fill="rgba(0,0,0,0.7)"
                          style={{
                            position: 'absolute',
                            zIndex: 1,
                            pointerEvents: 'none'
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: 'white',
                      fontSize: '1.5rem'
                    }}>
                      {getMediaIcon(item.type)}
                      <span style={{ textTransform: 'uppercase', fontWeight: 'bold', marginTop: '8px' }}>{item.type}</span>
                    </div>
                  )}
                </div>

                {/* Content details */}
                <div style={{ padding: '1rem' }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '0.5rem',
                    lineHeight: '1.4'
                  }}>
                    {item.title}
                  </h3>
                  {/* Tags as chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '0.75rem 0' }}>
                    {item.tags && item.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} style={{ backgroundColor: '#e8f0fe', color: '#1a73e8', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* CreatedAt date */}
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                      {formatDate(item.createdAt)}
                    </p>
                    {/* Star Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', color: '#f5c518' }}>
                      <StarIcon style={{ marginRight: '4px', width: '16px', height: '16px' }} />
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>4.5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888', fontSize: '1.2rem' }}>
            No content found. Please try a different search or filter.
          </div>
        )}
      </div>

      {/* Suggestions Section */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>
          Latest Content
          Suggestions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', justifyContent: 'center' }}>
          {suggestedItems.map(item => (
            <div
              key={item.media_id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onClick={() => handleViewDetails(item.media_id)}
            >
              <div style={{ position: 'relative', height: '180px', backgroundColor: '#ddd' }}>
                <img
                  src={getThumbnailUrl(item)}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0
                  }}
                />
                <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#333', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', textTransform: 'capitalize' }}>{item.type}</span>
                {item.video_length && (
                  <span style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: '#333', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{item.video_length}</span>
                )}
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4b0082', marginBottom: '0.5rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  {item.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '0.75rem 0' }}>
                  {item.tags && item.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} style={{ backgroundColor: '#e8f0fe', color: '#1a73e8', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}