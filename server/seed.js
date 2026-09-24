const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

dotenv.config();

const users = [
    { name: 'Admin', email: 'admin@eventora.com', password: 'password123', role: 'admin' },
    { name: 'Secondary Admin', email: 'admin2@eventora.com', password: 'password123', role: 'admin' },
    { name: 'Demo User', email: 'user@eventora.com', password: 'password123', role: 'user' },
    { name: 'Alice Smith', email: 'alice@eventora.com', password: 'password123', role: 'user' },
    { name: 'Bob Johnson', email: 'bob@eventora.com', password: 'password123', role: 'user' }
];

const events = [
    {
        title: 'Campus Battle of the Coders (Competitive Programming)',
        description: 'A fast-paced algorithmic coding competition on DSA, problem solving, dynamic programming, and math puzzles. Win cash prizes and direct placement referrals.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        location: 'Computer Science Lab 3 & 4',
        category: 'Coding Contest',
        totalSeats: 250,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Inter-Department Speed Coding & Debugging Clash',
        description: 'Time-bound live code debugging and speed programming showdown. Fix broken code snippets, optimize time complexity, and win the Golden Byte Trophy.',
        date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
        location: 'Tech Innovation Hub, Room 102',
        category: 'Coding Contest',
        totalSeats: 200,
        ticketPrice: 50,
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Annual Inter-College Hackathon 2026',
        description: 'A 24-hour non-stop coding hackathon where student teams from across universities compete for cash prizes, developer swag, and internship offers.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        location: 'Campus Tech Auditorium, Block B',
        category: 'Hackathon',
        totalSeats: 300,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Campus Cultural Fest & Battle of the Bands',
        description: 'The biggest annual college cultural fest featuring live music performances, dance competitions, fashion shows, and food pop-ups.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        location: 'University Open Air Amphitheatre',
        category: 'Cultural',
        totalSeats: 1000,
        ticketPrice: 250,
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Inter-University Esports Championship',
        description: 'Compete in Valorant, BGMI, and FIFA tournaments. Represent your college, climb the leaderboards, and win trophy & prize pools.',
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
        location: 'Student Activity Center, Gaming Lounge',
        category: 'Gaming',
        totalSeats: 200,
        ticketPrice: 150,
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'College Robotics & AI Innovation Expo',
        description: 'Showcase your autonomous bots, drone racing projects, and AI hardware prototypes. Open to all engineering and science undergraduates.',
        date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
        location: 'Engineering Block Hall 4',
        category: 'Tech',
        totalSeats: 400,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Annual College Sports Meet & Athletics Championship',
        description: 'Track and field, football, basketball, and badminton tournaments. Cheer for your department and win championship medals.',
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
        location: 'University Sports Complex & Stadium',
        category: 'Sports',
        totalSeats: 800,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Campus Musical Night & Unplugged Jamming',
        description: 'Live acoustic night, rock bands, vocal solos, and instrumentals organized by the College Music Society.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        location: 'Amphitheatre Lawn',
        category: 'Music',
        totalSeats: 500,
        ticketPrice: 50,
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Campus Fashion Runway & Style Contest',
        description: 'Student designers and campus models take the runway showcasing sustainable fashion, ethnic wear, and avant-garde themes.',
        date: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000), // 27 days from now
        location: 'Student Activity Main Hall',
        category: 'Fashion',
        totalSeats: 450,
        ticketPrice: 150,
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Web3 & AI Development Workshop',
        description: 'Hands-on interactive masterclass on building decentralized applications and integrating AI models using React & Node.',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        location: 'Seminar Hall B, IT Block',
        category: 'Workshop',
        totalSeats: 150,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Inter-College Hip-Hop & Street Dance Championship',
        description: 'High-octane Western hip-hop, classical solo, and inter-department group dance showdown on the big stage.',
        date: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000), // 19 days from now
        location: 'University Main Auditorium',
        category: 'Dance',
        totalSeats: 750,
        ticketPrice: 100,
        image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'National Parliamentary Debate & MUN Summit',
        description: 'Engage in fiery debates on geopolitics, economics, and social reform. Test your public speaking and parliamentary argumentation skills.',
        date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 16 days from now
        location: 'Conference Room 1',
        category: 'Debate',
        totalSeats: 250,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Inter-Department Street Play & Nukkad Natak (Drama Fest)',
        description: 'Expressive theatrical performances and street plays highlighting social issues, satire, and classic Indian drama scripts.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        location: 'Central Plaza Stage',
        category: 'Drama',
        totalSeats: 600,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=800'
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/eventora');
        console.log('\n✅ MongoDB connection open...');

        await User.deleteMany();
        await Event.deleteMany();
        await Booking.deleteMany();
        console.log('🗑️  Cleared existing data.');

        // Hash user passwords
        const salt = await bcrypt.genSalt(10);
        const hashedUsers = users.map(u => ({
            ...u,
            password: bcrypt.hashSync(u.password, salt),
            isVerified: true
        }));

        const createdUsers = await User.insertMany(hashedUsers);
        const adminUser = createdUsers.find(u => u.role === 'admin');
        console.log(`👤 Created ${createdUsers.length} total dummy users.`);

        // Link events to admin
        const eventsWithAdmin = events.map(e => ({
            ...e,
            availableSeats: e.totalSeats,
            createdBy: adminUser._id
        }));

        const createdEvents = await Event.insertMany(eventsWithAdmin);
        console.log(`🎉 Created ${createdEvents.length} distinct events with Unsplash images.`);
        console.log(`🎫 Bookings collection cleared (0 initial bookings). Real user bookings will appear live in Admin Dashboard.`);

        console.log('\n🚀 Database seeded successfully!');
        console.log('-------------------------------------------');
        console.log('Admin Email: admin@eventora.com');
        console.log('User Email:  user@eventora.com');
        console.log('Password for all users: password123');
        console.log('-------------------------------------------\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedDatabase();