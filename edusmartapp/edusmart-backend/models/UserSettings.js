const mongoose = require('mongoose');

const UserSettingsSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
		language: { type: String, default: 'en' },
		notificationsEnabled: { type: Boolean, default: true },
		darkMode: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('UserSettings', UserSettingsSchema);
