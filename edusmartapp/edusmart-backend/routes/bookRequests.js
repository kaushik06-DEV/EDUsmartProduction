const express = require('express');
const BookRequest = require('../models/BookRequest');

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const reqDoc = await BookRequest.create(req.body);
		res.status(201).json(reqDoc);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

router.get('/', async (_req, res) => {
	try {
		const items = await BookRequest.find().sort({ createdAt: -1 });
		res.json(items);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const item = await BookRequest.findById(req.params.id);
		if (!item) return res.status(404).json({ error: 'Not found' });
		res.json(item);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

router.put('/:id', async (req, res) => {
	try {
		const item = await BookRequest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
		if (!item) return res.status(404).json({ error: 'Not found' });
		res.json(item);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const result = await BookRequest.findByIdAndDelete(req.params.id);
		if (!result) return res.status(404).json({ error: 'Not found' });
		res.status(204).send();
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

module.exports = router;
