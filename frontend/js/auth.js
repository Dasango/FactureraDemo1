const loginForm = document.getElementById('loginForm');
const API_URL = 'http://localhost:8080/api/auth';

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const credentials = btoa(`${email}:${password}`);
        
        try {
            const response = await fetch(`${API_URL}/me`, {
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });

            if (response.ok) {
                // Store credentials for future requests (Simple/Insecure for demo)
                localStorage.setItem('auth', credentials);
                window.location.href = 'dashboard.html';
            } else {
                alert('Credenciales inválidas');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        }
    });
}

// Check if already logged in
function checkAuth() {
    const auth = localStorage.getItem('auth');
    if (!auth && !document.cookie.includes('JSESSIONID')) {
        // If not basic auth and not session (OAuth), maybe redirect
        // But for OAuth, we rely on the session cookie.
        // We can try to hit /me to see if we are logged in.
    }
}
