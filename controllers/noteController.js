const asynHandler = require('express-async-handler');

const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Note = require('../models/Note');

// @desc    Get All Ticket Notes
// @route   GET /api/tickets/:ticketId/notes
// @access  Private
const getNotes = asynHandler(async (req, res) => {
	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(401);
		throw new Error('Not Authorized');
	}

	const ticket = await Ticket.findById(req.params.ticketId);

	if (!ticket) {
		res.status(404);
		throw new Error('Ticket Not Found');
	}

	if (!user.isStaff) {
		if (ticket.user.toString() !== req.user.id.toString()) {
			res.status(401);
			throw new Error('Not Authorized');
		}
	}

	const notes = await Note.find({ ticket: req.params.ticketId });

	res.status(200).json(notes);
});

// @desc    Get All Ticket Notes
// @route   GET /api/tickets/:ticketId/notes
// @access  Private
const createNote = asynHandler(async (req, res) => {
	const { text } = req.body;

	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(401);
		throw new Error('Not Authorized');
	}

	const ticket = await Ticket.findById(req.params.ticketId);

	if (!ticket) {
		res.status(404);
		throw new Error('Ticket Not Found');
	}

	if (!user.isStaff) {
		if (ticket.user.toString() !== req.user.id.toString()) {
			res.status(401);
			throw new Error('Not Authorized');
		}
	}

	const note = await Note.create({
		user: user.id,
		ticket: ticket.id,
		text,
		isStaff: user.isStaff,
	});

	res.status(200).json(note);
});

module.exports = {
	getNotes,
	createNote,
};
