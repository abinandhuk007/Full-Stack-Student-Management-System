const pool = require('./db');

async function runMigration() {
  try {
    console.log('Starting migration...');
    
    // 1. Add class_name to users
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS class_name VARCHAR(50);');
    // Set default class_name for existing teachers
    await pool.query("UPDATE users SET class_name = '10A' WHERE role = 'teacher' AND class_name IS NULL;");
    
    // 2. Add teacher_id to students
    await pool.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS teacher_id INT REFERENCES users(id);');
    // Assign existing students to the first teacher available (assuming id=1 is a teacher or id=4 Admin Teacher)
    // Actually, Admin Teacher is id=4 from previous seed. Let's find a teacher and assign.
    const teacherRes = await pool.query("SELECT id FROM users WHERE role = 'teacher' LIMIT 1");
    if (teacherRes.rows.length > 0) {
      const teacherId = teacherRes.rows[0].id;
      await pool.query('UPDATE students SET teacher_id = $1 WHERE teacher_id IS NULL', [teacherId]);
    }

    // 3. Drop existing foreign keys for attendance, marks, fees
    // We need to query the constraint names if they are auto-generated, but usually they are table_column_fkey
    const dropConstraint = async (table, constraint) => {
        try {
            await pool.query(`ALTER TABLE ${table} DROP CONSTRAINT ${constraint};`);
        } catch (e) {
            // Ignore if constraint doesn't exist
            console.log(`Constraint ${constraint} on ${table} might not exist or already dropped.`);
        }
    };

    await dropConstraint('attendance', 'attendance_student_id_fkey');
    await dropConstraint('marks', 'marks_student_id_fkey');
    await dropConstraint('fees', 'fees_student_id_fkey');

    // 4. Re-add foreign keys with ON DELETE CASCADE
    console.log('Adding ON DELETE CASCADE constraints...');
    await pool.query(`
        ALTER TABLE attendance 
        ADD CONSTRAINT attendance_student_id_fkey 
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;
    `);

    await pool.query(`
        ALTER TABLE marks 
        ADD CONSTRAINT marks_student_id_fkey 
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;
    `);

    await pool.query(`
        ALTER TABLE fees 
        ADD CONSTRAINT fees_student_id_fkey 
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;
    `);

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
}

runMigration();
