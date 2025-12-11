const mongoose = require('mongoose');

async function connectToDatabase() {
	const mongoUri = process.env.MONGODB_URI;
	if (!mongoUri) {
		console.error('Missing MONGODB_URI in environment. Please set it in .env');
		process.exit(1);
	}

	if (process.env.MONGODB_DEBUG === 'true') {
		mongoose.set('debug', true);
	}

	try {
		await mongoose.connect(mongoUri, {
			autoIndex: true,
			serverSelectionTimeoutMS: 10000,
		});
		console.log('✅ Connected to MongoDB');

		mongoose.connection.on('error', (err) => {
			console.error('MongoDB connection error:', err);
		});
	} catch (error) {
		console.error('Failed to connect to MongoDB:', error);
		process.exit(1);
	}
}

module.exports = { connectToDatabase };
