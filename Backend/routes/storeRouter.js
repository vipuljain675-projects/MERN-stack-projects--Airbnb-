const express = require("express");
const storeController = require("../controllers/storeController");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

/* HOMES */
router.get("/homes", storeController.getHomeList);
router.get("/homes/:homeId", storeController.getHomeDetails);

/* SEARCH */
router.get("/search", storeController.getSearchResults);

/* BOOKINGS */
router.get("/bookings", isAuth, storeController.getBookings);
router.post("/bookings", isAuth, storeController.postBooking);
router.post("/cancel-booking", isAuth, storeController.postCancelBooking);

/* FAVOURITES */
router.get("/favourite-list", isAuth, storeController.getFavouriteList);
router.post("/favourite-list", isAuth, storeController.postAddToFavourite);
router.post("/favourite-list/remove", isAuth, storeController.postRemoveFavourite);

/* REVIEWS */
// 🟢 RECTIFIED: Changed "/review" to "/reviews" to match HomeDetail.jsx
router.post("/reviews", isAuth, storeController.postReview);

module.exports = router;