const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/attendance - Get all attendance records (with student details)
router.get('/', async (req, res) => {
  try {
    const teacherId = req.query.teacher_id;
    let query = `
      SELECT a.id, a.student_id, s.name, s.roll_no, a.subject, a.date, a.status 
      FROM attendance a
      JOIN students s ON a.student_id = s.id
    `;
    const queryParams = [];

    if (teacherId) {
      query += ' WHERE s.teacher_id = $1';
      queryParams.push(teacherId);
    }
    
    query += ' ORDER BY a.date DESC';
    
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/attendance/student/:studentId - Get attendance for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await pool.query('SELECT * FROM attendance WHERE student_id = $1 ORDER BY date DESC', [studentId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/attendance - Mark attendance
router.post('/', async (req, res) => {
  try {
    const { teacher_id, class_name, subject, date, attendance } = req.body;
    
    const promises = attendance.map(async a => {
      const check = await pool.query('SELECT id FROM attendance WHERE student_id = $1 AND date = $2', [a.student_id, date]);
      if (check.rows.length > 0) {
        return pool.query('UPDATE attendance SET status = $1 WHERE id = $2', [a.status, check.rows[0].id]);
      } else {
        return pool.query('INSERT INTO attendance (student_id, subject, date, status) VALUES ($1, $2, $3, $4)', [a.student_id, subject, date, a.status]);
      }
    });
    
    await Promise.all(promises);
    res.json({ message: 'Attendance marked successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
