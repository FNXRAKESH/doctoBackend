const User = require('../models/user');
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//Authentication Methods for signup and signin

//signup
exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: 'NOT able to save user in DB'
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      id: user._id
    });
  });
};

//signin
exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { mobile, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  User.findOne({ mobile }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "USER mobile doesn't exist"
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Mobile Number and Password do not match'
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie('token', token, { expire: new Date() + 9999, httpOnly: false });

    //send response to front end
    const { _id, name, email, role, mobile } = user;
    return res.json({ token, user: { _id, name, email, role, mobile } });
  });
};

//signout
exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    message: 'User Signout Successfully !'
  });
};

//protected routes

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: 'auth'
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  console.log('Auth ', req.profile, ' ', req.auth);
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).res.json({
      error: 'ACCESS DENIED'
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'You are not an Admin, ACCESS DENIED'
    });
  }
  next();
};
