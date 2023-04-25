const mongoose = require('mongoose');

const connectToDB = async () => {
	try {
		const db = await mongoose.connect(
			process.env.MONGO_URI
		);
		console.log(`MongoDB connected:  ${db.connection.host}`);
	} catch (error) {
		console.log(`Error: ${error.message}`);
		process.exit(1);
	}
};

module.exports = connectToDB;
