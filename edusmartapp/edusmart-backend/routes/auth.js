const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

function signToken(payload) {
	const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
	return jwt.sign(payload, secret, { expiresIn: '7d' });
}

// Register (student default)
router.post('/register', async (req, res) => {
	try {
		const { name, email, password, role = 'student', rollNumber } = req.body;
		if (!name || !password) return res.status(400).json({ error: 'name and password required' });

		if (email) {
			const existingEmail = await User.findOne({ email });
			if (existingEmail) return res.status(409).json({ error: 'Email already registered' });
		}
		if (rollNumber) {
			const existingRoll = await User.findOne({ rollNumber });
			if (existingRoll) return res.status(409).json({ error: 'Roll number already registered' });
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, passwordHash, role, rollNumber });
		const token = signToken({ sub: user._id.toString(), role: user.role });
		res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, rollNumber: user.rollNumber } });
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

// Login (accepts identifier: email|rollNumber|phone in profile)
router.post('/login', async (req, res) => {
	try {
		const { identifier, password } = req.body;
		if (!identifier || !password) return res.status(400).json({ error: 'identifier and password required' });

		const user = await User.findOne({ $or: [ { email: identifier }, { rollNumber: identifier }, { 'profile.phone': identifier } ] });
		if (!user) return res.status(401).json({ error: 'Invalid credentials' });

		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

		const token = signToken({ sub: user._id.toString(), role: user.role });
		res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, rollNumber: user.rollNumber } });
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

module.exports = router;
