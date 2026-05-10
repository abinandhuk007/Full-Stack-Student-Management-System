document.addEventListener('DOMContentLoaded', async () => {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');

    if (!userEmail) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/profile?email=${encodeURIComponent(userEmail)}`);
        const result = await response.json();

        if (result.success) {
            const data = result.data;
            if (document.getElementById('teacherName')) document.getElementById('teacherName').innerText = data.name || '--';
            if (document.getElementById('teacherEmail')) document.getElementById('teacherEmail').innerText = data.email || '--';
            if (document.getElementById('teacherBloodGroup')) document.getElementById('teacherBloodGroup').innerText = data.blood_group || '--';
            if (document.getElementById('teacherPhone')) document.getElementById('teacherPhone').innerText = data.phone || '--';
            if (document.getElementById('teacherAddress')) document.getElementById('teacherAddress').innerText = data.address || '--';
            if (document.getElementById('teacherLargeName')) document.getElementById('teacherLargeName').innerText = data.name || '--';
            if (document.getElementById('teacherLargeEmail')) document.getElementById('teacherLargeEmail').innerText = data.email || '--';
            if (document.getElementById('teacherLargeBloodGroup')) document.getElementById('teacherLargeBloodGroup').innerText = data.blood_group || '--';
            if (document.getElementById('teacherLargePhone')) document.getElementById('teacherLargePhone').innerText = data.phone || '--';
            if (document.getElementById('teacherLargeAddress')) document.getElementById('teacherLargeAddress').innerText = data.address || '--';
            if (document.getElementById('teacherLargeAvatar') && data.name) {
                const initials = data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                document.getElementById('teacherLargeAvatar').innerText = initials || 'TA';
            }
            if (document.getElementById('studentProfileName')) document.getElementById('studentProfileName').innerText = data.name || '--';
            if (document.getElementById('studentClass')) document.getElementById('studentClass').innerText = data.class_name || '--';
            if (document.getElementById('studentRoll')) document.getElementById('studentRoll').innerText = data.roll_no || '--';
            if (document.getElementById('studentBloodGroup')) document.getElementById('studentBloodGroup').innerText = data.blood_group || '--';
            if (document.getElementById('studentPhone')) document.getElementById('studentPhone').innerText = data.phone || '--';
            if (document.getElementById('studentAddress')) document.getElementById('studentAddress').innerText = data.address || '--';
            if (document.getElementById('profileName')) document.getElementById('profileName').innerText = data.name || '--';
            if (document.getElementById('profileEmail')) document.getElementById('profileEmail').innerText = data.email || '--';
            if (document.getElementById('profileRole')) document.getElementById('profileRole').innerText = (data.role || '--').toUpperCase();
            if (document.getElementById('profileBloodGroup')) document.getElementById('profileBloodGroup').innerText = data.blood_group || '--';
            if (document.getElementById('profilePhone')) document.getElementById('profilePhone').innerText = data.phone || '--';
            if (document.getElementById('profileAddress')) document.getElementById('profileAddress').innerText = data.address || '--';
            if (document.getElementById('studentSpecificInfo')) {
                if (data.role === 'student') {
                    document.getElementById('studentSpecificInfo').style.display = 'block';
                    if (document.getElementById('profileClass')) document.getElementById('profileClass').innerText = data.class_name || '--';
                    if (document.getElementById('profileRoll')) document.getElementById('profileRoll').innerText = data.roll_no || '--';
                } else {
                    document.getElementById('studentSpecificInfo').style.display = 'none';
                }
            }

        } else {
            console.error('Failed to fetch profile:', result.message);
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
});
