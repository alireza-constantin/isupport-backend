const { sign } = require('jsonwebtoken');

const createAccessToken = (userId) => {
	return sign({ userId }, process.env.JWT_ACCESS_SECRET, {
		expiresIn: '1d',
	});
};

const createRefreshToken = (userId) => {
	return sign({ userId }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: '7d',
	});
};

module.exports = {
	createAccessToken,
	createRefreshToken,
};
