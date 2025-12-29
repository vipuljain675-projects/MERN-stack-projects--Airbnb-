import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Wishlist = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the user's saved/favourite homes 
    api.get('/favourite-list')
      .then(res => {
        setHomes(res.data.homes);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching wishlist:", err);
        setLoading(false);
      });
  }, []);

  const handleRemove = async (homeId) => {
    try {
      // Logic from favourite-list/remove POST route [cite: 331]
      await api.post('/favourite-list/remove', { homeId });
      setHomes(homes.filter(home => home._id !== homeId));
    } catch (err) {
      alert("Could not remove from wishlist");
    }
  };

  if (loading) return <div className="text-center" style={{ marginTop: '200px' }}>Loading your wishlist...</div>;

  return (
    <main className="container" style={{ marginTop: '180px' }}>
      <div className="mb-4">
        <h2 className="fw-bold">Your Wishlist</h2>
        <p className="text-secondary">Homes you have saved for later.</p>
      </div>

      {homes.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {homes.map(home => (
            <div className="col" key={home._id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="position-relative">
                  <Link to={`/homes/${home._id}`}>
                    <img 
                      src={home.photoUrl[0]} 
                      className="card-img-top object-fit-cover" 
                      alt={home.houseName} 
                      style={{ height: '250px' }} 
                    />
                  </Link>
                  
                  {/* Remove Button [cite: 331-332] */}
                  <button 
                    onClick={() => handleRemove(home._id)}
                    className="btn btn-light rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center position-absolute top-0 end-0 m-2" 
                    style={{ width: '35px', height: '35px' }}
                  >
                    <i className="bi bi-x-lg" style={{ fontSize: '0.8rem' }}></i>
                  </button>
                </div>

                <div className="card-body">
                  <h5 className="card-title fw-bold mb-1 text-truncate">{home.houseName}</h5>
                  <p className="card-text text-muted small mb-2">{home.location}</p>
                  <div className="d-flex align-items-baseline gap-1">
                    <span className="fw-bold">₹{home.price.toLocaleString()}</span> 
                    <span className="small text-muted">night</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <h4 className="text-muted">No favourites yet.</h4>
          <p className="text-secondary">Start exploring and save your dream homes.</p>
          <Link to="/" className="btn btn-dark rounded-pill px-4 mt-2 fw-bold">Explore Homes</Link>
        </div>
      )}
    </main>
  );
};

export default Wishlist;