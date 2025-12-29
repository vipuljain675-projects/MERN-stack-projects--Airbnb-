const Home = require("../models/home");
const Booking = require("../models/booking");

/* =========================
   1. HOST ENTRY POINT
========================= */

exports.getHostDashboard = (req, res, next) => {
  // Use req.userId set by the rectified is-auth middleware
  if (!req.userId) {
    return res.status(200).json({
      pageTitle: "Become a Host",
      currentPage: "host-landing",
      isAuthenticated: false
    });
  }

  // If logged in, check if they have homes
  Home.find({ userId: req.userId })
    .then(homes => {
      res.status(200).json({
        homes: homes,
        hasHomes: homes.length > 0,
        redirectTo: homes.length === 0 ? "/host/add-home" : "/host/host-home-list"
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Fetching dashboard data failed." });
    });
};

/* =========================
   2. MANAGE HOMES (CRUD)
========================= */

exports.getHostHomes = (req, res, next) => {
  // Authentication check is handled by is-auth middleware
  Home.find({ userId: req.userId })
    .then((homes) => {
      res.status(200).json({
        pageTitle: "Your Listing",
        currentPage: "host-home-list",
        homes: homes || [],
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Fetching host homes failed." });
    });
};

exports.getAddHome = (req, res, next) => {
  res.status(200).json({
    pageTitle: "Add Home",
    currentPage: "add-home",
    editing: false,
    home: null
  });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description, amenities, availableFrom, availableTo } = req.body;
  
  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized: No User ID found" });
  }

  let selectedAmenities = [];
  if (amenities) {
      selectedAmenities = Array.isArray(amenities) ? amenities : [amenities];
  }

  // 🟢 RECTIFIED: Map paths for multiple files
  let photoUrls = [];
  if (req.files && req.files.length > 0) {
      photoUrls = req.files.map(file => "/" + file.path.replace(/\\/g, "/"));
  } else {
      photoUrls = ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1965&auto=format&fit=crop"];
  }

  const newHome = new Home({
    houseName, 
    price: Number(price),
    location, 
    rating: Number(rating) || 4.5,
    description,
    photoUrl: photoUrls, 
    amenities: selectedAmenities,
    availableFrom: new Date(availableFrom),
    availableTo: new Date(availableTo),
    userId: req.userId, 
  });

  newHome.save().then((result) => {
    res.status(201).json({ message: "Home Added Successfully", home: result });
  })
  .catch(err => {
      console.error("DATABASE SAVE ERROR:", err);
      res.status(500).json({ message: "Saving home failed." });
  });
};


exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then((home) => {
      if (!home) return res.status(404).json({ message: "Home not found." });

      res.status(200).json({
        pageTitle: "Edit Home",
        currentPage: "host-home-list",
        editing: true,
        home: home,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Fetching home for edit failed." });
    });
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description, amenities, availableFrom, availableTo } = req.body;

  Home.findById(id).then((home) => {
    if (!home) return res.status(404).json({ message: "Home not found." });

    home.houseName = houseName;
    home.price = Number(price);
    home.location = location;
    home.rating = Number(rating);
    home.description = description;
    home.availableFrom = new Date(availableFrom);
    home.availableTo = new Date(availableTo);

    let selectedAmenities = [];
    if (amenities) {
        selectedAmenities = Array.isArray(amenities) ? amenities : [amenities];
    }
    home.amenities = selectedAmenities;

    // 🟢 RECTIFIED: Only update photoUrls if new files are uploaded, otherwise keep old ones
    if (req.files && req.files.length > 0) {
       home.photoUrl = req.files.map(file => "/" + file.path.replace(/\\/g, "/"));
    }

    return home.save();
  })
  .then((result) => {
    res.status(200).json({ message: "Home updated successfully.", home: result });
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ message: "Updating home failed." });
  });
};


exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId; 
  // Safety: Ensure user can only delete their own listings
  Home.findOneAndDelete({ _id: homeId, userId: req.userId })
    .then((result) => {
      if (!result) return res.status(404).json({ message: "Home not found or unauthorized." });
      res.status(200).json({ message: "Home deleted successfully." });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Deleting home failed." });
    });
};

/* =========================
   3. HOST BOOKING MANAGEMENT
========================= */

exports.getHostBookings = (req, res, next) => {
  // Find homes owned by the host
  Home.find({ userId: req.userId })
    .then(homes => {
      const homeIds = homes.map(home => home._id);
      
      // Find bookings for those homes
      return Booking.find({ homeId: { $in: homeIds } })
        .populate('userId') 
        .populate('homeId') 
        .sort({ createdAt: -1 }); 
    })
    .then(bookings => {
      res.status(200).json({
        pageTitle: "Manage Requests",
        currentPage: "manage-bookings",
        bookings: bookings,
        isAuthenticated: true,
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Fetching host bookings failed." });
    });
};

exports.postHandleBooking = (req, res, next) => {
  const { bookingId, action } = req.body; 
  
  // Update status (Confirmed/Rejected)
  Booking.findByIdAndUpdate(bookingId, { status: action })
    .then((result) => {
      res.status(200).json({ message: `Booking ${action} successfully.`, booking: result });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Handling booking request failed." });
    });
};