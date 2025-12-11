const express = require('express');
const UserSettings = require('../models/UserSettings');

const router = express.Router();

// Upsert settings for a user
router.put('/:userId', async (req, res) => {
	try {
		const { userId } = req.params;
		const settings = await UserSettings.findOneAndUpdate(
			{ user: userId },
			{ user: userId, ...req.body },
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		);
		res.json(settings);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

router.get('/:userId', async (req, res) => {
	try {
		const { userId } = req.params;
		const settings = await UserSettings.findOne({ user: userId });
		res.json(settings);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

module.exports = router;
