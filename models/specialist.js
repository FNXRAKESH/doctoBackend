const mongoose = require('mongoose');

const specialistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  } 
);

module.exports = mongoose.model('Specialist', specialistSchema);
