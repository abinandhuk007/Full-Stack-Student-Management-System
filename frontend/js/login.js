document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password, role })
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.setItem('userRole', data.user.role);
                    localStorage.setItem('userEmail', data.user.email);
                    localStorage.setItem('userId', data.user.id);
                    localStorage.setItem('teacher_id', data.user.id);
                    localStorage.setItem('userName', data.user.name);
                    localStorage.setItem('userClassName', data.user.class_name || '');
                    if (data.user.role === 'teacher') {
                        window.location.href = 'teacher-dashboard.html';
                    } else if (data.user.role === 'student') {
                        window.location.href = 'student-dashboard.html';
                    }
                } else {
                    alert('Login failed: ' + data.message);
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred during login.');
            }
        });
    }
});
