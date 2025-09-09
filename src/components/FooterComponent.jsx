import React from 'react'

export default function FooterComponent() {
  return (
    <footer
      style={{
        width: '100%',
        height: '56px',
        background: '#2d3436',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        letterSpacing: '1px',
        marginTop: 'auto'
      }}
    >
      &copy; {new Date().getFullYear()} Career Passport. All rights reserved.
    </footer>
  )
}