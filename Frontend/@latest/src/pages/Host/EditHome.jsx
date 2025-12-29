import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const EditHome = () => {
  const [formData, setFormData] = useState({
    houseName: "",
    price: "",
    location: "",
    description: "",
    rating: "4.5",
    availableFrom: "",
    availableTo: "",
    amenities: [],
  });
  const [photos, setPhotos] = useState([]); // Array to hold multiple files
  const navigate = useNavigate();

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // 🟢 RECTIFIED: Append files instead of replacing them
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setPhotos((prevPhotos) => {
      const updatedPhotos = [...prevPhotos, ...newFiles];
      return updatedPhotos.slice(0, 5); // Limit to 5 photos total
    });
  };

  // 🟢 RECTIFIED: Function to remove a specific photo before uploading
  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("houseName", formData.houseName);
    data.append("price", formData.price);
    data.append("location", formData.location);
    data.append("description", formData.description);
    data.append("rating", formData.rating);
    data.append("availableFrom", formData.availableFrom);
    data.append("availableTo", formData.availableTo);

    formData.amenities.forEach((a) => data.append("amenities", a));

    // 🟢 RECTIFIED: Append each file in the photos array
    photos.forEach((file) => data.append("photos", file));

    try {
      await api.post("/host/add-home", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/host/host-home-list");
    } catch (err) {
      console.error("PUBLISH ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error publishing home.");
    }
  };

  return (
    <main
      className="container mb-5"
      style={{ marginTop: "140px", maxWidth: "1000px" }}
    >
      <div className="mb-4">
        <h1 className="fw-bold mb-1">Add a New Home</h1>
        <p className="text-muted small">
          Hosted by{" "}
          {JSON.parse(localStorage.getItem("user"))?.firstName || "Host"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="row g-5 text-start">
        <div className="col-lg-7">
          <h4 className="fw-bold mb-4">Property Details</h4>

          <div className="mb-4">
            <label className="form-label fw-bold small">Home Name</label>
            <input
              type="text"
              className="form-control p-3 bg-light border-0 rounded-3"
              placeholder="e.g. Seaside Villa"
              required
              value={formData.houseName}
              onChange={(e) =>
                setFormData({ ...formData, houseName: e.target.value })
              }
            />
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-bold small">
                Price per Night (₹)
              </label>
              <input
                type="number"
                className="form-control p-3 bg-light border-0 rounded-3"
                placeholder="e.g. 5000"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small">Initial Rating</label>
              <input
                type="number"
                step="0.1"
                className="form-control p-3 bg-light border-0 rounded-3"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small">Location</label>
            <input
              type="text"
              className="form-control p-3 bg-light border-0 rounded-3"
              placeholder="e.g. Goa, India"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <div className="mb-4 p-3 border rounded-3 bg-white shadow-sm">
            <label className="form-label fw-bold small mb-3">
              Availability Window
            </label>
            <div className="d-flex align-items-center gap-2">
              <div className="flex-grow-1 border-end pe-2">
                <span
                  className="small text-muted d-block"
                  style={{ fontSize: "0.65rem" }}
                >
                  FROM
                </span>
                <input
                  type="date"
                  className="form-control border-0 p-0 shadow-none small"
                  required
                  value={formData.availableFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, availableFrom: e.target.value })
                  }
                />
              </div>
              <div className="flex-grow-1 ps-2">
                <span
                  className="small text-muted d-block"
                  style={{ fontSize: "0.65rem" }}
                >
                  TO
                </span>
                <input
                  type="date"
                  className="form-control border-0 p-0 shadow-none small"
                  required
                  value={formData.availableTo}
                  onChange={(e) =>
                    setFormData({ ...formData, availableTo: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small">Description</label>
            <textarea
              className="form-control bg-light border-0 rounded-3 p-3"
              rows="5"
              placeholder="Describe your place..."
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small mb-3">Amenities</label>
            <div className="row g-2">
              {["Wifi", "AC", "Pool", "TV", "Kitchen", "Gym"].map((item) => (
                <div key={item} className="col-6 col-md-4">
                  <div
                    className={`p-2 border rounded-3 cursor-pointer text-center small transition-all ${
                      formData.amenities.includes(item)
                        ? "bg-dark text-white border-dark"
                        : "bg-white"
                    }`}
                    onClick={() => handleAmenityChange(item)}
                  >
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <h4 className="fw-bold mb-4">Property Photos ({photos.length}/5)</h4>

          <div
            className="border-dashed p-5 text-center rounded-4 bg-light position-relative"
            style={{ border: "2px dashed #dddddd", cursor: "pointer" }}
          >
            <input
              type="file"
              multiple
              className="opacity-0 position-absolute w-100 h-100 top-0 start-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={photos.length >= 5}
            />
            <div className="py-2">
              <i className="bi bi-cloud-arrow-up fs-1 text-danger mb-2 d-block"></i>
              <div className="fw-bold small">Click to add photos</div>
              <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                Support for JPG, PNG
              </div>
            </div>
          </div>

          <div className="mt-4 row g-2">
            {photos.map((file, idx) => (
              <div key={idx} className="col-4 position-relative">
                <div
                  className="rounded-3 shadow-sm border overflow-hidden"
                  style={{ height: "80px" }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-100 h-100 object-fit-cover"
                    alt="preview"
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle p-0"
                    style={{ width: "20px", height: "20px", fontSize: "12px" }}
                    onClick={() => removePhoto(idx)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn btn-danger w-100 mt-5 py-3 fw-bold rounded-3 fs-5"
            style={{ backgroundColor: "#ff385c", border: "none" }}
          >
            Publish Your Home
          </button>
        </div>
      </form>
    </main>
  );
};

export default EditHome;
