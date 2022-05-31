var mongoose = require("mongoose");

const referDoctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReferDoctor", referDoctorSchema);
