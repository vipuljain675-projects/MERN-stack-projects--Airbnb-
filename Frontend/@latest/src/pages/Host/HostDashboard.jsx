import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

const HostDashboard = () => {
  const { isLoggedIn } = useContext(AuthContext); // Check global login state
  const navigate = useNavigate();
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    // 1. If the user is NOT logged in, stop checking and just show the landing page
    if (!isLoggedIn) {
      setCheckingStatus(false);
      return;
    }

    // 2. If the user IS logged in, check their hosting status from the backend
    const verifyHostStatus = async () => {
      try {
        // This endpoint calls exports.getHostDashboard which returns hasHomes
        const res = await api.get("/host");

        if (res.data.hasHomes) {
          // If they already have listings, skip the landing page entirely
          navigate("/host/host-home-list");
        } else {
          // If logged in but no homes yet, show the landing page so they can click "Get Started"
          setCheckingStatus(false);
        }
      } catch (err) {
        console.error("Host status check failed:", err);
        setCheckingStatus(false);
      }
    };

    verifyHostStatus();
  }, [isLoggedIn, navigate]);

  const handleGetStarted = () => {
    // Decision logic for the CTA button
    if (isLoggedIn) {
      navigate("/host/add-home");
    } else {
      navigate("/signup");
    }
  };

  // Show a spinner while we decide whether to redirect the logged-in user
  if (isLoggedIn && checkingStatus) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="container-fluid p-0">
      <div className="row g-0" style={{ minHeight: "calc(100vh - 80px)" }}>
        {/* Left Side: Marketing Image & Text */}
        <div className="col-lg-6 position-relative bg-dark">
          <img
            src="https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop"
            alt="Become a Host"
            className="w-100 h-100 object-fit-cover"
            style={{ position: "absolute", top: 0, left: 0, opacity: 0.85 }}
          />
          <div
            className="position-absolute top-50 start-0 translate-middle-y p-5 text-white d-none d-lg-block"
            style={{ maxWidth: "90%" }}
          >
            <h1
              className="display-1 fw-bold mb-3"
              style={{ letterSpacing: "-2px" }}
            >
              Airbnb it.
            </h1>
            <p className="fs-2 fw-medium">
              You could earn money by sharing your extra space.
            </p>
          </div>
        </div>

        {/* Right Side: Action Card */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white">
          <div className="w-100 p-5" style={{ maxWidth: "550px" }}>
            <h1 className="fw-bold mb-4" style={{ color: "#ff385c" }}>
              Open your door to the world
            </h1>

            <div className="card bg-light border-0 rounded-4 p-4 mb-4">
              <div className="fw-bold fs-5 text-dark">Airbnb Setup</div>
              <p className="mt-2 mb-0 text-muted">
                The super easy way to Airbnb your home.
              </p>
            </div>

            <div className="d-grid gap-3">
              <button
                onClick={handleGetStarted}
                className="btn btn-primary btn-lg fw-bold py-3 rounded-pill shadow-sm"
                style={{ backgroundColor: "#ff385c", border: "none" }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HostDashboard;
