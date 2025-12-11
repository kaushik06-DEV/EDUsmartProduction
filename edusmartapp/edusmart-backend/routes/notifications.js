const express = require('express');
const Notification = require('../models/Notification');

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const doc = await Notification.create(req.body);
		res.status(201).json(doc);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

router.get('/', async (req, res) => {
	try {
		const { user } = req.query;
		const filter = user ? { user } : {};
		const items = await Notification.find(filter).sort({ createdAt: -1 });
		res.json(items);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

router.put('/:id/read', async (req, res) => {
	try {
		const item = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
		if (!item) return res.status(404).json({ error: 'Not found' });
		res.json(item);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const result = await Notification.findByIdAndDelete(req.params.id);
		if (!result) return res.status(404).json({ error: 'Not found' });
		res.status(204).send();
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

module.exports = router;
