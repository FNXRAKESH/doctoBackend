const User = require('../models/user');
const Doctor = require('../models/doctor');

//middleware
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: err
      });
    }
    req.profile = user;
    next();
  });
};

//All methods goes here

//read

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};

//getting favourite doctors
exports.getFavourite = (req, res) => {
  console.log("get fav");
  Doctor.find(
    {
      _id: { $in: req.profile.favourite }
    },
    function (err, docs) {
      if (err) {
        return res.status(400).json(err);
      }
      return res.json(docs);
    }
  );
};

//getting all users
exports.getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: 'No Users Found in Database'
      });
    }

    res.json(users);
  });
};

//update

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: 'You are not authorized to update this user'
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

//updating the favourite doctors list
exports.createFavourite = (req, res) => {
  console.log("create");
  req.profile.favourite.push(req.body.favourite);
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: { favourite: req.profile.favourite } },
    (err) => {
      if (err) {
        return res.json(err);
      }
      return res.json(req.profile.favourite);
    }
  );
};

//Deleting favourite doctor
exports.deleteFavourite = (req, res) => {
  let arr = [];
  arr = req.profile.favourite;
  arr.remove(req.params.doctorId);
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: { favourite: arr } },
    (err) => {
      if (err) {
        return res.json(err);
      }
      return res.json(req.profile.favourite);
    }
  );
};

//Importing contact list
// input => user id, body ==> phone numbers
exports.importContacts = (req, res) => {
  // Parse numbers and get user ids and update it in mongodb
  User.find({ mobile: { $in: req.body.contacts } }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      for (var i = 0; i < result.length; i++) {
        if (!req.profile.friends.includes(result[i]._id))
          req.profile.friends.push(result[i]._id);
      }
      console.log(req.profile.friends);
      User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: { friends: req.profile.friends } },
        (err) => {
          if (err) {
            return res.json(err);
          }
          return res.json(req.profile.friends);
        }
      );
    }
  });
};

// // Add a doctor to list of recommended doctors by user
// // input => user id, doctor id
// exports.recommendDoctor = (req, res) => {
//   // Check if already recommended
//   // If not then add to recommended list

// };

// // Remove doctor from recommendation
// // input => user id, doctor id
// exports.removeRecommendation = (req, res) => {
//   // Check if doctor is recommended
//   // Remove if recommended
// };
