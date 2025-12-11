const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema(
	{
		studentName: { type: String, required: true },
		courseTitle: { type: String, required: true },
		issueDate: { type: Date, required: true, default: Date.now },
		issuer: { type: String, required: true },
		credentialId: { type: String, required: true, unique: true },
		student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Certificate', CertificateSchema);
