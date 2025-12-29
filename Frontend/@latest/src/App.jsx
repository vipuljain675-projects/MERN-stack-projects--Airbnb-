import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./assets/home.css"; // Your original Airbnb styles
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import "./assets/home.css";
import Footer from "./components/Footer";

// Page Imports
import HomeList from "./pages/HomeList";
import HomeDetail from "./pages/HomeDetail";
import Bookings from "./pages/Bookings";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import BookLogin from "./pages/Auth/BookLogin";
import HostDashboard from "./pages/Host/HostDashboard";
import MyListings from "./pages/Host/MyListings";
import ManageBookings from "./pages/Host/ManageBookings";
import EditHome from "./pages/Host/EditHome";
import BookingFailed from "./pages/BookingFailed";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar stays at the top for all pages [cite: 74] */}
        <Navbar />

        <Routes>
          {/* Guest Routes */}
          <Route path="/" element={<HomeList />} />
          <Route path="/homes/:homeId" element={<HomeDetail />} />
          <Route path="/search" element={<HomeList />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/favourite-list" element={<Wishlist />} />
          <Route path="/booking-failed" element={<BookingFailed />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/book-login" element={<BookLogin />} />

          {/* Host Routes */}
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/host/host-home-list" element={<MyListings />} />
          <Route path="/host/manage-bookings" element={<ManageBookings />} />
          <Route path="/host/add-home" element={<EditHome />} />
          <Route path="/host/edit-home/:homeId" element={<EditHome />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
