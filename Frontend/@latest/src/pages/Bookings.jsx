import React, { useState, useEffect } from "react";
import api from "../services/api";
import Badge from "../components/UI/Badge";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Error fetching trips:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Correct filtering
  const upcomingTrips = bookings.filter(
    (b) => b.status === "Pending" || b.status === "Confirmed"
  );

  const historyTrips = bookings.filter(
    (b) => b.status === "Cancelled" || b.status === "Rejected"
  );

  const cancelTrip = async (bookingId) => {
    try {
      await api.post("/cancel-booking", { bookingId });
      fetchBookings(); // 🔴 CRITICAL
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center" style={{ marginTop: "200px" }}>
        Loading your adventures...
      </div>
    );

  return (
    <main
      className="container mb-5"
      style={{ marginTop: "180px", maxWidth: "900px" }}
    >
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
        <div>
          <h1 className="fw-bold mb-1">Your Trips</h1>
          <p className="text-secondary mb-0">Manage your upcoming adventures</p>
        </div>

        {/* Tabs */}
        <ul className="nav nav-pills bg-white p-1 rounded-pill shadow-sm border">
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill fw-bold px-4 ${
                activeTab === "upcoming" ? "active" : "text-secondary"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
              <span className="badge bg-dark ms-2 rounded-circle">
                {upcomingTrips.length}
              </span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill fw-bold px-4 ${
                activeTab === "history" ? "active" : "text-secondary"
              }`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
          </li>
        </ul>
      </div>

      {/* CONTENT */}
      {activeTab === "upcoming" ? (
        <div className="d-flex flex-column align-items-center gap-5">
          {upcomingTrips.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-suitcase-lg-fill fs-1 text-dark opacity-25"></i>
              <h3 className="text-muted h5 mt-3">No upcoming trips</h3>
            </div>
          ) : (
            upcomingTrips.map((booking) => (
              <div
                key={booking._id}
                className="card border-0 shadow-lg rounded-4 overflow-hidden w-100"
                style={{ maxWidth: "850px" }}
              >
                {/* STATUS BAR */}
                <div
                  className={`p-3 px-4 d-flex justify-content-between align-items-center ${
                    booking.status === "Confirmed"
                      ? "bg-success text-white"
                      : "bg-warning text-dark"
                  }`}
                >
                  <span className="fw-bold text-uppercase">
                    {booking.status === "Confirmed"
                      ? "Confirmed"
                      : "Request Pending"}
                  </span>
                  <small>
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </small>
                </div>

                <div className="row g-0">
                  {/* LEFT */}
                  <div className="col-md-8 p-4 bg-white">
                    <h3 className="fw-bold mb-2">{booking.homeName}</h3>

                    <div className="row my-3">
                      <div className="col-6">
                        <small className="text-muted fw-bold">CHECK-IN</small>
                        <div className="fw-bold">
                          {new Date(booking.checkIn).toDateString()}
                        </div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted fw-bold">CHECK-OUT</small>
                        <div className="fw-bold">
                          {new Date(booking.checkOut).toDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Boarding Info */}
                    <div className="small text-secondary">
                      Guests:{" "}
                      {booking.adults + booking.children + booking.seniors} (
                      {booking.adults} Adults · {booking.children} Children ·{" "}
                      {booking.seniors} Infants)
                    </div>

                    <div className="small text-secondary mt-1">
                      Booker: {booking.user?.email || "—"}
                    </div>

                    <div className="border-top pt-3 mt-4 d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted">Total Paid</small>
                        <div className="fs-4 fw-bold text-success">
                          ₹{booking.totalPrice.toLocaleString()}
                        </div>
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold"
                        onClick={() => cancelTrip(booking._id)}
                      >
                        Cancel Trip
                      </button>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="col-md-4 bg-light p-4 d-flex flex-column align-items-center justify-content-center border-start text-center">
                    {booking.status === "Confirmed" ? (
                      <>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking._id}`}
                          alt="QR"
                          className="mb-3"
                          style={{ width: "120px" }}
                        />
                        <Badge status="Confirmed" />
                      </>
                    ) : (
                      <>
                        <div className="spinner-border text-warning mb-3"></div>
                        <div className="fw-bold">Awaiting Approval</div>
                        <small className="text-muted">
                          The host has 24 hours to respond.
                        </small>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* HISTORY */
        <div className="d-flex flex-column align-items-center gap-4">
          {historyTrips.length === 0 ? (
            <div className="text-muted">No past bookings found.</div>
          ) : (
            historyTrips.map((booking) => (
              <div
                key={booking._id}
                className="card border-0 shadow-sm rounded-4 w-100 opacity-75"
                style={{ maxWidth: "850px" }}
              >
                <div className="bg-secondary text-white p-3 d-flex justify-content-between">
                  <span className="fw-bold text-uppercase">
                    {booking.status}
                  </span>
                  <span className="small">Archived</span>
                </div>
                <div className="p-4 bg-white">
                  <h4 className="fw-bold text-muted">{booking.homeName}</h4>
                  <div className="text-decoration-line-through fs-4 fw-bold text-muted">
                    ₹{booking.totalPrice}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
};

export default Bookings;
