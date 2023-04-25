const express = require('express');
const { auth } = require('../middleware/auth');
const {
	getAllTickets,
	getTicket,
	createTicket,
	deleteTicket,
	updateTicketStatus,
} = require('../controllers/ticketController');
const noteRouter = require('./noteRoutes');

const router = express.Router();

// re route tickets to note routes
router.use('/:ticketId/notes', noteRouter);

router.route('/').get(auth, getAllTickets).post(auth, createTicket);
router.route('/:ticketId').get(auth, getTicket).delete(auth, deleteTicket).patch(auth, updateTicketStatus);

module.exports = router;
