const ReferDoctor = require("../models/referDoctor");

//middleware
exports.getReferDoctorById = (req, res, next, id) => {
  ReferDoctor.findById(id).exec((err, referD) => {
    if (err) {
      return res.status(400).json({
        error: "Refer Doctor profile not found in DB",
      });
    }
    req.referDoctor = referD;
    next();
  });
};

//create
exports.createReferDoctor = (req, res) => {
  const referDoctor = new ReferDoctor(req.body);
  referDoctor.save((err, referDoctor) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to refer Doctor",
      });
    }
    res.json(referDoctor);
  });
};

//read
exports.getReferDoctor = (req, res) => {
  ReferDoctor.find().exec((err, referDoc) => {
    if (err) {
      return res.status(400).json(err);
    }
    return res.json(referDoc);
  });
};
