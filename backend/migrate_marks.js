const pool = require('./db');

async function migrateMarks() {
  try {
    console.log('Starting marks table migration...');

    // Drop the old table
    await pool.query('DROP TABLE IF EXISTS marks CASCADE;');

    // Create the new table
    await pool.query(`
      CREATE TABLE marks (
          id SERIAL PRIMARY KEY,
          student_id INT REFERENCES students(id) ON DELETE CASCADE,
          tamil INT DEFAULT 0,
          english INT DEFAULT 0,
          maths INT DEFAULT 0,
          cs INT DEFAULT 0,
          history INT DEFAULT 0
      );
    `);

    // Insert default mark records for all existing students
    console.log('Inserting default marks for existing students...');
    const studentsRes = await pool.query('SELECT id FROM students');
    const students = studentsRes.rows;
    for (const student of students) {
        await pool.query(
            'INSERT INTO marks (student_id, tamil, english, maths, cs, history) VALUES ($1, 0, 0, 0, 0, 0)',
            [student.id]
        );
    }

    console.log('Marks migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
}

migrateMarks();
