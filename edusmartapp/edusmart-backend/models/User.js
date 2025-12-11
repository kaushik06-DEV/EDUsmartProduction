const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, unique: true, index: true },
		passwordHash: { type: String, required: true },
		role: { type: String, enum: ['student', 'tutor', 'admin'], required: true },
		rollNumber: { type: String, unique: true, sparse: true },
		profile: {
			avatarUrl: { type: String },
			bio: { type: String },
			phone: { type: String, unique: true, sparse: true },
			location: { type: String },
		},
		status: { type: String, enum: ['active', 'disabled'], default: 'active' },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
