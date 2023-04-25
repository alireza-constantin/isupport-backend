const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserModel = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter a name'],
		},
		email: {
			type: String,
			required: [true, 'Please enter an email'],
			unique: [true, 'User already existed'],
			match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Please enter a valid email'],
		},
		password: {
			type: String,
			required: [true, 'Please enter a password'],
			minLength: [8, 'Password can not be less than 8 character'],
			match: [
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
				'Password must contain atleast 1 number, 1 upper case and 1 lower case',
			],
		},
		isConfirmed: {
			type: Boolean,
			default: false,
		},
		isStaff: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		restPaswordExpire: Date,
	},
	{
		timestamps: true,
	}
);

UserModel.pre('save', async function (next) {
	// check if user upadate other field hashing password does not run
	if (!this.isModified('password')) next();

	this.password = await bcrypt.hash(this.password, 8);
	next();
});

UserModel.methods.getResetPasswordToken = function () {
	// Generate token
	const resetToken = crypto.randomBytes(20).toString('hex');

	// hash token and set it to resetPassword field
	this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	// set 10 minutes expire date to resetPasswordExpire field
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model('User', UserModel);
