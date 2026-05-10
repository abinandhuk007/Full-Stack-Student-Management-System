document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('userRole');
    if (role !== 'teacher') {
        window.location.href = 'login.html';
        return;
    }

    loadMarksData();
});

let marksData = [];

async function loadMarksData() {
    try {
        const teacher_id = localStorage.getItem('teacher_id') || localStorage.getItem('userId');
        const res = await fetch(`${API_BASE_URL}/marks?teacher_id=${teacher_id}`);
        if (!res.ok) {
            const errText = await res.text();
            alert('Failed to load marks. Did you restart the Node.js backend server?\nError: ' + errText);
            return;
        }
        const data = await res.json();
        
        marksData = data;
        renderTable();
    } catch (error) { 
        console.error('Error loading marks data:', error); 
        alert('Error loading marks data. Please ensure your backend server is running and was restarted after the update.');
    }
}

function renderTable() {
    const tbody = document.getElementById('marksTableBody');
    tbody.innerHTML = '';
    
    marksData.forEach((student, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${student.roll_no}</td>
                <td>${student.name}</td>
                <td><input type="number" min="0" max="100" value="${student.tamil}" id="t_${index}" oninput="updateMark(${index}, 'tamil', this.value)"></td>
                <td><input type="number" min="0" max="100" value="${student.english}" id="e_${index}" oninput="updateMark(${index}, 'english', this.value)"></td>
                <td><input type="number" min="0" max="100" value="${student.maths}" id="m_${index}" oninput="updateMark(${index}, 'maths', this.value)"></td>
                <td><input type="number" min="0" max="100" value="${student.cs}" id="c_${index}" oninput="updateMark(${index}, 'cs', this.value)"></td>
                <td><input type="number" min="0" max="100" value="${student.history}" id="h_${index}" oninput="updateMark(${index}, 'history', this.value)"></td>
                <td id="avg_${index}">--</td>
            </tr>
        `;
        calculateAverage(index);
    });
}

function updateMark(index, subject, value) {
    let val = parseInt(value, 10);
    if (isNaN(val) || val < 0) val = 0;
    if (val > 100) val = 100;
    marksData[index][subject] = val;
    calculateAverage(index);
}

function calculateAverage(index) {
    const student = marksData[index];
    const avg = (student.tamil + student.english + student.maths + student.cs + student.history) / 5;
    const avgCell = document.getElementById(`avg_${index}`);
    
    avgCell.innerText = avg.toFixed(2);
    
    if (avg >= 50) {
        avgCell.className = 'avg-green';
    } else {
        avgCell.className = 'avg-red';
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

async function saveAllMarks() {
    try {
        const promises = marksData.map(student => {
            const payload = {
                tamil: student.tamil,
                english: student.english,
                maths: student.maths,
                cs: student.cs,
                history: student.history
            };
            return fetch(`${API_BASE_URL}/marks/${student.student_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        });
        
        await Promise.all(promises);
        showToast('Marks saved successfully!');
    } catch (error) {
        console.error('Error saving marks:', error);
        alert('An error occurred while saving marks.');
    }
}
