const express = require('express');
const Hackathon = require('../models/Hackathon');

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const hack = await Hackathon.create(req.body);
		res.status(201).json(hack);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

router.get('/', async (_req, res) => {
	try {
		const hacks = await Hackathon.find().sort({ startDate: -1 });
		res.json(hacks);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const hack = await Hackathon.findById(req.params.id);
		if (!hack) return res.status(404).json({ error: 'Not found' });
		res.json(hack);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

router.put('/:id', async (req, res) => {
	try {
		const hack = await Hackathon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
		if (!hack) return res.status(404).json({ error: 'Not found' });
		res.json(hack);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const result = await Hackathon.findByIdAndDelete(req.params.id);
		if (!result) return res.status(404).json({ error: 'Not found' });
		res.status(204).send();
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

module.exports = router;
