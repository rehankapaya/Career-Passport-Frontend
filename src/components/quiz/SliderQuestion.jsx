export default function SliderQuestion({ q, onChange }) {
  const min = q.min ?? 0, max = q.max ?? 10;
  const mid = Math.round((min + max) / 2);
  
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
      
      <input 
        type="range" 
        min={min} 
        max={max} 
        defaultValue={mid}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          background: '#e2e8f0',
          outline: 'none',
          marginBottom: '12px',
          WebkitAppearance: 'none',
          appearance: 'none',
          '::-webkit-slider-thumb': {
            WebkitAppearance: 'none',
            appearance: 'none',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#4299e1',
            cursor: 'pointer',
            border: '2px solid #ffffff',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          },
          '::-moz-range-thumb': {
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#4299e1',
            cursor: 'pointer',
            border: '2px solid #ffffff',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }
        }}
      />
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        color: '#718096',
        fontWeight: '500'
      }}>
        <span>Min: {min}</span>
        <span>Max: {max}</span>
      </div>
    </div>
  );
}