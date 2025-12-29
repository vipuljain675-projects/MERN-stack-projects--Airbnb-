import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', formData);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <main className="container-fluid p-0">
      <div className="row g-0" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="col-lg-6 d-none d-lg-block position-relative">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" 
               className="w-100 h-100 object-fit-cover" alt="Login" />
        </div>
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white">
          <div className="w-100 p-5" style={{ maxWidth: '500px' }}>
            <h1 className="fw-bold mb-2">Welcome back</h1>
            <form onSubmit={handleSubmit}>
              <input type="email" className="form-control p-3 mb-3" placeholder="Email" required
                     onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="password" className="form-control p-3 mb-4" placeholder="Password" required
                     onChange={(e) => setFormData({...formData, password: e.target.value})} />
              <button className="btn btn-primary w-100 py-3 fw-bold rounded-3 mb-4" style={{ backgroundColor: '#ff385c', border: 'none' }}>Log in</button>
            </form>
            <div className="text-center">
              <span className="text-muted">Don't have an account?</span>
              <Link to="/signup" className="fw-bold text-dark ms-1">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;