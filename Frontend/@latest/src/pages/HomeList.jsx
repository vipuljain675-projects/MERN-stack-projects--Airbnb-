import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Badge from "../components/UI/Badge";
import { AuthContext } from "../context/AuthContext";

const HomeList = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // 🟢 Requirement: Tracks your current 10-home chunk
  const [hasMore, setHasMore] = useState(true); // 🟢 Requirement: Controls "Show more" visibility

  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // 🟢 RESTORED: Your original Image URL helper
  const getImageUrl = (url) => {
    if (!url)
      return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800";
    if (url.startsWith("http")) return url;

    const baseUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace("/api", "")
      : "http://localhost:3500";
    return `${baseUrl}${url}`;
  };

  // 🟢 RECTIFIED: Complete fetch logic with Pagination + Search
  const fetchHomes = async (pageNum, isInitial = false) => {
    if (isInitial) setLoading(true);

    const queryParams = new URLSearchParams(location.search);
    const searchLocation = queryParams.get("location");
    const checkIn = queryParams.get("checkIn");
    const checkOut = queryParams.get("checkOut");

    try {
      let endpoint = `/homes?page=${pageNum}`;

      // Keep search functional while paginating
      if (searchLocation || (checkIn && checkOut)) {
        endpoint = `/search?location=${searchLocation || ""}&checkIn=${
          checkIn || ""
        }&checkOut=${checkOut || ""}&page=${pageNum}`;
      }

      const res = await api.get(endpoint);
      const fetchedHomes = res.data.homes || [];

      if (isInitial) {
        setHomes(fetchedHomes);
      } else {
        // 🟢 APPENDING: Add next 10 items to your grid
        setHomes((prev) => [...prev, ...fetchedHomes]);
      }

      // 🟢 RECTIFIED: Stop showing button based on backend "hasNextPage"
      setHasMore(res.data.hasNextPage);
    } catch (err) {
      console.error("Failed to fetch homes:", err);
      if (isInitial) setHomes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchHomes(1, true);
  }, [location.search]);

  // 🟢 RECTIFIED: Handle clicking "Show more"
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchHomes(nextPage, false);
  };

  // 🟢 RESTORED: Your original Detail Link generator
  const getDetailLink = (homeId) => {
    const params = new URLSearchParams(location.search);
    const checkIn = params.get("checkIn");
    const checkOut = params.get("checkOut");
    let link = `/homes/${homeId}`;
    if (checkIn && checkOut) {
      link += `?checkIn=${checkIn}&checkOut=${checkOut}`;
    }
    return link;
  };

  // 🟢 RESTORED: Your original Favourite Toggler
  const toggleFavourite = async (e, homeId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) return navigate("/login");
    try {
      await api.post("/favourite-list", { homeId });
      navigate("/favourite-list");
    } catch (err) {
      console.error("Error saving favourite:", err);
    }
  };

  // 🟢 Sexy Skeleton Loader for initial load
  const SkeletonGrid = () => (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-x-3 g-y-4 mb-5">
      {[...Array(10)].map((_, i) => (
        <div className="col" key={i}>
          <div
            className="skeleton-card mb-2"
            style={{ aspectRatio: "20/19", borderRadius: "12px" }}
          ></div>
          <div className="skeleton-text w-75 mb-1"></div>
          <div className="skeleton-text w-50"></div>
        </div>
      ))}
    </div>
  );

  return (
    <main
      className="container-fluid px-4 px-md-5"
      style={{ marginTop: "180px" }}
    >
      {loading && page === 1 ? (
        <SkeletonGrid />
      ) : (
        <>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-x-3 g-y-4 mb-5">
            {homes.map((home) => (
              <div className="col" key={home._id}>
                <div className="card h-100 border-0 bg-transparent group-card cursor-pointer">
                  <div className="position-relative rounded-4 overflow-hidden mb-2 shadow-sm">
                    <Link
                      to={getDetailLink(home._id)}
                      className="d-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={getImageUrl(home.photoUrl[0])}
                        className="w-100 object-fit-cover"
                        alt={home.houseName}
                        style={{ aspectRatio: "20/19" }}
                      />
                    </Link>
                    <div className="position-absolute top-0 end-0 p-3">
                      <button
                        onClick={(e) => toggleFavourite(e, home._id)}
                        className="btn p-0 border-0 bg-transparent shadow-none"
                      >
                        <i className="bi bi-heart fs-5 text-white shadow-text"></i>
                      </button>
                    </div>
                    {home.rating >= 4.8 && <Badge type="favourite" />}
                  </div>

                  <Link
                    to={getDetailLink(home._id)}
                    className="text-decoration-none text-dark"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div
                        className="fw-bold text-truncate"
                        style={{ maxWidth: "80%" }}
                      >
                        {home.location}
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <i className="bi bi-star-fill small"></i>
                        <span>{home.rating}</span>
                      </div>
                    </div>
                    <div className="text-secondary small text-truncate">
                      {home.houseName}
                    </div>
                    <div className="mt-1">
                      <span className="fw-bold">
                        ₹{home.price.toLocaleString()}
                      </span>{" "}
                      <span className="text-secondary">night</span>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* 🟢 RECTIFIED: Load More Button */}
          {hasMore && (
            <div className="text-center my-5 pb-5">
              <button
                className="btn load-more-btn rounded-pill px-5 py-2 fw-bold"
                onClick={handleLoadMore}
                disabled={loading} // Prevent double-clicks
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : null}
                {loading ? "Loading..." : "Show more"}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default HomeList;
