const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
      trim: true
    },
    user: {
      type: String,
    },
    doctor: {
      type: String,
    },
    photoUrl: {
      type: String
    },
    userid: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    doctorid: {
      type: ObjectId,
      ref: 'Doctor',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
