import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BookingFailed = () => {
  // We can pass the homeId through the navigation state if needed
  const location = useLocation();
  const homeId = location.state?.homeId;

  return (
    <main className="container d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="text-center bg-white p-5 rounded-4 shadow-sm" style={{ maxWidth: '500px' }}>
        <div className="mb-4 text-danger">
          {/* Using the SVG from your EJS file */}
          <svg viewBox="0 0 32 32" width="64" height="64" fill="currentColor">
            <path d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14 14-6.2 14-14S23.8 2 16 2zm0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12-5.4 12-12 12zm-1-18h2v10h-2V10zm0 12h2v2h-2v-2z"></path>
          </svg>
        </div>
        
        <h2 className="fw-bold mb-3">Dates Unavailable</h2>
        
        <p className="text-muted mb-4">
          Sorry, this home is already booked for the dates you selected. 
          Please choose different dates or try another home. [cite: 210]
        </p>
        
        <div className="d-grid gap-2">
          {/* Dynamic link back to the specific property */}
          <Link to={`/homes/${homeId || ''}`} className="btn btn-outline-dark rounded-pill py-2">
            Pick different dates 
          </Link>
          
          <Link to="/" className="btn btn-primary rounded-pill py-2" style={{ backgroundColor: '#ff385c', border: 'none' }}>
            Explore other homes 
          </Link>
        </div>
      </div>
    </main>
  );
};

export default BookingFailed;