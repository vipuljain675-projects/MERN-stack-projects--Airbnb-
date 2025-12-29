import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const MyListings = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to ensure images load from the backend port (3500)
  const getImageUrl = (url) => {
    if (!url)
      return "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1965&auto=format&fit=crop";
    return url.startsWith("http") ? url : `http://localhost:3500${url}`;
  };

  useEffect(() => {
    // 🟢 RECTIFIED: Calling the exact endpoint defined in your hostRouter.js
    api
      .get("/host/host-home-list")
      .then((res) => {
        setHomes(res.data.homes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Listing fetch error:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        // 🟢 RECTIFIED: Matches router path post/delete-home/:homeId
        await api.post(`/host/delete-home/${id}`);
        setHomes(homes.filter((h) => h._id !== id));
      } catch (err) {
        alert("Failed to delete listing.");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center" style={{ marginTop: "200px" }}>
        Loading your listings...
      </div>
    );

  return (
    <main className="container mb-5" style={{ marginTop: "180px" }}>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="fw-bold h2 mb-1">Your Listings</h1>
          <p className="text-muted small">Manage the homes you're hosting</p>
        </div>
        <Link
          to="/host/add-home"
          className="btn btn-dark rounded-pill px-4 fw-bold"
        >
          Create new listing
        </Link>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {homes.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted fs-5">
              You haven't added any listings yet.
            </p>
          </div>
        ) : (
          homes.map((home) => (
            <div className="col" key={home._id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <img
                  src={getImageUrl(home.photoUrl[0])}
                  className="w-100 object-fit-cover"
                  style={{ aspectRatio: "4/3" }}
                  alt={home.houseName}
                />
                <div className="card-body p-3">
                  <h5 className="fw-bold mb-1 text-truncate">
                    {home.houseName}
                  </h5>
                  <div className="text-secondary small mb-3">
                    <i className="bi bi-geo-alt me-1"></i>
                    {home.location}
                  </div>
                  <div className="d-flex gap-2">
                    <Link
                      to={`/host/edit-home/${home._id}`}
                      className="btn btn-outline-dark btn-sm rounded-pill px-4 flex-grow-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(home._id)}
                      className="btn btn-outline-danger btn-sm rounded-pill px-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default MyListings;
