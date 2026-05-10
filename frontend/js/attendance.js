document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('userRole');
    if (role !== 'teacher') {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('attendanceDate').valueAsDate = new Date();

    loadStudents();
});
let attendanceData = [];

async function loadStudents() {
    try {
        const teacher_id = localStorage.getItem('teacher_id') || localStorage.getItem('userId');
        const res = await fetch(`${API_BASE_URL}/students/teacher/${teacher_id}`);
        const students = await res.json();
        
        const tbody = document.getElementById('attendanceTableBody');
        tbody.innerHTML = '';
        attendanceData = students.map(s => ({ student_id: s.id, status: null }));

        students.forEach(s => {
            tbody.innerHTML += `
                <tr>
                    <td>${s.roll_no}</td>
                    <td>${s.name}</td>
                    <td>
                        <button class="btn-present" id="btn-present-${s.id}" onclick="markPresent(${s.id})">Present</button>
                        <button class="btn-absent" id="btn-absent-${s.id}" onclick="markAbsent(${s.id})">Absent</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) { 
        console.error('Error loading students:', error); 
    }
}

function updateButtons(studentId, status) {
    const presentBtn = document.getElementById(`btn-present-${studentId}`);
    const absentBtn = document.getElementById(`btn-absent-${studentId}`);
    
    if (status === 'Present') {
        presentBtn.classList.add('selected');
        absentBtn.classList.remove('selected');
    } else if (status === 'Absent') {
        absentBtn.classList.add('selected');
        presentBtn.classList.remove('selected');
    }
}

function markPresent(studentId) {
    const record = attendanceData.find(a => a.student_id === studentId);
    if (record) {
        record.status = 'Present';
        updateButtons(studentId, 'Present');
    }
}

function markAbsent(studentId) {
    const record = attendanceData.find(a => a.student_id === studentId);
    if (record) {
        record.status = 'Absent';
        updateButtons(studentId, 'Absent');
    }
}

function markAllPresent() {
    attendanceData.forEach(record => {
        record.status = 'Present';
        updateButtons(record.student_id, 'Present');
    });
}

function markAllAbsent() {
    attendanceData.forEach(record => {
        record.status = 'Absent';
        updateButtons(record.student_id, 'Absent');
    });
}

async function submitAttendance() {
    const teacher_id = localStorage.getItem('teacher_id') || localStorage.getItem('userId');
    const class_name = localStorage.getItem('userClassName') || '';
    const date = document.getElementById('attendanceDate').value;
    const subject = 'Daily';

    if (!date) {
        alert('Please enter a Date.');
        return;
    }
    const unselected = attendanceData.filter(a => a.status === null);
    if (unselected.length > 0) {
        alert(`Please mark attendance for all students. (${unselected.length} remaining)`);
        return;
    }

    const payload = {
        teacher_id,
        class_name,
        subject,
        date,
        attendance: attendanceData
    };

    try {
        const res = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('Attendance submitted successfully!');
            attendanceData.forEach(a => {
                a.status = null;
                document.getElementById(`btn-present-${a.student_id}`).classList.remove('selected');
                document.getElementById(`btn-absent-${a.student_id}`).classList.remove('selected');
            });
        } else {
            alert('Failed to submit attendance.');
        }
    } catch (error) {
        console.error('Error submitting attendance:', error);
        alert('An error occurred.');
    }
}
