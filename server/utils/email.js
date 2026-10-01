const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        const title = `Booking Confirmed: ${eventTitle}`;
        const html = `
            <h2>Hi ${userName}!</h2>
            <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
            <p>Thank you for choosing Eventora.</p>
        `;

        // 1. Brevo API (For Render - works over HTTPS to ANY email address)
        if (process.env.BREVO_API_KEY) {
            const senderEmail = process.env.EMAIL_USER || 'prakharv824@gmail.com';
            const response = await axios.post(
                'https://api.brevo.com/v3/smtp/email',
                {
                    sender: { name: 'Eventora', email: senderEmail },
                    to: [{ email: userEmail }],
                    subject: title,
                    htmlContent: html
                },
                {
                    headers: {
                        'api-key': process.env.BREVO_API_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log(`[BREVO SUCCESS] Booking email sent to ${userEmail}:`, response.data);
            return;
        }

        // 2. Nodemailer with Gmail (Localhost)
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: html
        });
        console.log('[NODEMAILER] Booking email sent to', userEmail);
    } catch (error) {
        console.error('Error sending booking email:', error.response?.data || error.message);
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title = type === 'account_verification' ? 'Verify your Eventora Account' : 'Eventora Booking Verification';
        const msg = type === 'account_verification'
            ? 'Please use the following OTP to verify your new Eventora account.'
            : 'Please use the following OTP to verify and confirm your event booking.';

        const html = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 25px; background: #fdfdfd; border-radius: 12px; border: 1px solid #e0e0e0; max-width: 480px; margin: 0 auto;">
                <h2 style="color: #1a1a1a; margin-bottom: 8px;">${title}</h2>
                <p style="color: #555; font-size: 15px; margin-bottom: 20px;">${msg}</p>
                <div style="margin: 20px auto; padding: 15px 30px; font-size: 28px; font-weight: bold; background: #f4f6f8; width: max-content; letter-spacing: 6px; color: #2563eb; border-radius: 8px;">
                    ${otp}
                </div>
                <p style="color: #888; font-size: 12px; margin-top: 20px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
            </div>
        `;

        // 1. Brevo API (For Render - works over HTTPS to ANY email address)
        if (process.env.BREVO_API_KEY) {
            const senderEmail = process.env.EMAIL_USER || 'prakharv824@gmail.com';
            const response = await axios.post(
                'https://api.brevo.com/v3/smtp/email',
                {
                    sender: { name: 'Eventora', email: senderEmail },
                    to: [{ email: userEmail }],
                    subject: `${title} - Code: ${otp}`,
                    htmlContent: html
                },
                {
                    headers: {
                        'api-key': process.env.BREVO_API_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log(`[BREVO SUCCESS] OTP sent to ${userEmail} for ${type}:`, response.data);
            return;
        }

        // 2. Nodemailer with Gmail (Localhost)
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: html
        };
        await transporter.sendMail(mailOptions);
        console.log(`[NODEMAILER] OTP sent to ${userEmail} for ${type}`);
    } catch (error) {
        console.error('Error sending OTP email:', error.response?.data || error.message);
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };
