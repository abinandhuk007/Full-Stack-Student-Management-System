const pool = require('./db');

async function updateDB() {
  try {
    console.log('Adding columns to users table...');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10);');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;');
    
    console.log('Adding columns to students table...');
    await pool.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10);');
    await pool.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS phone VARCHAR(20);');
    await pool.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS address TEXT;');

    console.log('Inserting sample teacher...');
    await pool.query(`
      INSERT INTO users (name, email, password, role, blood_group, phone, address) 
      VALUES ('Admin Teacher', 'teacher@gmail.com', '1234', 'teacher', 'O+', '9876543210', 'Chennai')
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log('Inserting sample student into users...');
    await pool.query(`
      INSERT INTO users (name, email, password, role, blood_group, phone, address) 
      VALUES ('Abinandh', 'student@gmail.com', '1234', 'student', 'B+', '9123456780', 'Tiruppur')
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log('Inserting sample student into students table...');
    await pool.query(`
      INSERT INTO students (name, email, class_name, roll_no, blood_group, phone, address) 
      VALUES ('Abinandh', 'student@gmail.com', '10A', '12', 'B+', '9123456780', 'Tiruppur')
    `);

    console.log('Database updated successfully.');
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    pool.end();
  }
}

updateDB();
