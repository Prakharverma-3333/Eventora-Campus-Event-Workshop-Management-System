const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
});

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        console.log(`[EMAIL] Sending booking confirmation to ${userEmail}...`);
        const mailOptions = {
            from: `"Eventora" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            text: `Hi ${userName}! Your booking for the event "${eventTitle}" is successfully confirmed. Thank you for choosing Eventora.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4f46e5;">Hi ${userName}!</h2>
                    <p style="font-size: 16px;">Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
                    <p style="color: #666;">Thank you for choosing Eventora.</p>
                </div>
            `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SUCCESS] Booking email sent to ${userEmail}: ${info.response}`);
    } catch (error) {
        console.error(`[EMAIL ERROR] Error sending booking email to ${userEmail}:`, error.message);
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        console.log(`[EMAIL] Attempting to send OTP email to ${userEmail} for ${type}...`);
        const title = type === 'account_verification' ? 'Verify your Eventora Account' : 'Eventora Booking Verification';
        const msg = type === 'account_verification'
            ? 'Please use the following OTP to verify your new Eventora account.'
            : 'Please use the following OTP to verify and confirm your event booking.';

        const mailOptions = {
            from: `"Eventora" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `${title} - Code: ${otp}`,
            text: `${msg}\n\nYour OTP Code is: ${otp}\n\nThis code expires in 5 minutes. If you did not request this, please ignore this email.`,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; background-color: #f9fafb; border-radius: 12px; max-width: 480px; margin: 0 auto; border: 1px solid #e5e7eb;">
                    <h2 style="color: #111827; margin-bottom: 8px;">${title}</h2>
                    <p style="color: #4b5563; font-size: 15px; margin-bottom: 24px;">${msg}</p>
                    <div style="margin: 20px auto; padding: 16px 28px; font-size: 32px; font-weight: 800; background: #ffffff; width: max-content; letter-spacing: 6px; color: #4f46e5; border: 2px dashed #6366f1; border-radius: 8px;">
                        ${otp}
                    </div>
                    <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
                </div>
            `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SUCCESS] OTP email successfully delivered to ${userEmail} (${info.response})`);
    } catch (error) {
        console.error(`[EMAIL ERROR] Failed to send OTP to ${userEmail}:`, error.message);
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };
