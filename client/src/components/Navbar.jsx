import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
    FaTicketAlt, 
    FaUserCircle, 
    FaUser, 
    FaUserShield, 
    FaSignOutAlt, 
    FaChevronDown,
    FaCalendarAlt
} from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-gray-900 text-white border-b border-gray-800 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-18">
                    
                    {/* Clean & Professional Brand Logo */}
                    <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white hover:opacity-95 transition">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm flex items-center justify-center">
                            <FaTicketAlt className="text-base" />
                        </div>
                        <span className="text-white font-extrabold text-xl">
                            Eventora
                        </span>
                    </Link>

                    {/* Right Side Navigation */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        
                        {/* Events Link */}
                        <Link 
                            to="/" 
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                                isActive('/') 
                                    ? 'text-white bg-gray-800 border border-gray-700' 
                                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                            }`}
                        >
                            <FaCalendarAlt className="text-xs text-gray-400" />
                            <span>Events</span>
                        </Link>

                        {/* Navigation Links for Logged-In User */}
                        {user && (
                            user.role === 'admin' ? (
                                <Link 
                                    to="/admin" 
                                    className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 border ${
                                        isActive('/admin') 
                                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm' 
                                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                                    }`}
                                >
                                    <FaUserShield className="text-xs" />
                                    <span>Admin Dashboard</span>
                                </Link>
                            ) : (
                                <Link 
                                    to="/dashboard" 
                                    className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 border ${
                                        isActive('/dashboard') 
                                            ? 'bg-indigo-600 text-white font-bold border-indigo-500 shadow-sm' 
                                            : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20'
                                    }`}
                                >
                                    <FaTicketAlt className="text-xs" />
                                    <span>My Bookings</span>
                                </Link>
                            )
                        )}

                        {/* Account & Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3.5 py-2 rounded-lg text-sm font-semibold border border-gray-700 transition cursor-pointer"
                            >
                                {user ? (
                                    user.role === 'admin' ? (
                                        <FaUserShield className="text-amber-400 text-sm" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center uppercase">
                                            {user.name.charAt(0)}
                                        </div>
                                    )
                                ) : (
                                    <FaUserCircle className="text-gray-300 text-base" />
                                )}

                                <span className="max-w-[120px] truncate">
                                    {user ? user.name : 'Account'}
                                </span>
                                <FaChevronDown className={`text-xs text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Clean Normal Contrast Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 text-gray-800">
                                    {user ? (
                                        <>
                                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
                                                <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>

                                            <div className="pt-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                                                >
                                                    <FaSignOutAlt className="text-xs" />
                                                    <span>Log Out</span>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-1">
                                            <Link
                                                to="/login?role=user"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-semibold transition"
                                            >
                                                <FaUser className="text-indigo-600 text-base" />
                                                <div>
                                                    <div className="font-bold text-gray-900">User Login</div>
                                                    <div className="text-[11px] text-gray-500 font-normal">Browse & book events</div>
                                                </div>
                                            </Link>

                                            <Link
                                                to="/login?role=admin"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-semibold transition border-t border-gray-100"
                                            >
                                                <FaUserShield className="text-amber-600 text-base" />
                                                <div>
                                                    <div className="font-bold text-amber-900">Admin Portal</div>
                                                    <div className="text-[11px] text-gray-500 font-normal">Manage events & bookings</div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;