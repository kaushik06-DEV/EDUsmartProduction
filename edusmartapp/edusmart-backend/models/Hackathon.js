const mongoose = require('mongoose');

const HackathonSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		location: { type: String },
		mode: { type: String, enum: ['online', 'offline', 'hybrid'], default: 'online' },
		organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		prizes: [{ type: String }],
		participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Hackathon', HackathonSchema);
