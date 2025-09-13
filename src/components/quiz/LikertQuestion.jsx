export default function LikertQuestion({ q, onChange }) {
  const scale = q.likertScale || 5;
  const labels = q.options?.length === scale ? q.options : null;
  
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      margin: '16px 0',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e1e5e9'
    }}>
      <div style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '24px',
        lineHeight: '1.4',
        textAlign: 'center'
      }}>
        {q.text}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        {Array.from({ length: scale }, (_, i) => i + 1).map((val) => (
          <label key={val} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px 8px',
            backgroundColor: '#f7fafc',
            borderRadius: '8px',
            border: '2px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: '80px',
            textAlign: 'center',
            ':hover': {
              backgroundColor: '#edf2f7',
              borderColor: '#cbd5e0'
            }
          }}>
            <input 
              type="radio" 
              name={q._id} 
              value={val} 
              onChange={() => onChange(val)}
              style={{
                marginBottom: '8px',
                width: '18px',
                height: '18px',
                accentColor: '#4299e1'
              }} 
            />
            <span style={{
              fontSize: '14px',
              color: '#4a5568',
              fontWeight: '500'
            }}>
              {labels ? labels[val - 1] : val}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}