const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { Resend } = require('resend');

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

        if (resend) {
            await resend.emails.send({
                from: 'Eventora <onboarding@resend.dev>',
                to: userEmail,
                subject: title,
                html: html
            });
            console.log(`[RESEND] Booking confirmation email sent to ${userEmail}`);
            return;
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: html
        });
        console.log('Email sent successfully to', userEmail);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title = type === 'account_verification' ? 'Verify your Eventora Account' : 'Eventora Booking Verification';
        const msg = type === 'account_verification'
            ? 'Please use the following OTP to verify your new Eventora account.'
            : 'Please use the following OTP to verify and confirm your event booking.';

        const html = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h2 style="color: #111;">${title}</h2>
                <p style="color: #555; font-size: 16px;">${msg}</p>
                <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                    ${otp}
                </div>
                <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
            </div>
        `;

        // 1. If RESEND_API_KEY is configured (Uses HTTPS port 443 - works on Render Free Tier!)
        if (resend) {
            await resend.emails.send({
                from: 'Eventora <onboarding@resend.dev>',
                to: userEmail,
                subject: `${title} - Code: ${otp}`,
                html: html
            });
            console.log(`[RESEND HTTP] OTP sent to ${userEmail} for ${type}`);
            return;
        }

        // 2. Otherwise use Nodemailer with Gmail (Localhost)
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: html
        };
        await transporter.sendMail(mailOptions);
        console.log(`[NODEMAILER] OTP sent to ${userEmail} for ${type}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };
