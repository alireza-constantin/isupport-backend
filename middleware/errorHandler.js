const errorHandler = (err, req, res, next) => {
	let statusCode;
	let message;

	if (err.name === 'ValidationError') {
		statusCode = 400;
		// check to see it is duplicate cating field error for unique index email
	} else if (err.code === 11000) {
		statusCode = 400;
		message = 'User with this email already existed';
	}

	statusCode = statusCode || res.statusCode || 500;

	res.status(statusCode).json({
		msg: message || err.message || 'Server Error',
		stack: process.env.NODE_ENV === 'production' ? null : err.stack,
	});
};

module.exports = { errorHandler };
