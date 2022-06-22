const Review = require('../models/review');
const Doctor = require('../models/doctor');

//middleware
exports.getReviewById = (req, res, next, id) => {
  Review.findById(id).exec((err, revi) => {
    if (err) {
      return res.status(400).json({
        error: 'Review not found in DB'
      });
    }
    req.review = revi;
    next();
  });
};

//All methods goes here

//create
exports.createReview = async function (req, res) {
  var sumrating = 0;
  var length = 0;
  const review = new Review(req.body);
  review.doctorid = req.params.doctorId;
  review.userid = req.params.userId;

  try {
    await review.save();
  } catch (err) {
    return res.status(400).json({
      error: 'Not able to save review in DB'
    });
  }

  try {
    const doctor = await Doctor.findOne({ _id: req.params.doctorId });
    const count = await Review.countDocuments({
      doctorid: req.params.doctorId
    });
    doctor.sumRating += review.rating;
    doctor.rating = doctor.sumRating / count;
    await doctor.save();
  } catch (err) {
    return res.status(400).json(err);
  }
  res.json({ review });
};

//read
exports.getReview = (req, res) => {
  return res.json(req.review);
};

//getting all reviews
exports.getAllReviews = (req, res) => {
  Review.find().exec((err, reviews) => {
    if (err) {
      return res.status(400).json({
        error: 'NO reviews found'
      });
    }
    res.json(reviews);
  });
};

//getting reviews by userId
exports.getReviewsByUserId = (req, res) => {
  Review.find({ userid: req.params.userId }).exec((err, reviews) => {
    if (err) {
      return res.status(400).json({
        error: 'NO reviews found'
      });
    }
    res.json(reviews);
  });
};

//getting reviews by doctorId
exports.getReviewsByDoctorId = (req, res) => {
  Review.find({ doctorid: req.params.doctorId }).exec((err, reviews) => {
    if (err) {
      return res.status(400).json({
        error: 'NO reviews found'
      });
    }
    res.json(reviews);
  });
};

//update
exports.updateReview = (req, res) => {
  const review = req.review;
  review.comment = req.body.comment;

  review.save((err, updatedReview) => {
    if (err) {
      return res.status(400).json({
        error: 'Failed to update review'
      });
    }
    res.json(updatedReview);
  });
};

//delete
exports.removeReview = (req, res) => {
  const review = req.review;

  review.remove((err, review) => {
    if (err) {
      return res.status(400).json({
        error: 'Failed to delete this review'
      });
    }
    res.json({
      message: 'Review is Successfully deleted '
    });
  });
};
