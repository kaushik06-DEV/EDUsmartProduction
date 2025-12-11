const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		category: { type: String },
		language: { type: String },
		code: { type: String },
		programId: { type: String },
		level: { type: Number, enum: [1, 2, 3, 4], default: 1 },
		lessons: [
			{
				title: { type: String, required: true },
				content: { type: String },
				durationMinutes: { type: Number },
			}
		],
		materials: [
			{
				title: { type: String, required: true },
				type: { type: String, enum: ['PDF', 'VIDEO', 'LINK', 'DOC'], required: true },
				url: { type: String },
				_createdAt: { type: Date, default: Date.now },
			}
		],
		published: { type: Boolean, default: false },
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
