const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const axios = require('axios');
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

        // 1. Brevo API (Sends to ANY email address over HTTPS without custom domain!)
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

        // 2. Resend API
        if (resend) {
            const { data, error } = await resend.emails.send({
                from: 'Eventora <onboarding@resend.dev>',
                to: userEmail,
                subject: title,
                html: html
            });
            if (error) {
                console.error(`[RESEND ERROR] Failed to send booking email to ${userEmail}:`, error);
            } else {
                console.log(`[RESEND SUCCESS] Booking email sent to ${userEmail}:`, data);
            }
            return;
        }

        // 3. Nodemailer Gmail (Localhost)
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: html
        });
        console.log('[NODEMAILER] Email sent successfully to', userEmail);
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
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h2 style="color: #111;">${title}</h2>
                <p style="color: #555; font-size: 16px;">${msg}</p>
                <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                    ${otp}
                </div>
                <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
            </div>
        `;

        // 1. Brevo API (Sends to ANY email address over HTTPS without requiring custom domain)
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

        // 2. Resend API
        if (resend) {
            const { data, error } = await resend.emails.send({
                from: 'Eventora <onboarding@resend.dev>',
                to: userEmail,
                subject: `${title} - Code: ${otp}`,
                html: html
            });
            if (error) {
                console.error(`[RESEND ERROR] Failed to send OTP to ${userEmail}:`, error);
            } else {
                console.log(`[RESEND SUCCESS] OTP sent to ${userEmail} for ${type}:`, data);
            }
            return;
        }

        // 3. Nodemailer Gmail (Localhost)
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
