
export default function ContactPage() {
const teamMembers = [
  { name: 'Sarah Johnson', title: 'Career Guidance Director', image: 'https://placehold.co/40x40/E2E8F0/A0AEC0?text=SJ' },
  { name: 'Michael Chen', title: 'Account Manager', image: 'https://placehold.co/40x40/E2E8F0/A0AEC0?text=MC' },
  { name: 'Emily Rodriguez', title: 'Professional Development Advisor', image: 'https://placehold.co/40x40/E2E8F0/A0AEC0?text=ER' },
  { name: 'David Thompson', title: 'Technical Support Lead', image: 'https://placehold.co/40x40/E2E8F0/A0AEC0?text=DT' },
];

const faqItems = [
  { 
    question: 'How can I book a one-on-one career counseling session?',
    answer: 'Contact us via email or phone to schedule a personalized career guidance session with our expert counselors.'
  },
  { 
    question: 'Is the platform free to use?',
    answer: 'Yes, NextStep Navigator is completely free for students, graduates, and professionals exploring career opportunities.'
  },
  {
    question: 'Do you provide resume review services?',
    answer: 'Our team offers resume review and improvement suggestions. Contact us to schedule a review session.'
  },
  {
    question: 'Can institutions partner with NextStep Navigator?',
    answer: 'We welcome partnerships with educational institutions and career centers. Reach out to discuss collaboration opportunities.'
  }
]; 
  return (
   
<div style={{minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif', padding: '1rem'}}>
      <div style={{maxWidth: '72rem', margin: 'auto', borderRadius: '0.75rem', padding: '2rem', backgroundColor: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)'}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '2.5rem'}}>
          <div style={{backgroundColor: '#e5e7eb', borderRadius: '9999px', width: '3rem', height: '3rem', margin: 'auto', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', fontSize: '1.5rem'}}>
            📞
          </div>
          <h1 style={{fontSize: '2.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem'}}>Get in Touch With Us</h1>
          <p style={{color: '#6b7280', maxWidth: '42rem', margin: 'auto'}}>
            We're here to help with your career journey. Reach out to our team for guidance, support, or any questions you may have.
          </p>
        </div>

        {/* Contact and Form Section */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem', marginBottom: '2.5rem'}}>
          {/* Contact Information */}
          <div style={{backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem'}}>Contact Information</h2>
            <ul style={{listStyle: 'none', padding: '0', color: '#4b5563'}}>
              <li style={{display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem'}}>
                <span style={{color: '#6b7280', marginRight: '0.75rem', marginTop: '0.25rem', fontSize: '1.5rem'}}>📧</span>
                <div>
                  <h3 style={{fontWeight: '500', color: '#1f2937'}}>Email Us</h3>
                  <p>info@nextstepnavigator.com</p>
                  <p>support@nextstepnavigator.com</p>
                </div>
              </li>
              <li style={{display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem'}}>
                <span style={{color: '#6b7280', marginRight: '0.75rem', marginTop: '0.25rem', fontSize: '1.5rem'}}>📞</span>
                <div>
                  <h3 style={{fontWeight: '500', color: '#1f2937'}}>Call Us</h3>
                  <p>+1 (555) 123-4567</p>
                  <p>+1 (555) 987-6543</p>
                </div>
              </li>
              <li style={{display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem'}}>
                <span style={{color: '#6b7280', marginRight: '0.75rem', marginTop: '0.25rem', fontSize: '1.5rem'}}>📍</span>
                <div>
                  <h3 style={{fontWeight: '500', color: '#1f2937'}}>Visit Us</h3>
                  <p>123 Career Avenue, Suite 456</p>
                  <p>Anytown, Anystate 12345</p>
                </div>
              </li>
              <li style={{display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem'}}>
                <span style={{color: '#6b7280', marginRight: '0.75rem', marginTop: '0.25rem', fontSize: '1.5rem'}}>⏰</span>
                <div>
                  <h3 style={{fontWeight: '500', color: '#1f2937'}}>Support Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Send Us a Message */}
          <div style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem'}}>Send Us a Message</h2>
            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label htmlFor="fullName" style={{display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.25rem'}}>Full name</label>
                <input type="text" id="fullName" style={{display: 'block', width: '100%', borderRadius: '0.375rem', borderColor: '#d1d5db', borderWidth: '1px', padding: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'}} placeholder="Enter your full name" />
              </div>
              <div>
                <label htmlFor="emailAddress" style={{display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.25rem'}}>Email Address</label>
                <input type="email" id="emailAddress" style={{display: 'block', width: '100%', borderRadius: '0.375rem', borderColor: '#d1d5db', borderWidth: '1px', padding: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'}} placeholder="Enter your email" />
              </div>
              <div>
                <label htmlFor="subject" style={{display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.25rem'}}>Subject</label>
                <select id="subject" style={{display: 'block', width: '100%', borderRadius: '0.375rem', borderColor: '#d1d5db', borderWidth: '1px', padding: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'}}>
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" style={{display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.25rem'}}>Message</label>
                <textarea id="message" rows="4" style={{display: 'block', width: '100%', borderRadius: '0.375rem', borderColor: '#d1d5db', borderWidth: '1px', padding: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'}} placeholder="Tell us how we can help you..."></textarea>
              </div>
              <button 
                type="submit" 
                style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem 1rem', border: '1px solid transparent', fontSize: '1rem', fontWeight: '500', borderRadius: '0.375rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', color: '#ffffff', backgroundColor: '#2563eb', cursor: 'pointer'}}
              >
                <span style={{marginRight: '0.5rem'}}>✉️</span>
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Our Team Section */}
        <div style={{backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', marginBottom: '2.5rem'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem'}}>Our Team</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1.5rem'}}>
            {teamMembers.map((member, index) => (
              <div key={index} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem'}}>
                <div style={{width: '4rem', height: '4rem', marginBottom: '0.5rem', borderRadius: '9999px', overflow: 'hidden'}}>
                  <img src={member.image} alt={member.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
                <h3 style={{fontWeight: '500', color: '#1f2937'}}>{member.name}</h3>
                <p style={{fontSize: '0.875rem', color: '#6b7280'}}>{member.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{textAlign: 'center', marginBottom: '2.5rem'}}>
          <h2 style={{fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem'}}>Frequently Asked Questions</h2>
          <p style={{color: '#6b7280', maxWidth: '36rem', margin: 'auto'}}>Quick answers to common questions about our platform and services.</p>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.5rem'}}>
          {faqItems.map((item, index) => (
            <div key={index} style={{backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'}}>
              <h3 style={{fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem'}}>{item.question}</h3>
              <p style={{color: '#4b5563'}}>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
