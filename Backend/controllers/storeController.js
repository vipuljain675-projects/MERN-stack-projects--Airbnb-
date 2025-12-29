const Home = require("../models/home");
const Booking = require("../models/booking");
const Favourite = require("../models/favourite");
const Review = require("../models/review");

/* =========================
   1. HOME LIST & DETAILS
========================= */

exports.getHomeList = async (req, res) => {
  try {
    // 🟢 RECTIFIED: Added sort to show newest homes first
    const homes = await Home.find().sort({ _id: -1 });
    return res.status(200).json({
      pageTitle: "Explore Homes",
      currentPage: "home-list",
      homes,
      isSearch: false
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Fetching homes failed" });
  }
};

exports.getHomeDetails = async (req, res) => {
  try {
    const homeId = req.params.homeId;

    const home = await Home.findById(homeId).populate("userId");
    if (!home) return res.status(404).json({ message: "Home not found" });

    // 🟢 RECTIFIED: Populate userId to get the reviewer's name
    const reviews = await Review.find({ homeId })
      .populate("userId", "firstName lastName") 
      .sort({ date: -1 });

    return res.status(200).json({
      home,
      reviews
    });
  } catch (err) {
    return res.status(500).json({ message: "Fetching details failed" });
  }
};
/* =========================
   2. SEARCH (RECTIFIED LOGIC)
========================= */

exports.getSearchResults = async (req, res) => {
  try {
    const { location, checkIn, checkOut } = req.query;

    let searchFilter = {};

    // 🟢 RECTIFIED: Only apply location filter if a real value is sent
    if (location && location !== "Anywhere" && location.trim() !== "") {
      searchFilter.location = { $regex: location, $options: "i" };
    }

    // 🟢 RECTIFIED: Date-based availability logic
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      const busyBookings = await Booking.find({
        status: { $in: ["Pending", "Confirmed"] },
        checkIn: { $lt: end },
        checkOut: { $gt: start }
      });

      const busyHomeIds = busyBookings.map(b => b.homeId.toString());
      searchFilter._id = { $nin: busyHomeIds };
    }

    const homes = await Home.find(searchFilter).sort({ _id: -1 });
    return res.status(200).json({ homes });
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    return res.status(500).json({ message: "Search failed" });
  }
};

/* =========================
   3. BOOKINGS (FIXED 500 ERROR)
========================= */

exports.getBookings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🟢 RECTIFIED: Correctly populate homeId as per your schema
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("homeId")
      .sort({ createdAt: -1 });

    const formatted = bookings.map(b => {
      // 🟢 RECTIFIED: Safety check to prevent crash if home was deleted
      if (!b.homeId) return null;

      return {
        _id: b._id,
        homeName: b.homeId.houseName,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        status: b.status,
        totalPrice: b.totalPrice,
        adults: b.guests?.adults || 1,
        children: b.guests?.children || 0,
        seniors: b.guests?.seniors || 0,
        createdAt: b.createdAt,
        user: { email: req.user.email }
      };
    }).filter(Boolean); // Remove any null entries

    return res.status(200).json({ bookings: formatted });
  } catch (err) {
    console.error("GET BOOKINGS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

exports.postBooking = async (req, res) => {
  try {
    const { homeId, checkIn, checkOut, adults, children, seniors } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);

    const conflict = await Booking.findOne({
      homeId,
      status: { $in: ["Pending", "Confirmed"] },
      checkIn: { $lt: newCheckOut },
      checkOut: { $gt: newCheckIn }
    });

    if (conflict) {
      return res.status(409).json({ message: "Dates Unavailable", homeId });
    }

    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).json({ message: "Home not found" });
    }

    const nights = Math.ceil((newCheckOut - newCheckIn) / (1000 * 60 * 60 * 24)) || 1;

    const booking = new Booking({
      homeId,
      userId: req.user._id,
      homeName: home.houseName,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      totalPrice: nights * home.price,
      price: home.price,
      status: "Pending",
      guests: {
        adults: parseInt(adults) || 1,
        children: parseInt(children) || 0,
        seniors: parseInt(seniors) || 0
      }
    });

    await booking.save();
    return res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    console.error("POST BOOKING ERROR:", err);
    return res.status(500).json({ message: "Booking failed" });
  }
};

exports.postCancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    await Booking.findByIdAndUpdate(bookingId, { status: "Cancelled" });
    return res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Cancellation failed" });
  }
};

/* =========================
   4. FAVOURITES
========================= */

exports.getFavouriteList = async (req, res) => {
  try {
    const favourites = await Favourite.find({ userId: req.user._id }).populate("homeId");
    const homes = favourites.map(f => f.homeId).filter(Boolean);
    return res.status(200).json({ pageTitle: "My Wishlist", homes });
  } catch (err) {
    return res.status(500).json({ message: "Fetching wishlist failed" });
  }
};

exports.postAddToFavourite = async (req, res) => {
  try {
    const { homeId } = req.body;
    const exists = await Favourite.findOne({ userId: req.user._id, homeId });
    if (exists) return res.status(200).json({ message: "Already in wishlist" });
    await Favourite.create({ userId: req.user._id, homeId });
    return res.status(201).json({ message: "Added to wishlist" });
  } catch (err) {
    return res.status(500).json({ message: "Adding to wishlist failed" });
  }
};

exports.postRemoveFavourite = async (req, res) => {
  try {
    const { homeId } = req.body;
    await Favourite.findOneAndDelete({ userId: req.user._id, homeId });
    return res.status(200).json({ message: "Removed from wishlist" });
  } catch (err) {
    return res.status(500).json({ message: "Removing from wishlist failed" });
  }
};

/* =========================
   5. REVIEWS
========================= */

exports.postReview = async (req, res) => {
  try {
    const { homeId, rating, comment } = req.body;
    const review = new Review({ homeId, userId: req.user._id, rating, comment, date: new Date() });
    await review.save();
    return res.status(201).json({ message: "Review added", review });
  } catch (err) {
    return res.status(500).json({ message: "Adding review failed" });
  }
};