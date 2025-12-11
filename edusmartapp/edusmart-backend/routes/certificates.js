const express = require('express');
const Certificate = require('../models/Certificate');

const router = express.Router();

// Create
router.post('/', async (req, res) => {
	try {
		const certificate = await Certificate.create(req.body);
		res.status(201).json(certificate);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Read all
router.get('/', async (_req, res) => {
	try {
		const certificates = await Certificate.find().sort({ createdAt: -1 });
		res.json(certificates);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Read one
router.get('/:id', async (req, res) => {
	try {
		const certificate = await Certificate.findById(req.params.id);
		if (!certificate) return res.status(404).json({ error: 'Not found' });
		res.json(certificate);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Update
router.put('/:id', async (req, res) => {
	try {
		const certificate = await Certificate.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);
		if (!certificate) return res.status(404).json({ error: 'Not found' });
		res.json(certificate);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Delete
router.delete('/:id', async (req, res) => {
	try {
		const result = await Certificate.findByIdAndDelete(req.params.id);
		if (!result) return res.status(404).json({ error: 'Not found' });
		res.status(204).send();
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
