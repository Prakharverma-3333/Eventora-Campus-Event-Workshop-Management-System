import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { 
    FaCalendarAlt, 
    FaMapMarkerAlt, 
    FaSearch, 
    FaRegClock, 
    FaTicketAlt, 
    FaShieldAlt,
    FaFilter,
    FaTimes,
    FaArrowRight,
    FaStar,
    FaFire,
    FaLaptopCode,
    FaMusic,
    FaTheaterMasks,
    FaGraduationCap,
    FaTrophy,
    FaMagic,
    FaGamepad,
    FaCode,
    FaUsers,
    FaMicrophone,
    FaFilm
} from 'react-icons/fa';

const CATEGORIES = [
    { name: 'All', icon: FaFire },
    { name: 'Coding Contest', icon: FaCode },
    { name: 'Cultural', icon: FaTheaterMasks },
    { name: 'Tech', icon: FaLaptopCode },
    { name: 'Music', icon: FaMusic },
    { name: 'Fashion', icon: FaMagic },
    { name: 'Workshop', icon: FaGraduationCap },
    { name: 'Sports', icon: FaTrophy },
    { name: 'Gaming', icon: FaGamepad },
    { name: 'Hackathon', icon: FaCode },
    { name: 'Dance', icon: FaUsers },
    { name: 'Debate', icon: FaMicrophone },
    { name: 'Drama', icon: FaFilm },
];

const Home = () => {
    const [events, setEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, [selectedCategory]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            let url = `/events?`;
            if (selectedCategory !== 'All') {
                url += `category=${encodeURIComponent(selectedCategory)}`;
            }
            const { data } = await api.get(url);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setSelectedCategory('All');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">
            
            {/* Clean & Professional Hero Section */}
            <div className="relative bg-gray-900 text-white rounded-2xl overflow-hidden mb-10 shadow-lg border border-gray-800">
                {/* Background Overlay */}
                <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/80 to-gray-900"></div>

                <div className="relative p-8 sm:p-12 md:p-16 text-center flex flex-col items-center z-10 max-w-4xl mx-auto">
                    
                    {/* Welcome Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 text-gray-200 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-5 border border-white/15">
                        <FaStar className="text-amber-400 text-xs" />
                        <span>Welcome to Eventora</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-5 leading-tight tracking-tight text-white">
                        Find Your Next <span className="text-gray-300">Unforgettable</span> Experience
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-8 max-w-xl mx-auto font-normal leading-relaxed">
                        Discover top campus fests, tech hackathons, coding contests, and workshops happening in your area.
                    </p>

                    {/* Direct Category Pill Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const isSelected = selectedCategory === cat.name;
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                                        isSelected 
                                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md' 
                                            : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border-slate-700/60 hover:text-white'
                                    }`}
                                >
                                    <Icon className={`text-xs ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                                    <span>{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* Integrated Feature Highlights Ribbon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                        <FaRegClock />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-0.5">OTP Verification</h3>
                        <p className="text-slate-500 text-xs leading-relaxed">Secure seat booking using one-time email OTP verification.</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                        <FaTicketAlt />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-0.5">My Bookings</h3>
                        <p className="text-slate-500 text-xs leading-relaxed">Track pending & confirmed requests or cancel anytime.</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                        <FaShieldAlt />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-0.5">Real-Time Seat Locking</h3>
                        <p className="text-slate-500 text-xs leading-relaxed">Automatic seat calculations on booking & cancellation.</p>
                    </div>
                </div>
            </div>

            {/* Events Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2.5">
                        <span>Upcoming Events</span>
                        <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2.5 py-0.5 rounded-md border border-gray-200 uppercase tracking-wider">
                            {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
                        </span>
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    {selectedCategory !== 'All' && (
                        <button
                            onClick={handleClearFilters}
                            className="text-xs font-bold text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition border border-gray-300 flex items-center gap-1 cursor-pointer"
                        >
                            <FaTimes className="text-xs" /> Reset Filter
                        </button>
                    )}
                    <div className="text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-2xs">
                        {events.length} {events.length === 1 ? 'Event' : 'Events'}
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
                    <div className="w-8 h-8 border-3 border-gray-900 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-gray-500 font-medium text-sm">Loading events...</p>
                </div>
            ) : events.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center border border-gray-200 shadow-xs flex flex-col items-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-xl mb-3">
                        <FaSearch />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Events Found</h3>
                    <p className="text-gray-500 text-xs mb-5 max-w-sm">We couldn't find any events in this category.</p>
                    <button
                        onClick={handleClearFilters}
                        className="bg-gray-900 hover:bg-black text-white font-bold px-5 py-2 rounded-lg transition text-xs cursor-pointer shadow-xs"
                    >
                        Show All Events
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => {
                        const seatsPercent = Math.min(100, Math.max(0, (event.availableSeats / event.totalSeats) * 100));
                        return (
                            <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-200 border border-gray-200 flex flex-col">
                                
                                {/* Event Image Banner */}
                                <div className="h-48 bg-gray-100 overflow-hidden relative">
                                    {event.image ? (
                                        <img 
                                            src={event.image} 
                                            alt={event.title} 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-lg">
                                            {event.category || 'Eventora'}
                                        </div>
                                    )}

                                    {/* Category Pill Tag */}
                                    <span className="absolute top-3 left-3 bg-black/75 text-white px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider">
                                        {event.category || 'General'}
                                    </span>

                                    {/* Ticket Price Badge */}
                                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-md text-xs font-bold shadow-sm border border-gray-200">
                                        {event.ticketPrice === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            <span className="text-gray-900">₹{event.ticketPrice}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Event Card Body */}
                                <div className="p-5 flex-grow flex flex-col">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                                        {event.title}
                                    </h3>

                                    <div className="flex flex-col gap-1.5 mb-5 text-gray-500 text-xs">
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-gray-400 text-xs shrink-0" />
                                            <span className="font-medium text-gray-700">
                                                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-gray-400 text-xs shrink-0" />
                                            <span className="font-medium text-gray-700 truncate">{event.location}</span>
                                        </div>
                                    </div>

                                    {/* Seats Availability Bar & Details Link */}
                                    <div className="mt-auto pt-3 border-t border-gray-100">
                                        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                                            <span className="text-gray-500">Available Seats</span>
                                            <span className={event.availableSeats > 0 ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>
                                                {event.availableSeats} / {event.totalSeats}
                                            </span>
                                        </div>

                                        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4 overflow-hidden">
                                            <div 
                                                className={`h-1.5 rounded-full ${
                                                    seatsPercent < 20 ? 'bg-red-500' : 'bg-gray-800'
                                                }`} 
                                                style={{ width: `${seatsPercent}%` }}
                                            ></div>
                                        </div>

                                        <Link 
                                            to={`/events/${event._id}`} 
                                            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-lg transition text-xs cursor-pointer shadow-xs"
                                        >
                                            <span>View Details</span>
                                            <FaArrowRight className="text-[10px]" />
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}

            {/* Footer Section */}
            <footer className="mt-16 pt-8 pb-6 border-t border-gray-200 text-center">
                <div className="flex justify-center items-center gap-2 mb-2">
                    <div className="bg-gray-900 text-white p-1.5 rounded-lg text-xs">
                        <FaTicketAlt />
                    </div>
                    <span className="text-lg font-bold text-gray-900 tracking-tight">Eventora</span>
                </div>
                <p className="text-gray-500 text-xs mb-4 max-w-sm mx-auto">
                    The simplest, most dynamic way to manage, discover, and host campus events and hackathons.
                </p>
                <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                    &copy; {new Date().getFullYear()} Eventora Platform. All rights reserved.
                </div>
            </footer>

        </div>
    );
};

export default Home;