document.addEventListener('DOMContentLoaded', () => {
    checkAccess('teacher');
    if (document.getElementById('studentsTableBody')) {
        loadStudents();
    } else if (document.getElementById('attendanceTableBody')) {
        loadAttendance();
    } else if (document.getElementById('studentSelect') && window.location.pathname.includes('attendance-entry')) {
        populateStudentSelect();
    } else if (document.getElementById('marksTableBody')) {
        loadMarks();
    } else if (document.getElementById('studentSelect') && window.location.pathname.includes('marks-entry')) {
        populateStudentSelect();
    } else if (document.getElementById('assignmentsTableBody')) {
        loadAssignments();
    } else if (document.getElementById('feesTableBody')) {
        loadFees();
    } else if (document.getElementById('announcementsContainer')) {
        loadAnnouncements();
    }
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const roll_no = document.getElementById('roll_no').value;
            const teacher_id = localStorage.getItem('teacher_id') || localStorage.getItem('userId');

            try {
                const res = await fetch(`${API_BASE_URL}/students`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, roll_no, teacher_id })
                });
                if (res.ok) {
                    closeModal('studentModal');
                    loadStudents();
                } else {
                    const errData = await res.json();
                    alert('Error adding student: ' + (errData.message || 'Unknown error'));
                }
            } catch (error) {
                console.error(error);
            }
        });
    }

    const attendanceForm = document.getElementById('attendanceForm');
    if (attendanceForm) {
        attendanceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const student_id = document.getElementById('studentSelect').value;
            const subject = document.getElementById('subject').value;
            const date = document.getElementById('date').value;
            const status = document.getElementById('status').value;

            try {
                const res = await fetch(`${API_BASE_URL}/attendance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ student_id, subject, date, status })
                });
                if (res.ok) {
                    window.location.href = 'attendance.html';
                }
            } catch (error) { console.error(error); }
        });
    }

    const marksForm = document.getElementById('marksForm');
    if (marksForm) {
        marksForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const student_id = document.getElementById('studentSelect').value;
            const subject = document.getElementById('subject').value;
            const marks = document.getElementById('marks').value;
            const max_marks = document.getElementById('max_marks').value;

            try {
                const res = await fetch(`${API_BASE_URL}/marks`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ student_id, subject, marks, max_marks })
                });
                if (res.ok) {
                    window.location.href = 'marks.html';
                }
            } catch (error) { console.error(error); }
        });
    }

    const assignmentForm = document.getElementById('assignmentForm');
    if (assignmentForm) {
        assignmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const subject = document.getElementById('subject').value;
            const description = document.getElementById('description').value;
            const due_date = document.getElementById('due_date').value;

            try {
                const res = await fetch(`${API_BASE_URL}/assignments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, subject, description, due_date })
                });
                if (res.ok) {
                    closeModal('assignmentModal');
                    loadAssignments();
                }
            } catch (error) { console.error(error); }
        });
    }

    const announcementForm = document.getElementById('announcementForm');
    if (announcementForm) {
        announcementForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const message = document.getElementById('message').value;
            const date = new Date().toISOString().split('T')[0];

            try {
                const res = await fetch(`${API_BASE_URL}/announcements`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, message, date })
                });
                if (res.ok) {
                    closeModal('announcementModal');
                    loadAnnouncements();
                }
            } catch (error) { console.error(error); }
        });
    }
});
async function loadStudents() {
    try {
        const teacher_id = localStorage.getItem('teacher_id') || localStorage.getItem('userId');
        const res = await fetch(`${API_BASE_URL}/students/teacher/${teacher_id}`);
        const data = await res.json();
        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = '';
        data.forEach(s => {
            tbody.innerHTML += `
                <tr>
                    <td>${s.name}</td>
                    <td>${s.roll_no}</td>
                    <td>${s.class_name}</td>
                    <td>${s.email}</td>
                    <td>
                        <button class="action-btn delete-btn" onclick="deleteStudent(${s.id})">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) { console.error(error); }
}

async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            await fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE' });
            loadStudents();
        } catch (error) { console.error(error); }
    }
}

async function loadAttendance() {
    try {
        const teacher_id = localStorage.getItem('teacher_id') || localStorage.getItem('userId');
        const res = await fetch(`${API_BASE_URL}/attendance?teacher_id=${teacher_id}`);
        const data = await res.json();
        const tbody = document.getElementById('attendanceTableBody');
        tbody.innerHTML = '';
        data.forEach(a => {
            const date = new Date(a.date).toLocaleDateString();
            const statusClass = a.status === 'Present' ? 'badge-success' : 'badge-danger';
            tbody.innerHTML += `
                <tr>
                    <td>${a.name}</td>
                    <td>${a.roll_no}</td>
                    <td>${a.subject}</td>
                    <td>${date}</td>
                    <td><span class="badge ${statusClass}">${a.status}</span></td>
                </tr>
            `;
        });
    } catch (error) { console.error(error); }
}

async function loadMarks() {
    try {
        const teacher_id = localStorage.getItem('teacher_id') || localStorage.getItem('userId');
        const res = await fetch(`${API_BASE_URL}/marks?teacher_id=${teacher_id}`);
        const data = await res.json();
        const tbody = document.getElementById('marksTableBody');
        tbody.innerHTML = '';
        data.forEach(m => {
            tbody.innerHTML += `
                <tr>
                    <td>${m.name}</td>
                    <td>${m.roll_no}</td>
                    <td>${m.subject}</td>
                    <td>${m.marks} / ${m.max_marks}</td>
                </tr>
            `;
        });
    } catch (error) { console.error(error); }
}

async function populateStudentSelect() {
    try {
        const teacher_id = localStorage.getItem('teacher_id') || localStorage.getItem('userId');
        const res = await fetch(`${API_BASE_URL}/students/teacher/${teacher_id}`);
        const data = await res.json();
        const select = document.getElementById('studentSelect');
        select.innerHTML = '<option value="">Select Student</option>';
        data.forEach(s => {
            select.innerHTML += `<option value="${s.id}">${s.name} (${s.roll_no})</option>`;
        });
    } catch (error) { console.error(error); }
}

async function loadAssignments() {
    try {
        const res = await fetch(`${API_BASE_URL}/assignments`);
        const data = await res.json();
        const tbody = document.getElementById('assignmentsTableBody');
        tbody.innerHTML = '';
        data.forEach(a => {
            const date = new Date(a.due_date).toLocaleDateString();
            tbody.innerHTML += `
                <tr>
                    <td>${a.title}</td>
                    <td>${a.subject}</td>
                    <td>${date}</td>
                    <td>
                        <button class="action-btn delete-btn" onclick="deleteAssignment(${a.id})">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) { console.error(error); }
}

async function deleteAssignment(id) {
    if (confirm('Delete assignment?')) {
        await fetch(`${API_BASE_URL}/assignments/${id}`, { method: 'DELETE' });
        loadAssignments();
    }
}

async function loadFees() {
    try {
        const teacher_id = localStorage.getItem('teacher_id') || localStorage.getItem('userId');
        const res = await fetch(`${API_BASE_URL}/fees?teacher_id=${teacher_id}`);
        const data = await res.json();
        const tbody = document.getElementById('feesTableBody');
        tbody.innerHTML = '';

        let totalExpectedFee = 0;
        let totalCollectedFee = 0;

        data.forEach(f => {
            totalExpectedFee += f.total_fee || 0;
            totalCollectedFee += f.paid_amount || 0;

            const statusClass = f.status === 'Paid' ? 'badge-success' : (f.status === 'Partial' ? 'badge-warning' : 'badge-danger');
            tbody.innerHTML += `
                <tr>
                    <td>${f.name}</td>
                    <td>${f.roll_no}</td>
                    <td>₹${f.total_fee}</td>
                    <td>₹${f.paid_amount}</td>
                    <td><span class="badge ${statusClass}">${f.status}</span></td>
                </tr>
            `;
        });

        const outstandingBalance = totalExpectedFee - totalCollectedFee;

        if (document.getElementById('summaryTotalFee')) {
            document.getElementById('summaryTotalFee').innerText = totalExpectedFee;
        }
        if (document.getElementById('summaryPaidAmount')) {
            document.getElementById('summaryPaidAmount').innerText = totalCollectedFee;
        }
        if (document.getElementById('summaryBalance')) {
            document.getElementById('summaryBalance').innerText = outstandingBalance;
        }
    } catch (error) { console.error(error); }
}

async function loadAnnouncements() {
    try {
        const res = await fetch(`${API_BASE_URL}/announcements`);
        const data = await res.json();
        const container = document.getElementById('announcementsContainer');
        container.innerHTML = '';
        data.forEach(a => {
            const date = new Date(a.date).toLocaleDateString();
            container.innerHTML += `
                <div class="card" style="text-align: left; margin-bottom: 15px;">
                    <h3>${a.title} <span style="float:right; font-size: 12px;">${date}</span></h3>
                    <p style="font-size: 16px; font-weight: normal; color: #555;">${a.message}</p>
                    <button class="action-btn delete-btn" onclick="deleteAnnouncement(${a.id})" style="margin-top:10px;">Delete</button>
                </div>
            `;
        });
    } catch (error) { console.error(error); }
}

async function deleteAnnouncement(id) {
    if (confirm('Delete announcement?')) {
        await fetch(`${API_BASE_URL}/announcements/${id}`, { method: 'DELETE' });
        loadAnnouncements();
    }
}
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
