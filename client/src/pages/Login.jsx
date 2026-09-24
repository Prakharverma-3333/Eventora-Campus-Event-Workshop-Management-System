import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { FaUser, FaUserShield } from 'react-icons/fa';

const Login = () => {
    const [searchParams] = useSearchParams();
    const isAdmin = searchParams.get('role') === 'admin';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } else {
                const data = await verifyOTP(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            if (err?.needsVerification) {
                setShowOTP(true);
                setError(err.message || 'Account not verified. A new OTP has been sent to your email.');
            } else {
                setError(typeof err === 'string' ? err : (err?.message || err?.error || 'Login failed'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-14 bg-white p-8 rounded-xl shadow-xl border border-gray-100">
            {/* Header Badge */}
            <div className="text-center mb-6">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
                    isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                }`}>
                    {isAdmin ? <FaUserShield className="text-amber-600 text-sm" /> : <FaUser className="text-indigo-600 text-sm" />}
                    <span>{isAdmin ? 'Admin Portal' : 'User Portal'}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                    {isAdmin ? 'Administrator Sign In' : 'User Sign In'}
                </h2>
                <p className="text-sm text-gray-500">
                    {isAdmin
                        ? 'Sign in to access admin management dashboard'
                        : 'Sign in to browse and book event tickets'}
                </p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center text-sm shadow-inner border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
                {!showOTP ? (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {isAdmin ? 'Admin Email Address' : 'Email Address'}
                            </label>
                            <input
                                type="email"
                                required
                                placeholder={isAdmin ? 'admin@eventora.com' : 'your.email@example.com'}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Code (OTP)</label>
                        <input
                            type="text"
                            required
                            placeholder="6-digit code"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm font-bold tracking-widest text-center text-lg"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                        />
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white font-bold py-3 rounded-lg focus:ring-4 transition shadow-md cursor-pointer ${
                        isAdmin
                            ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-200'
                            : 'bg-gray-900 hover:bg-black focus:ring-gray-200'
                    }`}
                >
                    {loading
                        ? 'Processing...'
                        : showOTP
                        ? 'Verify OTP & Log In'
                        : 'Sign In'}
                </button>
            </form>

            {!isAdmin && (
                <p className="text-center mt-6 text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link 
                        to="/register?role=user" 
                        className="text-gray-900 font-bold hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            )}
        </div>
    );
};

export default Login;