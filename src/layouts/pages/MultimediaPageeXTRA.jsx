import React from 'react';
import { PlayCircle, Award, Film, Podcast, FileText, Search } from 'lucide-react';

export default function MultimediaPageeXTRA() {
    return (
        <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', fontFamily: 'Inter, sans-serif' }}>
        

  

            {/* Inspiring Journeys Section */}
            <div style={{ padding: '2rem 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Award size={36} style={{ color: '#f39c12' }} />
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginTop: '0.5rem' }}>
                        Inspiring Journeys
                    </h2>
                    <p style={{ fontSize: '1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                        Real stories from professionals who transformed their careers and achieved their dreams.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {/* Profile Card 1 */}
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', padding: '1.5rem', textAlign: 'center' }}>
                        <img src="https://i.pravatar.cc/150?u=a" alt="Priya Sharma" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>Priya Sharma</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.2rem 0' }}>Software Engineering</p>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                            From small-town coder to Senior Software Engineer at Google.
                        </p>
                        <a href="#" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.9rem', color: '#4b0082', textDecoration: 'none' }}>
                            Read Full Story &rarr;
                        </a>
                    </div>
                    {/* Profile Card 2 */}
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', padding: '1.5rem', textAlign: 'center' }}>
                        <img src="https://i.pravatar.cc/150?u=b" alt="Dr. Rajesh Kumar" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>Dr. Rajesh Kumar</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.2rem 0' }}>Medicine</p>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                            A retired surgeon who uses his corporate job to pursue medicine.
                        </p>
                        <a href="#" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.9rem', color: '#4b0082', textDecoration: 'none' }}>
                            Read Full Story &rarr;
                        </a>
                    </div>
                    {/* Profile Card 3 */}
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', padding: '1.5rem', textAlign: 'center' }}>
                        <img src="https://i.pravatar.cc/150?u=c" alt="Anita Desai" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>Anita Desai</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.2rem 0' }}>Finance</p>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                            Built a successful startup from her kitchen table.
                        </p>
                        <a href="#" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.9rem', color: '#4b0082', textDecoration: 'none' }}>
                            Read Full Story &rarr;
                        </a>
                    </div>
                    {/* Profile Card 4 */}
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', padding: '1.5rem', textAlign: 'center' }}>
                        <img src="https://i.pravatar.cc/150?u=d" alt="Arjun Singh" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>Arjun Singh</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.2rem 0' }}>Art & Design</p>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                            Self-taught graphic designer who overcame all obstacles.
                        </p>
                        <a href="#" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.9rem', color: '#4b0082', textDecoration: 'none' }}>
                            Read Full Story &rarr;
                        </a>
                    </div>
                    {/* Profile Card 5 */}
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', padding: '1.5rem', textAlign: 'center' }}>
                        <img src="https://i.pravatar.cc/150?u=e" alt="Meera Patel" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>Meera Patel</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.2rem 0' }}>Education</p>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                            From struggling student to an innovative school administrator.
                        </p>
                        <a href="#" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.9rem', color: '#4b0082', textDecoration: 'none' }}>
                            Read Full Story &rarr;
                        </a>
                    </div>
                    {/* Profile Card 6 */}
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', padding: '1.5rem', textAlign: 'center' }}>
                        <img src="https://i.pravatar.cc/150?u=f" alt="Vikram Mehta" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>Vikram Mehta</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.2rem 0' }}>Data Science</p>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                            PhD dropped, learned successful data science and now builds apps.
                        </p>
                        <a href="#" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.9rem', color: '#4b0082', textDecoration: 'none' }}>
                            Read Full Story &rarr;
                        </a>
                    </div>
                    {/* Profile Card 7 */}
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', padding: '1.5rem', textAlign: 'center' }}>
                        <img src="https://i.pravatar.cc/150?u=g" alt="Sumita Joshi" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>Sumita Joshi</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.2rem 0' }}>Finance</p>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                            From bank clerk to investment banker. Found happiness in her work.
                        </p>
                        <a href="#" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.9rem', color: '#4b0082', textDecoration: 'none' }}>
                            Read Full Story &rarr;
                        </a>
                    </div>
                    {/* Profile Card 8 */}
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', padding: '1.5rem', textAlign: 'center' }}>
                        <img src="https://i.pravatar.cc/150?u=h" alt="Rohit Verma" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>Rohit Verma</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.2rem 0' }}>Technology</p>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                            College dropout who built a tech startup. Now consults top companies.
                        </p>
                        <a href="#" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.9rem', color: '#4b0082', textDecoration: 'none' }}>
                            Read Full Story &rarr;
                        </a>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button style={{ padding: '12px 24px', backgroundColor: '#4b0082', color: '#fff', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '1rem' }}>
                        View All Success Stories
                    </button>
                </div>
            </div>
        </div>
    );
}
