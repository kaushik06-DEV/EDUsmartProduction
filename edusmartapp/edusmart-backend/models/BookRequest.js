const mongoose = require('mongoose');

const BookRequestSchema = new mongoose.Schema(
	{
		requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		title: { type: String, required: true },
		author: { type: String },
		reason: { type: String },
		status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('BookRequest', BookRequestSchema);
