const express = require('express');
const Enrollment = require('../models/Enrollment');

const router = express.Router();

// Enroll a student to a course
router.post('/', async (req, res) => {
	try {
		const enrollment = await Enrollment.create(req.body);
		res.status(201).json(enrollment);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// List enrollments
router.get('/', async (_req, res) => {
	try {
		const enrollments = await Enrollment.find().populate('student').populate('course').sort({ createdAt: -1 });
		res.json(enrollments);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get enrollment by id
router.get('/:id', async (req, res) => {
	try {
		const enrollment = await Enrollment.findById(req.params.id).populate('student').populate('course');
		if (!enrollment) return res.status(404).json({ error: 'Not found' });
		res.json(enrollment);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Update progress for a lesson (upsert by lessonId)
router.put('/:id/progress', async (req, res) => {
	try {
		const { lessonId, completed, score } = req.body;
		if (lessonId === undefined) return res.status(400).json({ error: 'lessonId required' });

		const enrollment = await Enrollment.findById(req.params.id);
		if (!enrollment) return res.status(404).json({ error: 'Not found' });

		const existing = enrollment.progress.find((p) => p.lessonId === lessonId);
		if (existing) {
			existing.completed = completed ?? existing.completed;
			existing.score = score ?? existing.score;
			existing.completedAt = existing.completed ? new Date() : existing.completedAt;
		} else {
			enrollment.progress.push({ lessonId, completed: !!completed, score, completedAt: completed ? new Date() : undefined });
		}

		await enrollment.save();
		res.json(enrollment);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Delete enrollment
router.delete('/:id', async (req, res) => {
	try {
		const result = await Enrollment.findByIdAndDelete(req.params.id);
		if (!result) return res.status(404).json({ error: 'Not found' });
		res.status(204).send();
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
