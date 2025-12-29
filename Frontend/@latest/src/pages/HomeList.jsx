import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Badge from "../components/UI/Badge";
import { AuthContext } from "../context/AuthContext";

const HomeList = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const getImageUrl = (url) => {
    if (!url)
      return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800";
    if (url.startsWith("http")) return url;
    return `http://localhost:3500${url}`;
  };

  useEffect(() => {
    const fetchHomes = async () => {
      setLoading(true);
      const queryParams = new URLSearchParams(location.search);
      const searchLocation = queryParams.get("location");
      const checkIn = queryParams.get("checkIn");
      const checkOut = queryParams.get("checkOut");

      try {
        let endpoint = "/homes";
        if (searchLocation || (checkIn && checkOut)) {
          endpoint = `/search?location=${searchLocation || ""}&checkIn=${
            checkIn || ""
          }&checkOut=${checkOut || ""}`;
        }
        const res = await api.get(endpoint);
        setHomes(res.data.homes || []);
      } catch (err) {
        console.error("Failed to fetch homes:", err);
        setHomes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHomes();
  }, [location.search]);

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

  if (loading) {
    return (
      <div className="text-center" style={{ marginTop: "200px" }}>
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  return (
    <main
      className="container-fluid px-4 px-md-5"
      style={{ marginTop: "180px" }}
    >
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-x-3 g-y-4 mb-5">
        {homes.map((home) => (
          <div className="col" key={home._id}>
            <div className="card h-100 border-0 bg-transparent group-card">
              <div className="position-relative rounded-4 overflow-hidden mb-2 shadow-sm">
                {/* 🟢 RECTIFIED: Added target="_blank" to open in new tab */}
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

              {/* 🟢 RECTIFIED: Added target="_blank" to the text link as well */}
              <Link
                to={getDetailLink(home._id)}
                className="text-decoration-none text-dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="d-flex justify-content-between">
                  <div
                    className="fw-bold text-truncate"
                    style={{ maxWidth: "80%" }}
                  >
                    {home.location}
                  </div>
                  <div>★ {home.rating}</div>
                </div>
                <div className="text-secondary small">{home.houseName}</div>
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
    </main>
  );
};

export default HomeList;
