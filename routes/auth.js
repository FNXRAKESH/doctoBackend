var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const {signout, signup, signin, isSignedIn} = require("../controllers/auth");



//All routes goes here

//signup
router.post("/signup", [
    check("name", "name should be atleast 3 characters").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({ min: 3 }),
    check("mobile", "Mobile is required").isMobilePhone()
] ,signup);


//signin
router.post("/signin", [
    check("mobile", "mobile is required").isMobilePhone(),
    check("password", "password should be atleast 3 characters").isLength({ min: 1 })
] ,signin);


//signout
router.get("/signout", signout);


module.exports = router;