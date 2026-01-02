import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const HomeDetail = () => {
  const { homeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const [home, setHome] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const [guestMenuOpen, setGuestMenuOpen] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0, seniors: 0 });
  const totalGuests = guests.adults + guests.children + guests.seniors;

  const queryParams = new URLSearchParams(location.search);
  const [checkIn, setCheckIn] = useState(queryParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(queryParams.get("checkOut") || "");

  useEffect(() => {
    const fetchHomeDetails = async () => {
      try {
        const res = await api.get(`/homes/${homeId}`);
        setHome(res.data.home);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeDetails();
  }, [homeId]);

  useEffect(() => {
    if (!home || !window.L) return;
    const container = window.L.DomUtil.get("map");
    if (container != null) {
      container._leaflet_id = null;
    }

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${home.location}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.length) return;
        const { lat, lon } = data[0];
        const map = window.L.map("map", { scrollWheelZoom: false }).setView(
          [lat, lon],
          13
        );
        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ).addTo(map);
        window.L.circle([lat, lon], {
          color: "#ff385c",
          fillColor: "#ff385c",
          fillOpacity: 0.2,
          radius: 500,
        }).addTo(map);
      });
  }, [home]);

  // Utility to handle local vs remote image URLs
  const getUrl = (url) => {
    if (!url)
      return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800";
    return url.startsWith("http") ? url : `http://localhost:3500${url}`;
  };

  const updateGuest = (e, type, delta) => {
    e.stopPropagation();
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(type === "adults" ? 1 : 0, prev[type] + delta),
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please log in.");
      navigate("/login");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/reviews",
        {
          homeId,
          rating: Number(newReview.rating),
          comment: newReview.comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([res.data.review, ...reviews]);
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: "" });
    } catch (err) {
      alert("Failed to post review.");
    }
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut || !home) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start) || isNaN(end)) return 0;
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? home.price * nights : 0;
  };

  const handleReserve = async () => {
    if (!isLoggedIn) {
      navigate("/book-login");
      return;
    }

    if (!checkIn || !checkOut) {
      alert("Select your dates first!"); // Better UX
      return;
    }

    // 🔴 Requirement 1: Logical Date Validation
    if (new Date(checkIn) >= new Date(checkOut)) {
      // Realistic touch: Inline error or focused alert
      alert("Checkout date must be at least one day after check-in.");
      return;
    }

    // ... rest of API logic

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/bookings",
        {
          homeId: homeId,
          checkIn: checkIn,
          checkOut: checkOut,
          adults: guests.adults,
          children: guests.children,
          seniors: guests.seniors,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/bookings");
    } catch (err) {
      console.error("BOOKING ERROR:", err.response?.data);
      // Trigger the sexy Dates Unavailable UI on conflict
      if (err.response?.status === 409) {
        navigate("/booking-failed", { state: { homeId } });
      } else if (err.response?.status === 401) {
        alert("Authentication failed. Please log in again.");
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Booking failed.");
      }
    }
  };

  if (loading || !home)
    return <div className="text-center mt-5">Loading Listing...</div>;

  return (
    <main
      className="container mb-5"
      style={{ marginTop: "180px", maxWidth: "1120px" }}
    >
      {/* HEADER SECTION */}
      <div className="d-flex justify-content-between align-items-end mb-3">
        <div>
          <h1 className="fw-bold mb-1 h3 text-start">{home.houseName}</h1>
          <div className="d-flex gap-2 small fw-bold">
            <span>★ {home.rating}</span>
            <span className="text-decoration-underline ms-1">
              {reviews.length} reviews
            </span>
            <span className="text-decoration-underline ms-1">
              {home.location}
            </span>
          </div>
        </div>
        <div className="d-flex gap-3 small fw-bold text-decoration-underline cursor-pointer">
          <span>
            <i className="bi bi-box-arrow-up me-2"></i>Share
          </span>
          <span>
            <i className="bi bi-heart me-2"></i>Save
          </span>
        </div>
      </div>

      {/* AIRBNB STYLE PHOTO GRID */}
      <div className="photo-grid-v2 mb-5">
        <div className="photo-hero">
          <img
            src={getUrl(home.photoUrl[0])}
            alt="Main"
            className="img-fluid h-100 w-100 object-fit-cover"
          />
        </div>
        <div className="photo-side-grid">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="photo-item">
              <img
                src={getUrl(home.photoUrl[idx] || home.photoUrl[0])}
                alt={`Sub ${idx}`}
                className="img-fluid h-100 w-100 object-fit-cover"
              />
            </div>
          ))}
        </div>
        <button className="btn btn-light btn-sm position-absolute bottom-0 end-0 m-3 fw-bold border-dark rounded-3 px-3 shadow-sm">
          <i className="bi bi-grid-3x3-gap me-2"></i> Show all photos
        </button>
      </div>

      <div className="row g-5 border-bottom pb-5">
        {/* LEFT COLUMN: HOST & DESCRIPTION */}
        <div className="col-lg-7 text-start">
          <div className="border-bottom pb-4 mb-4 d-flex justify-content-between align-items-center">
            <div>
              <h3 className="fw-bold h4 mb-0">
                Hosted by {home.userId?.firstName || "Host"}
              </h3>
              <p className="text-muted mb-0 small">
                4 guests · 2 bedrooms · 2 beds · 2 baths
              </p>
            </div>
            <div
              className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "48px", height: "48px" }}
            >
              {home.userId?.firstName?.charAt(0) || "H"}
            </div>
          </div>
          <p className="fs-5 text-dark" style={{ lineHeight: "1.6" }}>
            {home.description}
          </p>
          <hr className="my-5" />
          <h4 className="fw-bold mb-4">Where you'll be</h4>
          <div id="map" style={{ height: "400px", borderRadius: "16px" }}></div>
        </div>

        {/* RIGHT COLUMN: BOOKING CARD */}
        <div className="col-lg-5">
          <div
            className="booking-card shadow-lg border p-4 sticky-top"
            style={{ top: "120px", borderRadius: "16px" }}
          >
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <div>
                <span className="fs-3 fw-bold">₹{home.price}</span>
                <span className="text-secondary small ms-1">night</span>
              </div>
              <span className="small text-decoration-underline fw-bold">
                {home.rating} · {reviews.length} reviews
              </span>
            </div>

            <div className="text-center mb-3 p-2 border rounded-3 bg-light">
              <label
                className="fw-bold small d-block text-uppercase text-secondary"
                style={{ fontSize: "0.65rem" }}
              >
                Availability
              </label>
              <span className="fw-bold small">
                {new Date(home.availableFrom).toLocaleDateString()} –{" "}
                {new Date(home.availableTo).toLocaleDateString()}
              </span>
            </div>

            <div className="border rounded-3 mb-3">
              <div className="d-flex border-bottom text-start">
                <div className="p-3 w-50 border-end">
                  <label
                    className="fw-bold mb-0"
                    style={{ fontSize: "0.65rem" }}
                  >
                    CHECK-IN
                  </label>
                  <input
                    type="date"
                    className="form-control border-0 p-0 shadow-none small"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div className="p-3 w-50">
                  <label
                    className="fw-bold mb-0"
                    style={{ fontSize: "0.65rem" }}
                  >
                    CHECK-OUT
                  </label>
                  <input
                    type="date"
                    className="form-control border-0 p-0 shadow-none small"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              {/* GUEST DROPDOWN (UPWARD OPENING) */}
              <div
                className="p-3 position-relative cursor-pointer text-start"
                onClick={() => setGuestMenuOpen(!guestMenuOpen)}
              >
                <label className="fw-bold mb-0" style={{ fontSize: "0.65rem" }}>
                  GUESTS
                </label>
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <span className="small">
                    {totalGuests} Guest{totalGuests > 1 ? "s" : ""}
                  </span>
                  <i
                    className={`bi bi-chevron-${guestMenuOpen ? "up" : "down"}`}
                  ></i>
                </div>

                {guestMenuOpen && (
                  <div
                    className="position-absolute bg-white border shadow-lg rounded-4 p-4 w-100 start-0"
                    style={{
                      zIndex: 1100,
                      bottom: "100%",
                      marginBottom: "10px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {["adults", "children", "seniors"].map((type) => (
                      <div
                        key={type}
                        className="d-flex justify-content-between align-items-center mb-4"
                      >
                        <div className="d-flex flex-column text-start">
                          <span className="fw-bold text-capitalize small">
                            {type === "seniors" ? "Seniors" : type}
                          </span>
                          <span
                            className="text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            {type === "adults"
                              ? "Ages 13+"
                              : type === "children"
                              ? "Ages 2–12"
                              : "Ages 60+"}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <button
                            className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "32px", height: "32px" }}
                            onClick={(e) => updateGuest(e, type, -1)}
                          >
                            −
                          </button>
                          <span
                            className="fw-bold"
                            style={{ minWidth: "15px", textAlign: "center" }}
                          >
                            {guests[type]}
                          </span>
                          <button
                            className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "32px", height: "32px" }}
                            onClick={(e) => updateGuest(e, type, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      className="btn btn-link text-dark fw-bold text-decoration-underline p-0 w-100 text-end"
                      onClick={(e) => {
                        e.stopPropagation();
                        setGuestMenuOpen(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleReserve}
              className="btn btn-danger w-100 py-3 fw-bold rounded-3 mb-3"
              style={{ backgroundColor: "#FF385C", border: "none" }}
            >
              Reserve
            </button>
            <div className="d-flex justify-content-between border-top pt-3 fw-bold fs-5">
              <span>Total</span>
              <span>₹{calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <section className="py-5 text-start" id="reviews">
        <h2 className="fw-bold h4 mb-5">
          ★ {home.rating} · {reviews.length} reviews
        </h2>
        {isLoggedIn && (
          <button
            className="btn btn-outline-dark rounded-pill px-4 fw-bold shadow-sm mb-4"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </button>
        )}

        {showReviewForm && (
          <div className="card border-0 bg-light p-4 rounded-4 mb-5 shadow-sm">
            <h5 className="fw-bold mb-3 text-start">Share your experience</h5>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-3 text-start">
                <label className="fw-bold small mb-2">Rating</label>
                <select
                  className="form-select border-0 p-2 shadow-sm"
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({ ...newReview, rating: e.target.value })
                  }
                >
                  <option value="5">5 Stars - Perfect</option>
                  <option value="4">4 Stars - Great</option>
                  <option value="3">3 Stars - Good</option>
                  <option value="2">2 Stars - OK</option>
                  <option value="1">1 Star - Bad</option>
                </select>
              </div>
              <div className="mb-4">
                <textarea
                  className="form-control border-0 p-3 shadow-sm"
                  rows="3"
                  placeholder="Tell others about your stay..."
                  required
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-danger rounded-pill px-5 fw-bold"
                style={{ backgroundColor: "#FF385C", border: "none" }}
              >
                Submit Review
              </button>
            </form>
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-2 g-5">
          {reviews.map((rev) => (
            <div className="col" key={rev._id}>
              <div className="d-flex align-items-center mb-3">
                <div
                  className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3"
                  style={{ width: "48px", height: "48px" }}
                >
                  {rev.userId?.firstName?.charAt(0) || "G"}
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-start">
                    {rev.userId?.firstName || "Guest"}
                  </h6>
                  <small className="text-muted d-block text-start">
                    {new Date(rev.date).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </small>
                </div>
              </div>
              <p className="text-dark text-start" style={{ lineHeight: "1.6" }}>
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomeDetail;
