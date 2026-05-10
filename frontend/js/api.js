const API_BASE_URL = "http://localhost:3000/api";
function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    window.location.href = 'login.html';
}
function checkAccess(allowedRole) {
    const currentRole = localStorage.getItem('userRole');
    if (!currentRole || currentRole !== allowedRole) {
        window.location.href = 'login.html';
    }
}
