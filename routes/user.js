const express = require('express');
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  getFavourite,
  createFavourite,
  getAllUsers,
  deleteFavourite,
  importContacts
} = require('../controllers/user');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');

//params
router.param('userId', getUserById);

//All actual routes goes here

//read
router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);
router.get(
  '/user/readFavourites/:userId',
  isSignedIn,
  isAuthenticated,
  getFavourite
);
router.get('/users', getAllUsers);

//update
router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);
router.put(
  '/user/createFavourites/:userId',
  isSignedIn,
  isAuthenticated,
  getUserById,
  createFavourite
);
router.put(
  '/user/import/:userId',
  isSignedIn,
  isAuthenticated,
  getUserById,
  importContacts
);

//Delete
router.delete(
  '/user/deleteFavourite/:userId/:doctorId',
  isSignedIn,
  isAuthenticated,
  getUserById,
  deleteFavourite
);

module.exports = router;
