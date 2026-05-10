const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/announcements - Get all announcements
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM announcements ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/announcements - Add an announcement
router.post('/', async (req, res) => {
  try {
    const { title, message, date } = req.body;
    const result = await pool.query(
      'INSERT INTO announcements (title, message, date) VALUES ($1, $2, $3) RETURNING *',
      [title, message, date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/announcements/:id - Delete an announcement
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM announcements WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Announcement not found' });
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
