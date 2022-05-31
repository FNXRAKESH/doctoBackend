const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 50,
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      required: true
    },
    contact: {
      type: Number,
      required: true
    },
    location: {
      type: [Number],
      index: '2dsphere'
    },
    expertise: {
      type: String
    },
    speciality: {
      type: String,
      trim: true,
      required: true
    },
    recommendation: {
      type: ObjectId,
      ref: 'User'
    },
    experience: {
      type: String
    },
    recognition: {
      type: String
    },
    degree: {
      type: String
    },
    rating: {
      type: Number,
      default: 0
    },
    sumRating: {
      type: Number,
      default: 0
    },
    photoUrl: {
      type: String
    },
    hospitals: {
      type: Array,
      default: []
    },
    address: {
      type: String,
      trim: true,
      maxlength: 5000 
    },
    locatedAt: {
      type: String,
      trim: true,
      maxlength: 5000 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
