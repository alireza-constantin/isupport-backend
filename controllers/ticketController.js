const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');

// @desc    Get All Tickets
// @route   GET /api/tickets
// @access  Private
const getAllTickets = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);
	if (!user) {
		res.status(401);
		throw new Error('Not Authorized');
	}

	const tickets = await Ticket.find({ user: req.user.id });

	res.status(200).json(tickets);
});

// @desc    Create Ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
	const { title, product, description } = req.body;
	const user = await User.findById(req.user.id);
	if (!user) {
		res.status(401);
		throw new Error('Not Authorized');
	}

	const ticket = await Ticket.create({
		title,
		product,
		description,
		user: req.user.id,
	});

	res.status(201).json(ticket);
});

// @desc    Get A Ticket
// @route   GET /api/tickets/:ticketId
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);
	if (!user) {
		res.status(401);
		throw new Error('Not Authorized');
	}

	const ticket = await Ticket.findById(req.params.ticketId);

	if (!ticket) {
		res.status(404);
		throw new Error('Could not find the ticket');
	}

	if (ticket.user.toString() !== req.user.id.toString()) {
		res.status(401);
		throw new Error('Not Authorized');
	}

	res.status(200).json(ticket);
});

// @desc    Delete A Ticket
// @route   DELETE /api/tickets/:ticketId
// @access  Private
const deleteTicket = asyncHandler(async (req, res) => {
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

	if (ticket.user.toString() !== req.user.id.toString()) {
		res.status(401);
		throw new Error('Not Authorized');
	}

	// delete notes related to ticket
	await Note.deleteMany({ ticket: req.params.ticketId });

	await ticket.remove();

	res.status(200).json({ ok: true });
});

// @desc    Update Ticket Status
// @route   Patch /api/tickets/:ticketId
// @access  Private
const updateTicketStatus = asyncHandler(async (req, res) => {
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

	if (ticket.user.toString() !== req.user.id.toString()) {
		res.status(401);
		throw new Error('Not Authorized');
	}

	const updatedTicket = await Ticket.findByIdAndUpdate(req.params.ticketId, { isClosed: true }, { new: true });

	res.status(200).json(updatedTicket);
});

module.exports = {
	getAllTickets,
	createTicket,
	getTicket,
	deleteTicket,
	updateTicketStatus,
};
