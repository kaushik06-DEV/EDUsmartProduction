const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema(
	{
		sessionId: { type: String, index: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		role: { type: String, enum: ['user', 'model'], required: true },
		text: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
