const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const { verify } = require('jsonwebtoken');
const User = require('./models/User');
const { createAccessToken } = require('./utils/createToken');

// init the express object
const app = express();

app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:3000',
	})
);
// express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// loggin the request in development environment
// if (process.env.NODE_ENV === 'dev') {
// 	app.use(moragn('dev'));
// }

app.post('/api/user/refresh-token', async (req, res) => {
	const token = req.cookies.jid;
	if (!token) {
		return res.status(401).json({ ok: false, accessToken: '' });
	}

	let payload;
	try {
		payload = verify(token, process.env.JWT_REFRESH_SECRET);
	} catch (error) {
		console.log(error);
		return res.status(401).json({ ok: false, accessToken: '' });
	}

	const user = await User.findById(payload.userId);
	if (!user) {
		return res.status(401).json({ ok: false, accessToken: '' });
	}

	res.status(200).json({
		user: { name: user.name, email: user.email, isConfirmed: user.isConfirmed, isStaff: user.isStaff },
		accessToken: createAccessToken(payload.userId),
	});
});

// routes
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

// error handler middleware
app.use(errorHandler);


// run the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}...`));

// Connect to database
connectToDB();
