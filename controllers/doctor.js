var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var mapsdk = require('mapmyindia-sdk-nodejs');
const spacesEndpoint = new aws.Endpoint('ams3.digitaloceanspaces.com');
var async = require('async');
var waterfall = require('async-waterfall');
const s3 = new aws.S3({
  accessKeyId: 'I2XKR4LSQVA56UCL3ZPD',
  secretAccessKey: 'SbZQU0x5X9gG3v2OFHe47Sd3obcda6ZRa8tp2IWncg0',
  endpoint: spacesEndpoint
});

const Doctor = require('../models/doctor');
const User = require('../models/user');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const uuid = require('uuid/v4');

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'doctoapp',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: function (req, file, cb) {
      // console.log("where is my mind");
      cb(null, req.s3Key);
    }
  }),
  limits: {
    fileSize: 3200000
  }
});

const singleFileUpload = upload.single('photo');

//param middleware
exports.getDoctorById = (req, res, next, id) => {
  Doctor.findById(id).exec((err, doctor) => {
    if (err) {
      return res.status(400).json({
        error: 'Doctor not found'
      });
    }
    req.doctor = doctor;
    next();
  });
};

//All methods goes here--
//create
exports.createDoctor = (req, res) => {
  console.log('create Doctor');
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  req.s3Key = uuid();
  let downloadUrl = `https://doctoapp.ams3.cdn.digitaloceanspaces.com/${req.s3Key}`;
  singleFileUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json(err);
    }

    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.contact ||
      !req.body.speciality
    ) {
      return res.status(400).json({
        error: 'Please include all fields'
      });
    }
    let doctor = new Doctor();
    for (field in req.body) {
      doctor[field] = req.body[field];
    }

    //save to the getDoctorById
    doctor.save((err, doctor) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: 'Saving doctor in DB failed'
        });
      }
      return res.json(doctor);
    });
  });
};

//read
exports.getDoctor = (req, res) => {
  return res.json(req.doctor);
};

// //middleware
// exports.photo = (req, res, next) => {
//   if (req.doctor.photo.data) {
//     res.set("Content-Type", req.doctor.photo.contentType);
//     return res.send(req.doctor.photo.data);
//   }
//   next();
// };

// update controllers
exports.updateDoctor = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  console.log(form);
  req.s3Key = uuid();
  let downloadUrl = `https://doctoapp.ams3.cdn.digitaloceanspaces.com/${req.s3Key}`;
  let doctor = req.doctor;
  singleFileUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json(err);
    } else {
      console.log('Upload Success', downloadUrl);
      doctor.photoUrl = downloadUrl;
      for (field in req.body) {
        doctor[field] = req.body[field];
      }
      doctor.save((err, doctor) => {
        if (err) {
          return res.status(400).json(err);
        } else {
          return res.json(doctor);
        }
      });
    }
  });
};

// delete controllers
exports.deleteDoctor = (req, res) => {
  let doctor = req.doctor;
  doctor.remove((err, deletedDoctor) => {
    if (err) {
      return res.status(400).json({
        error: 'Failed to delete the doctor'
      });
    }
    res.json({
      message: 'Deletion was a success',
      deletedDoctor
    });
  });
};

//doctors listing on homepage
exports.getAllDoctors = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 50;
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';

  Doctor.find()
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec((err, doctors) => {
      if (err) {
        return res.status(400).json({
          error: 'NO doctor FOUND'
        });
      }
      res.json(doctors);
    });
};

// Search field
exports.searchDoctors = async function (req, res, next) {

  console.log(
    'req.body.coordinates ',
    req.body.coordinates,
    ' ',
    req.body.query
  );
  if (req.body.coordinates) {
    var doctors = await Doctor.find({
      location: {
        $near: {
          $maxDistance: 5000,
          $geometry: { type: 'Point', coordinates: req.body.coordinates }
        }
      },
      $or: [
        {
          name: {
            $regex: req.body.query,
            $options: 'i'
          }
        },
        {
          description: {
            $regex: req.body.query,
            $options: 'i'
          }
        },
        {
          speciality: {
            $regex: req.body.query,
            $options: 'i'
          }
        },
        {
          hospitals: {
            $regex: req.body.query,
            $options: 'i'
          }
        }
      ]
    });
    console.log('doctors in If', doctors);
    req.doctors = doctors;
    res.json(doctors);
    // next();
  } else {
    var doctors = await Doctor.find({
      $or: [
        {
          name: {
            $regex: req.body.query,
            $options: 'i'
          }
        },
        {
          description: {
            $regex: req.body.query,
            $options: 'i'
          }
        },
        {
          speciality: {
            $regex: req.body.query,
            $options: 'i'
          }
        },
        {
          hospitals: {
            $regex: req.body.query,
            $options: 'i'
          }
        }
      ]
    });
    console.log('doctors else', doctors);
    req.doctors = doctors;
    // next();
    res.json(doctors);
  }
};

// // Filter by distance
// // Input -> maxDistance, current coordinates, doctors return list sorted by distance.
// exports.filterDistance = (req, res) => {
//   // Return in ascending order query results.
//   // Call mymapapi distance matrix to get distances
//   // Remove ones >= maxDistance
//   // Sort and Return

//   runLoop = async () => {
//     var i = 0;
//     var arr = [];
//     let dis
//     for(doctor in req.doctors)
//     {
//       arr.push([id, coordinates])
//     }
//   }

// }

// Filter by recommendations
// Input => userId, list of doctors,
exports.filterRecommendations = (req, res) => {
  waterfall(
    [
      // Filter through friends and create a map {id: count of recommendations}
      function (callback) {
        let recommendations = new Map();
        User.find({
          _id: { $in: req.profile.friends }
        }).exec((err, friends) => {
          function updateRecommendation(id) {
            if (recommendations.has(id) == false) recommendations[id] = 1;
            else recommendations[id] += 1;
          }
          runLoop = async () => {
            var j = 0,
              i = 0;
            if (friends.length == 0) callback(null, recommendations);
            for (j = 0; j < friends.length; j++) {
              for (i = 0; i < friends[j].favourite.length; i++) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                updateRecommendation(friends[j].favourite[i]);
              }
              if (j == friends.length - 1) {
                callback(null, recommendations);
              }
            }
          };
          runLoop();
        });
      },
      // Create Array containing [[Count of Recommendations, doctor objects from our search query]]
      function (recommendations, callback) {
        var array = [];
        if (req.doctors.length == 0) callback(null, array);
        for (var i = 0; i < req.doctors.length; i++) {
          console.log(req.doctors[i]._id.toString());
          let value = 0;
          if (req.doctors[i]._id.toString() in recommendations) {
            array.push([
              recommendations[req.doctors[i]._id.toString()],
              req.doctors[i]
            ]);
          } else array.push([0, req.doctors[i]]);

          if (i == req.doctors.length - 1) callback(null, array);
        }
      }
      // Sort and return
    ],
    function (err, result) {
      result.sort(function (a, b) {
        return a[0] - b[0];
      });
      console.log('result ', result);
      return res.json(result);
    }
  );
};
