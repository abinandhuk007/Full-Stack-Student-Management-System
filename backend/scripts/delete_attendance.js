const pool = require('./backend/db');

async function deleteAttendance() {
  try {
    console.log('Deleting all previous attendance records...');
    const result = await pool.query('DELETE FROM attendance');
    console.log(`Successfully deleted ${result.rowCount} records from the attendance table.`);
  } catch (err) {
    console.error('Error deleting attendance:', err);
  } finally {
    pool.end();
  }
}

deleteAttendance();
