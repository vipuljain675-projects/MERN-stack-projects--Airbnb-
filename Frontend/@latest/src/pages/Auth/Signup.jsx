import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/signup', formData);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <main className="container-fluid p-0">
      <div className="row g-0" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="col-lg-6 d-none d-lg-block position-relative">
          <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" 
               className="w-100 h-100 object-fit-cover" alt="Signup" />
        </div>
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white">
          <div className="w-100 p-5" style={{ maxWidth: '550px' }}>
            <h1 className="fw-bold mb-2">Create an account</h1>
            <p className="text-muted">Join us and start your journey.</p>
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <input type="text" className="form-control p-3" placeholder="First Name" required
                         onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <input type="text" className="form-control p-3" placeholder="Last Name" required
                         onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <input type="email" className="form-control p-3 mb-3" placeholder="Email" required
                     onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="password" className="form-control p-3 mb-4" placeholder="Password" required
                     onChange={(e) => setFormData({...formData, password: e.target.value})} />
              <button className="btn btn-primary w-100 py-3 fw-bold rounded-3 mb-4" style={{ backgroundColor: '#ff385c', border: 'none' }}>Sign Up</button>
            </form>
            <div className="text-center">
              <span className="text-muted">Already have an account?</span>
              <Link to="/login" className="fw-bold text-dark ms-1">Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;