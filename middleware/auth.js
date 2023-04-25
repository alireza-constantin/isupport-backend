const asyncHandler = require('express-async-handler');
const { verify } = require('jsonwebtoken');
const User = require('../models/User');

const auth = asyncHandler(async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			token = req.headers.authorization.split(' ')[1];
			const decode = verify(token, process.env.JWT_ACCESS_SECRET);
			const user = await User.findById(decode.userId).select('-password');
			if (!user.isConfirmed) {
				res.status(401);
				throw new Error('Please confirm your email');
			}
			req.user = user;
			next();
		} catch (error) {
			res.status(401);
			throw new Error(error === 'Please confirm your email' ? 'Please confirm your email' : 'Not Authorized');
		}
	}

	if (!token) {
		res.status(401);
		throw new Error('Not Authorized');
	}
});

module.exports = { auth };
