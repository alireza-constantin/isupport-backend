const express = require('express');
const dotenv = require('dotenv').config();
// const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectToDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const { verify } = require('jsonwebtoken');
const User = require('./models/User');
const { createAccessToken } = require('./utils/createToken');

// init the express object
const app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://isupport-frontend.vercel.app');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(morgan('dev'));

app.get('/', async (req, res) => {
	res.json({ msg: 'Hello from iSupport' })
})


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
