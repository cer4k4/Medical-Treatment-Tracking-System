const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../middleware/auth');
const { createUser, findByEmail } = require('../models/userModel');
const { hash, compare } = require('../utils/hash');

// Register (public)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email exists' });
    const hashed = await hash(password);
    const user = await createUser(name, email, hashed, 'user');
    res.json({ ok: true, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login (public)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: payload });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;