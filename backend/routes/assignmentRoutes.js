const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/assignments - Get all assignments
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assignments ORDER BY due_date ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/assignments - Add a new assignment
router.post('/', async (req, res) => {
  try {
    const { title, subject, description, due_date } = req.body;
    const result = await pool.query(
      'INSERT INTO assignments (title, subject, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, subject, description, due_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/assignments/:id - Delete an assignment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM assignments WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
