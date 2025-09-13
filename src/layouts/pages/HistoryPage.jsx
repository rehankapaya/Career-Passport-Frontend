import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { apiurl } from "../../api";
import axios from "axios";

export default function HistoryPage() {
    const {user} = useContext(UserContext)
    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");
    const USER_ID = user._id;

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`${apiurl}/api/attempt/history/${USER_ID}`);
        setRows(r.data || []);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

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
        Your Quiz History
      </h2>
      
      {rows.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#64748b',
          fontSize: '18px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px dashed #cbd5e1'
        }}>
          No attempts yet.
        </div>
      ) : (
        <ul style={{
          listStyle: 'none',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {rows.map((a) => (
            <li key={a._id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }
            }}>
              <span style={{
                color: '#475569',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {new Date(a.createdAt).toLocaleString()}
              </span>
              <span style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                backgroundColor: a.status === 'completed' ? '#dcfce7' : 
                                 a.status === 'in-progress' ? '#ffedd5' : '#e0e7ff',
                color: a.status === 'completed' ? '#166534' : 
                       a.status === 'in-progress' ? '#9a3412' : '#3730a3'
              }}>
                {a.status}
              </span>
              <span style={{
                color: '#1e293b',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Score: {a.totalScore ?? 0}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}