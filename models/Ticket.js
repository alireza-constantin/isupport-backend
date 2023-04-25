const mongoose = require('mongoose');

const TicketSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		title: {
			type: String,
			required: [true, 'please enter a title'],
			minLength: [5, 'title can not be less than 5 character'],
		},
		product: {
			type: String,
			required: [true, 'please select a product'],
			enum: ['iphone 13 pro max', 'iphone 13 pro', 'iphone 13', 'ipad pro', 'ipad air', 'mac book pro', 'mac book air'],
		},
		description: {
			type: String,
			required: [true, 'please enter a description'],
			minLength: [5, 'description can not be less than 20 character'],
		},
		isClosed: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Ticket', TicketSchema);
