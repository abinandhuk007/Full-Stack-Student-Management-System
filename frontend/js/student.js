document.addEventListener('DOMContentLoaded', () => {
    checkAccess('student');

    const userEmail = localStorage.getItem('userEmail');
    let studentId = null;

    async function fetchStudentDetails() {
        try {
            const res = await fetch(`${API_BASE_URL}/students/email/${userEmail}`);
            if (res.ok) {
                const student = await res.json();
                studentId = student.id;
                
                const nameEl = document.getElementById('studentName');
                if (nameEl) nameEl.textContent = student.name;

                if (document.getElementById('studentLargeName')) {
                    document.getElementById('studentLargeName').textContent = student.name;
                    document.getElementById('studentLargeClass').textContent = student.class_name;
                    document.getElementById('studentLargeRoll').textContent = student.roll_no;
                    document.getElementById('studentLargeBloodGroup').textContent = student.blood_group || '--';
                    document.getElementById('studentLargePhone').textContent = student.phone || '--';
                    document.getElementById('studentLargeAddress').textContent = student.address || '--';
                    if (student.name) {
                        document.getElementById('studentLargeAvatar').textContent = student.name.substring(0, 2).toUpperCase();
                    }
                }

                loadPageData();
            }
        } catch (error) {
            console.error('Error fetching student details:', error);
        }
    }

    fetchStudentDetails();

    function loadPageData() {
        if (document.getElementById('attendanceTableBody')) {
            loadAttendance();
        } else if (document.getElementById('marksTableBody')) {
            loadMarks();
        } else if (document.getElementById('assignmentsTableBody')) {
            loadAssignments();
        } else if (document.getElementById('feesTableBody')) {
            loadFees();
        } else if (document.getElementById('announcementsContainer')) {
            loadAnnouncements();
        }
    }

    async function loadAttendance() {
        try {
            const res = await fetch(`${API_BASE_URL}/attendance/student/${studentId}`);
            const data = await res.json();
            const tbody = document.getElementById('attendanceTableBody');
            tbody.innerHTML = '';
            let total = data.length;
            let presentCount = 0;
            
            data.forEach(record => {
                if (record.status === 'Present') presentCount++;
                const date = new Date(record.date).toLocaleDateString();
                const statusClass = record.status === 'Present' ? 'badge-success' : 'badge-danger';
                tbody.innerHTML += `
                    <tr>
                        <td>${date}</td>
                        <td><span class="badge ${statusClass}">${record.status}</span></td>
                    </tr>
                `;
            });

            const percentageEl = document.getElementById('attendancePercentage');
            if (percentageEl) {
                if (total === 0) {
                    percentageEl.textContent = 'N/A';
                    percentageEl.style.color = '#7f8c8d';
                } else {
                    const percentage = Math.round((presentCount / total) * 100);
                    percentageEl.textContent = `${percentage}%`;
                    
                    if (percentage >= 75) {
                        percentageEl.style.color = '#2ecc71';
                    } else if (percentage >= 50) {
                        percentageEl.style.color = '#f1c40f';
                    } else {
                        percentageEl.style.color = '#e74c3c';
                    }
                }
            }
        } catch (error) {
            console.error('Error loading attendance:', error);
        }
    }

    async function loadMarks() {
        try {
            const res = await fetch(`${API_BASE_URL}/marks/student/${studentId}`);
            const data = await res.json();
            const tbody = document.getElementById('marksTableBody');
            tbody.innerHTML = '';
            data.forEach(record => {
                const avg = ((record.tamil + record.english + record.maths + record.cs + record.history) / 5).toFixed(2);
                const avgClass = avg >= 50 ? 'badge-success' : 'badge-danger';
                tbody.innerHTML += `
                    <tr><td><strong>Tamil</strong></td><td>${record.tamil}</td></tr>
                    <tr><td><strong>English</strong></td><td>${record.english}</td></tr>
                    <tr><td><strong>Maths</strong></td><td>${record.maths}</td></tr>
                    <tr><td><strong>Computer Science</strong></td><td>${record.cs}</td></tr>
                    <tr><td><strong>History</strong></td><td>${record.history}</td></tr>
                    <tr style="background-color: #f8f9fa;">
                        <td><strong>Average</strong></td>
                        <td><span class="badge ${avgClass}">${avg}</span></td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error('Error loading marks:', error);
        }
    }

    async function loadAssignments() {
        try {
            const res = await fetch(`${API_BASE_URL}/assignments`);
            const data = await res.json();
            const tbody = document.getElementById('assignmentsTableBody');
            tbody.innerHTML = '';
            data.forEach(record => {
                const date = new Date(record.due_date).toLocaleDateString();
                tbody.innerHTML += `
                    <tr>
                        <td>${record.title}</td>
                        <td>${record.subject}</td>
                        <td>${record.description}</td>
                        <td>${date}</td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error('Error loading assignments:', error);
        }
    }

    async function loadFees() {
        try {
            const res = await fetch(`${API_BASE_URL}/fees/student/${studentId}`);
            const data = await res.json();
            const tbody = document.getElementById('feesTableBody');
            tbody.innerHTML = '';
            
            let totalFeeSum = 0;
            let paidAmountSum = 0;

            data.forEach(record => {
                totalFeeSum += record.total_fee || 0;
                paidAmountSum += record.paid_amount || 0;

                const statusClass = record.status === 'Paid' ? 'badge-success' : (record.status === 'Partial' ? 'badge-warning' : 'badge-danger');
                tbody.innerHTML += `
                    <tr>
                        <td>Term Fee</td>
                        <td>₹${record.total_fee}</td>
                        <td>₹${record.paid_amount}</td>
                        <td><span class="badge ${statusClass}">${record.status}</span></td>
                    </tr>
                `;
            });

            const balanceSum = totalFeeSum - paidAmountSum;

            if (document.getElementById('summaryTotalFee')) {
                document.getElementById('summaryTotalFee').innerText = totalFeeSum;
            }
            if (document.getElementById('summaryPaidAmount')) {
                document.getElementById('summaryPaidAmount').innerText = paidAmountSum;
            }
            if (document.getElementById('summaryBalance')) {
                document.getElementById('summaryBalance').innerText = balanceSum;
            }
        } catch (error) {
            console.error('Error loading fees:', error);
        }
    }

    async function loadAnnouncements() {
        try {
            const res = await fetch(`${API_BASE_URL}/announcements`);
            const data = await res.json();
            const container = document.getElementById('announcementsContainer');
            container.innerHTML = '';
            data.forEach(record => {
                const date = new Date(record.date).toLocaleDateString();
                container.innerHTML += `
                    <div class="card" style="text-align: left; margin-bottom: 15px;">
                        <h3>${record.title} <span style="float:right; font-size: 12px;">${date}</span></h3>
                        <p style="font-size: 16px; font-weight: normal; color: #555;">${record.message}</p>
                    </div>
                `;
            });
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
    }
});
