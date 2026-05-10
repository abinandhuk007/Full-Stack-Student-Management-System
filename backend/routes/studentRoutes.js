const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/students - Get all students
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/students/email/:email - Get student by email (for student dashboard)
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await pool.query('SELECT * FROM students WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/students - Add a new student
router.post('/', async (req, res) => {
  try {
    const { name, email, roll_no, teacher_id } = req.body;

    // Fetch class_name for the teacher
    const teacherRes = await pool.query('SELECT class_name FROM users WHERE id = $1 AND role = $2', [teacher_id, 'teacher']);
    if (teacherRes.rows.length === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    const class_name = teacherRes.rows[0].class_name;

    const result = await pool.query(
      'INSERT INTO students (name, email, class_name, roll_no, teacher_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, class_name, roll_no, teacher_id]
    );

    const newStudent = result.rows[0];

    // Insert default fee record
    await pool.query(
      'INSERT INTO fees (student_id, total_fee, paid_amount, status) VALUES ($1, $2, $3, $4)',
      [newStudent.id, 7800, 0, 'Pending']
    );

    // Insert default marks record
    await pool.query(
      'INSERT INTO marks (student_id, tamil, english, maths, cs, history) VALUES ($1, 0, 0, 0, 0, 0)',
      [newStudent.id]
    );

    res.json(newStudent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/students/:id - Update student
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, class_name, roll_no } = req.body;
    const result = await pool.query(
      'UPDATE students SET name = $1, email = $2, class_name = $3, roll_no = $4 WHERE id = $5 RETURNING *',
      [name, email, class_name, roll_no, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Student not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/students/teacher/:teacherId - Get students for a specific teacher
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const result = await pool.query('SELECT * FROM students WHERE teacher_id = $1 ORDER BY id ASC', [teacherId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/students/:id - Delete student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // ON DELETE CASCADE handles related records in attendance, marks, fees
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
