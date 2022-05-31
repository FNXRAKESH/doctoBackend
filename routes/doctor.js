const express = require("express");
const router = express.Router();

const {
  getDoctorById,
  createDoctor,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  searchDoctors,
  filterRecommendations
} = require("../controllers/doctor");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//all of params
router.param("userId", getUserById);
router.param("doctorId", getDoctorById);

//all of actual routes

//create route
router.post(
  "/doctor/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createDoctor
  // upload
);

// read routes
router.get("/doctor/:doctorId", getDoctor);

//update route
router.put(
  "/doctor/:doctorId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateDoctor
);

//delete route
router.delete(
  "/doctor/:doctorId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteDoctor
);

//listing route
router.get("/doctors", getAllDoctors);

//search routes
router.post("/doctors/search", searchDoctors);
router.post("/doctors/search/:userId",
  isSignedIn,
  isAuthenticated,
  searchDoctors,
  filterRecommendations);
module.exports = router;
