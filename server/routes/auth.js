const express = require('express');
//import express Router
const router = express.Router();
const {registerUser , loginUser , verifyOtp} = require('../controllers/authControllers');
//For Resitration 

router.post('/register' , registerUser);
router.post('/login' ,loginUser);
router.post('/verify-otp' ,verifyOtp);

module.exports = router;