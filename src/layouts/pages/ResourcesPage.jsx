import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { apiurl } from '../../api';
import { Link } from 'react-router-dom';
import { useBookmark } from '../../hooks/useBookmark';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

// Resource Card Component with Bookmark
const ResourceCard = ({ resource }) => {
    const { isBookmarked, loading, toggleBookmark } = useBookmark('resource', resource.resource_id);
    const { user } = useContext(UserContext)
    async function saveHistory() {
        try {
            const payload = {
                userId: user._id,
                categoryType: "resources",   // "resources" | "careers" | "multimedia"
                itemId: resource._id || resource.resource_id || resource.career_id,
                title: resource.title,
                subCategory: resource.category || null, // sirf resources ke liye
                meta: resource, // agar extra data store karna chaho
            };

            let res = await axios.post(`${apiurl}/api/history`, payload);
            console.log(res)
            console.log("History saved:", payload);
        } catch (err) {
            console.error("Error saving history", err);
        }
    }

    return (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
            <button
                onClick={toggleBookmark}
                disabled={loading}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'none',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    color: isBookmarked ? '#f59e0b' : '#6b7280',
                    transition: 'all 0.2s'
                }}
                title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
            >
                {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📄</span>
                    <span>{resource?.createdAt}</span>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>{resource.title}</h3>
                <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>{resource.description}</p>
            </div>
            <div style={{ marginTop: '1rem' }}>
                <Link onClick={saveHistory} to={`/resources/${resource.resource_id}`} style={{ width: '100%', backgroundColor: '#1f2937', color: '#ffffff', padding: '0.75rem 1rem', borderRadius: '0.375rem', cursor: 'pointer', border: 'none', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                    Read Article
                </Link>
            </div>
        </div>
    );
};

export default function ResourcesPage() {
    const [resources, setResources] = useState([]);


    const featuredResources = [
        { title: 'Career Planning Toolkit', description: 'Comprehensive guides and worksheets to map your career journey from start to success.' },
        { title: 'Industry Insights Hub', description: 'Stay updated with the latest trends, skills demands, and opportunities across industries.' },
        { title: 'Skill Development Center', description: 'Curated learning paths and resources to build in-demand skills for your target career.' }
    ];

    const fetchResources = async () => {
        try {
            const response = await axios.get(`${apiurl}/api/resources`);
            console.log(response.data);

            setResources(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    return (
        <div>
            <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif', padding: '2rem' }}>
                <div style={{ maxWidth: '80rem', margin: 'auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ backgroundColor: '#e5e7eb', borderRadius: '0.75rem', padding: '0.75rem', display: 'inline-block', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>📖</span>
                        </div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>Your Career Resources in One Place</h1>
                        <p style={{ color: '#6b7280', maxWidth: '42rem', margin: 'auto' }}>
                            Access comprehensive learning materials, guides, and tools to accelerate your career journey and make informed decisions.
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                        <button style={{ backgroundColor: '#ffffff', color: '#1f2937', padding: '0.75rem 1.5rem', borderRadius: '9999px', border: '1px solid #d1d5db', cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                            Articles
                        </button>
                        <button style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '0.75rem 1.5rem', borderRadius: '9999px', border: '1px solid #d1d5db', cursor: 'pointer' }}>
                            eBooks
                        </button>
                        <button style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '0.75rem 1.5rem', borderRadius: '9999px', border: '1px solid #d1d5db', cursor: 'pointer' }}>
                            Checklists
                        </button>
                        <button style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '0.75rem 1.5rem', borderRadius: '9999px', border: '1px solid #d1d5db', cursor: 'pointer' }}>
                            Webinars
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {resources.map((r, index) => (
                            <ResourceCard key={index} resource={r} />
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <button style={{ backgroundColor: '#d1d5db', color: '#374151', padding: '0.75rem 2rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
                            + Load More Articles
                        </button>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>Featured Resources</h2>
                        <p style={{ color: '#6b7280' }}>Handpicked resources to accelerate your career development</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
                        {featuredResources.map((resource, index) => (
                            <div key={index} style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                                    {index === 0 && '🛠️'}
                                    {index === 1 && '💡'}
                                    {index === 2 && '📚'}
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>{resource.title}</h3>
                                <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{resource.description}</p>
                                <button style={{ backgroundColor: '#ffffff', color: '#2563eb', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', border: '1px solid #2563eb', cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                                    {index === 0 && 'Explore Toolkit'}
                                    {index === 1 && 'View Insights'}
                                    {index === 2 && 'Start Learning'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    )
}
