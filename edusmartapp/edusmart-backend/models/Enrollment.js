const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema(
	{
		lessonId: { type: Number, required: true },
		completed: { type: Boolean, default: false },
		completedAt: { type: Date },
		score: { type: Number },
	},
	{ _id: false }
);

const EnrollmentSchema = new mongoose.Schema(
	{
		student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
		progress: [ProgressSchema],
		status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
		startedAt: { type: Date, default: Date.now },
		completedAt: { type: Date },
	},
	{ timestamps: true }
);

EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
