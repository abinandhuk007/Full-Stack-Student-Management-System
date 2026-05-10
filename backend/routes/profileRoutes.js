const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/profile
router.get('/', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // First, find the user in the users table to get the role
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = userResult.rows[0];

    if (user.role === 'teacher') {
      // Return teacher details directly from the users table
      return res.json({
        success: true,
        data: {
          name: user.name,
          email: user.email,
          blood_group: user.blood_group,
          phone: user.phone,
          address: user.address,
          role: user.role
        }
      });
    } else if (user.role === 'student') {
      // For student, fetch additional details from the students table
      const studentResult = await pool.query('SELECT * FROM students WHERE email = $1', [email]);
      
      let studentData = {};
      if (studentResult.rows.length > 0) {
        studentData = studentResult.rows[0];
      }

      return res.json({
        success: true,
        data: {
          name: studentData.name || user.name,
          email: studentData.email || user.email,
          class_name: studentData.class_name,
          roll_no: studentData.roll_no,
          blood_group: studentData.blood_group || user.blood_group,
          phone: studentData.phone || user.phone,
          address: studentData.address || user.address,
          role: user.role
        }
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
