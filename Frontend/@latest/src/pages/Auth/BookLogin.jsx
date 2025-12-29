import React from 'react';
import { Link } from 'react-router-dom';

const BookLogin = () => {
  return (
    <main className="container-fluid p-0">
      <div className="row g-0" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="col-lg-6 position-relative bg-dark">
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
               className="w-100 h-100 object-fit-cover" style={{ opacity: 0.9 }} alt="Travel" />
          <div className="position-absolute top-50 start-0 translate-middle-y p-5 text-white d-none d-lg-block">
            <h1 className="display-2 fw-bold mb-3">Travel more.</h1>
            <p className="fs-3">Sign in to unlock exclusive homes and secure your reservation.</p>
          </div>
        </div>
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white">
          <div className="w-100 p-5" style={{ maxWidth: '550px' }}>
            <h1 className="fw-bold mb-2">Complete your booking</h1>
            <p className="text-muted">You need to be logged in to reserve this home.</p>
            <div className="d-grid gap-3 mt-4">
              <Link to="/login" className="btn btn-primary btn-lg fw-bold py-3 rounded-3" style={{ backgroundColor: '#ff385c', border: 'none' }}>Log in to continue</Link>
              <Link to="/signup" className="btn btn-outline-dark btn-lg fw-bold py-3 rounded-3">Create an account</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookLogin;