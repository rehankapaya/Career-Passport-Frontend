import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiurl } from "../../api";
import axios from "axios";

export default function ResultPage() {
  const { attemptId } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`${apiurl}/api/recommend/${attemptId}`);
        setData(r.data.recommendations);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [attemptId]);

  if (err) return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      textAlign: 'center',
      fontSize: '16px'
    }}>
      {err}
    </div>
  );

  if (!data) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      fontSize: '18px',
      color: '#64748b',
      fontWeight: '500'
    }}>
      Loading recommendations…
    </div>
  );

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <h2 style={{
        color: '#1e293b',
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '32px',
        textAlign: 'center',
        paddingBottom: '16px',
        borderBottom: '2px solid #e2e8f0'
      }}>
        Recommended Streams & Roles
      </h2>
      
      <div style={{
        display: 'grid',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {data.streams.map((s) => (
          <div key={s.stream} style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e1e5e9'
          }}>
            <h3 style={{
              color: '#2563eb',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '2px solid #dbeafe'
            }}>
              {s.stream}
            </h3>
            <ol style={{
              listStyle: 'none',
              padding: '0',
              display: 'grid',
              gap: '12px'
            }}>
              {s.topRoles.map((r, index) => (
                <li key={r.role} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: index < 3 ? '#f0f9ff' : '#f8fafc',
                  borderRadius: '8px',
                  border: index < 3 ? '2px solid #bae6fd' : '1px solid #e2e8f0'
                }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#1e293b'
                  }}>
                    {r.role}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#059669',
                    backgroundColor: '#d1fae5',
                    padding: '4px 12px',
                    borderRadius: '20px'
                  }}>
                    Score: {Math.round(r.blended)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      
      <div style={{
        textAlign: 'center'
      }}>
        <Link to="/history" style={{
          display: 'inline-block',
          backgroundColor: '#4299e1',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'background-color 0.2s ease',
          ':hover': {
            backgroundColor: '#3182ce'
          }
        }}>
          View History
        </Link>
      </div>
    </div>
  );
}