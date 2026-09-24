const Event = require('../models/Event');

exports.getAllEvents = async (req, res) => {
    try {
        const filters = {};

        if (req.query.category) {
            filters.category = { $regex: req.query.category, $options: 'i' };
        }
        if (req.query.location) {
            filters.location = { $regex: req.query.location, $options: 'i' };
        }
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            filters.$or = [
                { title: searchRegex },
                { category: searchRegex },
                { location: searchRegex },
                { description: searchRegex }
            ];
        }

        const events = await Event.find(filters).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//By Admin
exports.createEvent = async (req, res) => {
    try {

        const { title, description, date, location, category, totalSeats, ticketPrice, image } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats: totalSeats,
            ticketPrice: ticketPrice || 0,
            image: image || '',
            createdBy: req.user.id
        });

        res.status(201).json(event);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

//By Admin
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!event) return res.status(404).json({ message: 'Event not found' });

        res.json(event);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

//By admin
exports.deleteEvent = async (req, res) => {
    try {

        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) return res.status(404).json({ message: 'Event not found' });

        res.json({ message: 'Event deleted successfully' });
    }

    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


