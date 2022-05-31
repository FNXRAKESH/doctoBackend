const express = require("express");
const router = express.Router();

const {
  getReviewById,
  createReview,
  getReview,
  getAllReviews,
  updateReview,
  removeReview,
  getReviewsByUserId,
  getReviewsByDoctorId
} = require("../controllers/review");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getDoctorById } = require("../controllers/doctor");

//params
router.param("userId", getUserById);
router.param("reviewId", getReviewById);
router.param("doctorId", getDoctorById);

//actual routers goes here

//create
router.post(
  "/review/create/:doctorId/:userId",
  isSignedIn,
  isAuthenticated,
  createReview
);

//read
router.get("/review/:reviewId", getReview);
router.get("/reviews", getAllReviews);
router.get(
  "/UserReviews/:userId",
  isSignedIn,
  isAuthenticated,
  getReviewsByUserId
);
router.get("/DoctorReviews/:doctorId", getReviewsByDoctorId);
//router.get("/DoctorRating/:doctorId", getDoctorRating);

//update
router.put(
  "/review/:reviewId/:userId",
  isSignedIn,
  isAuthenticated,
  updateReview
);

//delete

router.delete(
  "/review/:reviewId/:userId",
  isSignedIn,
  isAuthenticated,
  removeReview
);

module.exports = router;
