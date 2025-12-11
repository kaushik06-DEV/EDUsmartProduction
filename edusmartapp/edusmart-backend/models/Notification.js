const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		title: { type: String, required: true },
		message: { type: String },
		read: { type: Boolean, default: false },
		link: { type: String },
		category: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
