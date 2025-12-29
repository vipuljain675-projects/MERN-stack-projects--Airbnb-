import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
        document.body.classList.add("is-scrolled");
      } else {
        setIsScrolled(false);
        document.body.classList.remove("is-scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(
        `/search?location=${searchQuery}&checkIn=${checkIn}&checkOut=${checkOut}`
      );
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed-top bg-white border-bottom transition-all ${
        isScrolled ? "is-scrolled shadow-sm" : ""
      }`}
      style={{ zIndex: 1030 }}
    >
      <div
        className="container-fluid px-4 px-md-5 d-flex justify-content-between align-items-center"
        style={{
          height: isScrolled ? "80px" : "100px",
          maxWidth: "1760px",
          transition: "0.3s",
        }}
      >
        {/* 1. Official Logo */}
        <Link
          to="/"
          className="text-decoration-none d-flex align-items-center col-4"
          style={{ color: "#FF385C" }}
        >
          <svg viewBox="0 0 32 32" width="34" height="34" fill="currentColor">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.392 3.42-6.72 3.42-3.481 0-6.358-2.416-6.358-6.478 0-1.129.243-2.226.772-3.64l.113-.29c1.01-2.583 5.37-11.85 7.186-15.632l.433-.9c1.31-2.67 2.723-3.626 4.717-3.626zm0 2.2c-1.218 0-2.062.62-3.084 2.704l-.45 1c-1.802 3.754-6.142 13.016-7.142 15.576l-.089.234c-.42 1.12-.61 1.956-.61 2.81 0 2.84 1.952 4.278 4.158 4.278 1.638 0 3.38-1.004 4.97-2.618l.144-.15.228-.238c.614-.64 1.155-.64 1.768 0l.232.242.148.156c1.583 1.606 3.315 2.608 4.954 2.608 2.204 0 4.157-1.438 4.157-4.278 0-.585-.14-1.27-.482-2.09l-.11-.252c-1.01-2.35-5.116-11.02-7.058-14.835l-.546-1.05C18.062 3.82 17.218 3.2 16 3.2zM16 16c1.105 0 2 1.12 2 2.5S17.105 21 16 21s-2-1.12-2-2.5 1.105-2.5 2-2.5z"></path>
          </svg>
          <span
            className="d-none d-lg-block fw-bold ms-1 fs-4"
            style={{ letterSpacing: "-1.5px" }}
          >
            airbnb
          </span>
        </Link>

        {/* 2. Center Category Icons */}
        <div className="col-4 d-flex justify-content-center">
          {!isScrolled ? (
            <div
              id="nav-center-links"
              className="d-none d-md-flex align-items-center gap-4"
            >
              <Link
                to="/"
                className={`nav-icon-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
              >
                <i className="bi bi-house-door"></i>
                <span>Homes</span>
              </Link>
              <Link to="#" className="nav-icon-link">
                <i className="bi bi-ticket-perforated"></i>
                <span>Experiences</span>
              </Link>
              <Link to="#" className="nav-icon-link">
                <i className="bi bi-laptop"></i>
                <span>Services</span>
              </Link>
            </div>
          ) : (
            <div
              id="mini-search-bar"
              className="border rounded-pill py-2 px-3 align-items-center gap-3 cursor-pointer d-flex shadow-sm"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <span className="fw-bold small ps-2">Anywhere</span>
              <span className="text-muted opacity-25">|</span>
              <span className="fw-bold small">Any week</span>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#FF385C",
                }}
              >
                <i
                  className="bi bi-search text-white"
                  style={{ fontSize: "12px" }}
                ></i>
              </div>
            </div>
          )}
        </div>

        {/* 3. Right Menu Logic - Strictly Conditional */}
        <div className="d-flex align-items-center justify-content-end gap-2 col-4">
          {isLoggedIn ? (
            <>
              <div className="d-none d-xl-flex gap-2">
                <Link
                  to="/bookings"
                  className="btn btn-link text-dark text-decoration-none fw-bold rounded-pill px-3 small hover-bg-light"
                >
                  Trips
                </Link>
                <Link
                  to="/favourite-list"
                  className="btn btn-link text-dark text-decoration-none fw-bold rounded-pill px-3 small hover-bg-light"
                >
                  Saved
                </Link>
              </div>
              <Link
                to="/host"
                className="btn btn-link text-dark text-decoration-none fw-bold rounded-pill px-3 small d-none d-md-block hover-bg-light"
              >
                Switch to Host
              </Link>
            </>
          ) : (
            <Link
              to="/signup"
              className="btn btn-link text-dark text-decoration-none fw-bold rounded-pill px-3 small hover-bg-light"
            >
              Airbnb your home
            </Link>
          )}

          <div className="dropdown">
            <div
              className="user-menu-pill border p-1 ps-2 d-flex align-items-center gap-2 rounded-pill hover-shadow"
              data-bs-toggle="dropdown"
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-list fs-5"></i>
              <div
                className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{ width: "32px", height: "32px", fontSize: "0.8rem" }}
              >
                {isLoggedIn ? (
                  user?.firstName?.charAt(0)
                ) : (
                  <i className="bi bi-person-fill"></i>
                )}
              </div>
            </div>

            <ul
              className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2 p-3"
              style={{ minWidth: "240px" }}
            >
              {isLoggedIn ? (
                <>
                  <li>
                    <span className="dropdown-header fw-bold text-dark">
                      Hi, {user?.firstName}
                    </span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 fw-bold" to="/bookings">
                      My Trips
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item py-2 fw-bold"
                      to="/favourite-list"
                    >
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to="/host/host-home-list"
                    >
                      Manage Listings
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to="/host/manage-bookings"
                    >
                      Handle Requests
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="dropdown-item text-danger fw-bold py-2"
                    >
                      Log out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link className="dropdown-item fw-bold py-2" to="/login">
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/signup">
                      Sign up
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/help">
                      Help Center
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Search Bar */}
      {!isScrolled && (
        <div className="w-100 d-flex justify-content-center pb-4 transition-all">
          <div
            className="border rounded-pill shadow-sm d-flex align-items-center bg-white"
            style={{ width: "100%", maxWidth: "850px", height: "66px" }}
          >
            <form
              onSubmit={handleSearch}
              className="d-flex w-100 align-items-center h-100"
            >
              <div className="px-4 h-100 d-flex flex-column justify-content-center flex-grow-1 border-end hover-bg-gray rounded-pill-start">
                <label
                  className="d-block fw-bold text-dark mb-0"
                  style={{ fontSize: "0.75rem" }}
                >
                  Where
                </label>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent shadow-none p-0 text-dark"
                  placeholder="Search destinations"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div
                className="px-4 h-100 d-flex flex-column justify-content-center border-end hover-bg-gray"
                style={{ width: "160px" }}
              >
                <label
                  className="fw-bold text-dark mb-0"
                  style={{ fontSize: "0.75rem" }}
                >
                  Check in
                </label>
                <input
                  type="date"
                  className="form-control border-0 bg-transparent shadow-none p-0 small text-muted"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div
                className="px-4 h-100 d-flex flex-column justify-content-center border-end hover-bg-gray"
                style={{ width: "160px" }}
              >
                <label
                  className="fw-bold text-dark mb-0"
                  style={{ fontSize: "0.75rem" }}
                >
                  Check out
                </label>
                <input
                  type="date"
                  className="form-control border-0 bg-transparent shadow-none p-0 small text-muted"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
              <div className="pe-2 ps-2">
                <button
                  type="submit"
                  className="btn rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    background: "#FF385C",
                    border: "none",
                    width: "48px",
                    height: "48px",
                  }}
                >
                  <i className="bi bi-search text-white"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
