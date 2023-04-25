const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { compare } = require('bcryptjs');
const crypto = require('crypto');
const { createAccessToken, createRefreshToken } = require('../utils/createToken');

// @desc    Create User
// @route   POST /api/user/register
// @access  Public
const createUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const user = await User.create({ name, email, password });
	res.cookie('jid', createRefreshToken(user._id), {
		httpOnly: true,
	});
	res.status(201).json({ ok: true });
});


// @desc    login
// @route   POST /api/user/login
// @access  Public
const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400);
		throw new Error('Please provide valid email and password');
	}

	const user = await User.findOne({ email });
	if (!user) {
		res.status(401);
		throw new Error('Invalid credentials');
	}

	if (!user.isConfirmed) {
		res.status(401);
		throw new Error('Please confrim your email');
	}

	const valid = await compare(password, user.password);

	if (!valid) {
		res.status(401);
		throw new Error('Invalid credentials');
	}

	res.cookie('jid', createRefreshToken(user._id), {
		httpOnly: true,
	});

	res.status(200).json({
		user: { name: user.name, email: user.email, isConfirmed: user.isConfirmed, isStaff: user.isStaff },
		accessToken: createAccessToken(user._id),
	});
});

// @desc    login
// @route   GET /api/user/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);
	if (!user) {
		res.status(401);
		throw new Error('Not Authorized');
	}

	res.cookie('jid', '', { httpOnly: true });
	res.status(200).json({ ok: true });
});

// @desc    get user
// @route   GET /api/user/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);
	if (!user) {
		res.status(401);
		throw new Error('Not Autorized');
	}

	if (!user.isConfirmed) {
		res.status(401);
		throw new Error('Please confrim your email');
	}

	res.status(200).json({ name: user.name, email: user.email });
});

// @desc    forgot password
// @route   POST /api/user/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (!user) {
		res.status(401);
		throw new Error('There is no user with this email');
	}

	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	// confirmation email url
	const url = `${req.protocol}://${req.get('host')}/api/user/forgotPassword/${resetToken}`;

	sendMail(
		email,
		'Reset Password',
		'this email is for resseting your password if you are requested to reset your password please click on link below or if you not requested to reset your password please ignore this email',
		url
	);

	res.status(201).json({ ok: true });
});

// @desc    reset password
// @route   Put /api/user/forgotPassword/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
	const { password } = req.body;

	const resetToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

	const user = await User.findOne({ resetToken, restPaswordExpire: { $gt: Date.now() } });

	if (!user) {
		res.status(401);
		throw new Error('User not found');
	}

	// set new password and clear resetPaswordToken
	user.password = password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();

	res.status(201).json({ name: user.name, email: user.email });
});

module.exports = {
	createUser,
	confirmEmail,
	login,
	getMe,
	forgotPassword,
	resetPassword,
	logout,
};
