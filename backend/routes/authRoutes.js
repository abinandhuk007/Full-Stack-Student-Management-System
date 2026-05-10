const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2 AND role = $3',
      [email, password, role]
    );

    if (result.rows.length > 0) {
      // Login successful, return basic user info (no JWT)
      res.json({ success: true, user: { id: result.rows[0].id, name: result.rows[0].name, role: result.rows[0].role, email: result.rows[0].email, class_name: result.rows[0].class_name } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials or role mismatch' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
