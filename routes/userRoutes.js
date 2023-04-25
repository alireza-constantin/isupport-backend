const express = require('express');
const router = express.Router();

const {
	createUser,
	confirmEmail,
	login,
	getMe,
	forgotPassword,
	resetPassword,
	logout,
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');

router.route('/register').post(createUser);
router.route('/forgotpassword').post(forgotPassword);
router.route('/forgotpassword/:resetToken').put(resetPassword);
router.route('/register/confirm-email/:userId').get(confirmEmail);
router.route('/login').post(login);
router.route('/logout').get(auth, logout);
router.route('/me').get(auth, getMe);

module.exports = router;
