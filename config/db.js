const mongoose = require('mongoose');

const connectToDB = async () => {
	try {
		const db = await mongoose.connect(
			'mongodb+srv://alirezasoheili:ramos9248@dev.fabbprr.mongodb.net/?retryWrites=true&w=majority'
		);
		console.log(`MongoDB connected:  ${db.connection.host}`);
	} catch (error) {
		console.log(`Error: ${error.message}`);
		process.exit(1);
	}
};

module.exports = connectToDB;
