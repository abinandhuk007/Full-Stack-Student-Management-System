const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/fees - Get all fees
router.get('/', async (req, res) => {
  try {
    const teacherId = req.query.teacher_id;
    let query = `
      SELECT f.id, f.student_id, s.name, s.roll_no, f.total_fee, f.paid_amount, f.status 
      FROM fees f
      JOIN students s ON f.student_id = s.id
    `;
    const queryParams = [];

    if (teacherId) {
      query += ' WHERE s.teacher_id = $1';
      queryParams.push(teacherId);
    }
    
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/fees/student/:studentId - Get fees for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await pool.query('SELECT * FROM fees WHERE student_id = $1', [studentId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/fees - Add fee record
router.post('/', async (req, res) => {
  try {
    const { student_id, total_fee, paid_amount, status } = req.body;
    const result = await pool.query(
      'INSERT INTO fees (student_id, total_fee, paid_amount, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [student_id, total_fee, paid_amount, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/fees/:id - Update fee record
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { paid_amount, status } = req.body;
    const result = await pool.query(
      'UPDATE fees SET paid_amount = $1, status = $2 WHERE id = $3 RETURNING *',
      [paid_amount, status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Fee record not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
