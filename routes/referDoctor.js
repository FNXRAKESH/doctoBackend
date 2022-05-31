const express = require("express");
const router = express.Router();
const {
  getReferDoctorById,
  createReferDoctor,
  getReferDoctor,
} = require("../controllers/referDoctor");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("referDoctorId", getReferDoctorById);

//create route
router.post(
  "/referDoctor/create/:userId",
  isSignedIn,
  isAuthenticated,
  createReferDoctor
);

//read route
router.get("/referDoctor/read/:userId", isSignedIn, isAuthenticated, isAdmin, getReferDoctor);

module.exports = router;
