const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Create user
router.post('/', async (req, res) => {
	try {
		const user = await User.create(req.body);
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// List users
router.get('/', async (_req, res) => {
	try {
		const users = await User.find().sort({ createdAt: -1 });
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get user by id
router.get('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ error: 'Not found' });
		res.json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Update user
router.put('/:id', async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
		if (!user) return res.status(404).json({ error: 'Not found' });
		res.json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Delete user
router.delete('/:id', async (req, res) => {
	try {
		const result = await User.findByIdAndDelete(req.params.id);
		if (!result) return res.status(404).json({ error: 'Not found' });
		res.status(204).send();
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
