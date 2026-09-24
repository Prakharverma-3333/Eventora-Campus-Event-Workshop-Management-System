import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/axios';

// Create a global authentication context
export const AuthContext = createContext();

// AuthProvider makes authentication data and functions
// available to all child components
export const AuthProvider = ({ children }) => {

    // Stores the currently logged-in user's information
    const [user, setUser] = useState(null);

    // Used to show loading while checking stored user information
    const [loading, setLoading] = useState(true);

    // Runs once when the application starts
    useEffect(() => {

        // Get previously saved user information from browser localStorage
        const userInfo = localStorage.getItem('userInfo');

        // If user information exists, convert JSON string back to object
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }

        // Finished checking localStorage
        setLoading(false);

    }, []);


    // ==================== LOGIN ====================
    const login = async (email, password) => {
        try {

            // Send login request to backend
            const { data } = await api.post('/auth/login', {
                email,
                password
            });

            // Store logged-in user in React state
            setUser(data);

            // Save complete user information in localStorage
            // JSON.stringify converts object into a string
            localStorage.setItem('userInfo', JSON.stringify(data));

            // Save JWT token separately in localStorage
            localStorage.setItem('token', data.token);

            // Return backend response
            return data;

        } catch (error) {

            // If login requires OTP verification,
            // return the verification-related response
            if (error.response?.data?.needsVerification) {
                throw error.response.data;
            }

            // Return backend error message or default message
            throw error.response?.data?.message || 'Login failed';
        }
    };


    // ==================== REGISTER ====================
    const register = async (name, email, password) => {
        try {

            // Send registration data to backend
            const { data } = await api.post('/auth/register', {
                name,
                email,
                password
            });

            // Return registration response
            // Example: { message, email }
            return data;

        } catch (error) {

            // Return backend error message
            throw error.response?.data?.message || error.response?.data?.error || 'Registration failed';
        }
    };


    // ==================== VERIFY OTP ====================
    const verifyOTP = async (email, otp) => {
        try {

            // Send email and OTP to backend for verification
            const { data } = await api.post('/auth/verify-otp', {
                email,
                otp
            });

            // Store verified user in React state
            setUser(data);

            // Save user information in localStorage
            localStorage.setItem('userInfo', JSON.stringify(data));

            // Save JWT token in localStorage
            localStorage.setItem('token', data.token);

            // Return verified user data
            return data;

        } catch (error) {

            // Return OTP verification error message
            throw error.response?.data?.message || error.response?.data?.error || 'OTP verification failed';
        }
    };


    // ==================== LOGOUT ====================
    const logout = () => {

        // Clear user from React state
        setUser(null);

        // Remove saved user information from localStorage
        localStorage.removeItem('userInfo');

        // Remove JWT token from localStorage
        localStorage.removeItem('token');
    };


    // Provide authentication data and functions
    // to all components inside AuthProvider
    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                verifyOTP,
                logout,
                loading
            }}
        >

            {/* Render children only after authentication check is complete */}
            {!loading && children}

        </AuthContext.Provider>
    );
};