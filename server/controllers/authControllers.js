const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/email');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

//Register User
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            if (user.isVerified) {
                return res.status(400).json({
                    message: 'User already exists and is verified. Please log in.',
                    error: 'User already exists and is verified. Please log in.'
                });
            } else {
                // User exists but was NEVER verified with OTP.
                // Delete old unverified user & OTPs to perform a completely fresh sign-up.
                await User.deleteOne({ _id: user._id });
                await OTP.deleteMany({ email, action: 'account_verification' });
            }
        }

        // Fresh User Registration
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            isVerified: false
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`OTP for ${email}: ${otp}`);

        await OTP.create({ email, otp, action: 'account_verification' });
        
        // Dispatch email asynchronously without blocking the user response
        sendOTPEmail(email, otp, 'account_verification').catch(err => {
            console.error('Background OTP email send error:', err);
        });

        res.status(201).json({
            message: 'User registered successfully. Please check your email for OTP to verify your account.',
            email: user.email
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Registration failed',
            error: error.message || 'Registration failed'
        });
    }
};

//login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials. Please Sign Up.',
                error: 'Invalid credentials. Please Sign Up.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials',
                error: 'Invalid credentials'
            });
        }

        if (!user.isVerified && user.role === 'user') {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            await OTP.deleteMany({ email, action: 'account_verification' });//Remove old otps
            await OTP.create({ email, otp, action: 'account_verification' });
            
            // Dispatch email asynchronously without blocking the response
            sendOTPEmail(email, otp, 'account_verification').catch(err => {
                console.error('Background OTP email send error:', err);
            });

            return res.status(400).json({
                needsVerification: true,
                message: 'Account not verified. A new OTP has been sent to your email.',
                error: 'Account not verified. A new OTP has been sent to your email.'
            });
        }

        res.json({
            message: 'Login successful',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Login failed',
            error: error.message || 'Login failed'
        });
    }
};

//verfy otp
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await OTP.findOne({ email, otp, action: 'account_verification' });

        if (!otpRecord) {
            return res.status(400).json({
                message: 'Invalid or expired OTP',
                error: 'Invalid or expired OTP'
            });
        }

        const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
                error: 'User not found'
            });
        }

        await OTP.deleteMany({ email, action: 'account_verification' });//remove used Otps

        res.json({
            message: 'Account verified successfully. You can now log in.',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || 'OTP verification failed',
            error: error.message || 'OTP verification failed'
        });
    }
};