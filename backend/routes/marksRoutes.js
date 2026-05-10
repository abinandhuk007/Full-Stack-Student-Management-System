const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/marks - Get all marks
router.get('/', async (req, res) => {
  try {
    const teacherId = req.query.teacher_id;
    let query = `
      SELECT s.id as student_id, s.name, s.roll_no, 
             COALESCE(m.tamil, 0) as tamil, 
             COALESCE(m.english, 0) as english, 
             COALESCE(m.maths, 0) as maths, 
             COALESCE(m.cs, 0) as cs, 
             COALESCE(m.history, 0) as history
      FROM students s
      LEFT JOIN marks m ON s.id = m.student_id
    `;
    const queryParams = [];

    if (teacherId) {
      query += ' WHERE s.teacher_id = $1';
      queryParams.push(teacherId);
    }
    
    query += ' ORDER BY s.roll_no ASC';
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/marks/student/:studentId - Get marks for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await pool.query('SELECT * FROM marks WHERE student_id = $1', [studentId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/marks/:studentId - Update or create marks
router.put('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { tamil, english, maths, cs, history } = req.body;
    
    const checkRes = await pool.query('SELECT id FROM marks WHERE student_id = $1', [studentId]);
    
    if (checkRes.rows.length > 0) {
      const result = await pool.query(
        'UPDATE marks SET tamil=$1, english=$2, maths=$3, cs=$4, history=$5 WHERE student_id=$6 RETURNING *',
        [tamil || 0, english || 0, maths || 0, cs || 0, history || 0, studentId]
      );
      res.json(result.rows[0]);
    } else {
      const result = await pool.query(
        'INSERT INTO marks (student_id, tamil, english, maths, cs, history) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [studentId, tamil || 0, english || 0, maths || 0, cs || 0, history || 0]
      );
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
