export default function MCQQuestion({ q, onChange }) {
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
        marginBottom: '20px',
        lineHeight: '1.4'
      }}>
        {q.text}
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {q.options.map((opt, i) => (
          <label key={i} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: '#f7fafc',
            borderRadius: '8px',
            border: '2px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            ':hover': {
              backgroundColor: '#edf2f7',
              borderColor: '#cbd5e0'
            }
          }}>
            <input 
              type="radio" 
              name={q._id} 
              onChange={() => onChange(opt)}
              style={{
                marginRight: '12px',
                width: '18px',
                height: '18px',
                accentColor: '#4299e1'
              }} 
            />
            <span style={{
              fontSize: '16px',
              color: '#4a5568'
            }}>
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}