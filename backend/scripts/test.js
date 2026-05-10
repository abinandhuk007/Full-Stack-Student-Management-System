const pool = require('./backend/db');

async function test() {
  try {
    const query = `
      SELECT s.id as student_id, s.name, s.roll_no, 
             COALESCE(m.tamil, 0) as tamil, 
             COALESCE(m.english, 0) as english, 
             COALESCE(m.maths, 0) as maths, 
             COALESCE(m.cs, 0) as cs, 
             COALESCE(m.history, 0) as history
      FROM students s
      LEFT JOIN marks m ON s.id = m.student_id
      ORDER BY s.roll_no ASC
    `;
    const res = await pool.query(query);
    console.log(res.rows);
  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    pool.end();
  }
}
test();
