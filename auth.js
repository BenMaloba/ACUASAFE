document.addEventListener('DOMContentLoaded', function() {
    // Show/hide kiosk info fields based on user type selection
    const userTypeSelect = document.getElementById('user-type');
    const kioskInfoDiv = document.getElementById('kiosk-info');
    
    if (userTypeSelect && kioskInfoDiv) {
        userTypeSelect.addEventListener('change', function() {
            if (this.value === 'kiosk-admin') {
                kioskInfoDiv.classList.remove('hidden');
                // Make kiosk fields required
                document.getElementById('kiosk-name').required = true;
                document.getElementById('kiosk-location').required = true;
                document.getElementById('kiosk-license').required = true;
            } else {
                kioskInfoDiv.classList.add('hidden');
                // Remove required from kiosk fields
                document.getElementById('kiosk-name').required = false;
                document.getElementById('kiosk-location').required = false;
                document.getElementById('kiosk-license').required = false;
            }
        });
    }

    // Handle registration form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const userType = document.getElementById('user-type').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Prepare user data
            const userData = {
                name,
                email,
                phone,
                address,
                password,
                userType
            };
            
            // Add kiosk data if registering as kiosk admin
            if (userType === 'kiosk-admin') {
                userData.kioskName = document.getElementById('kiosk-name').value;
                userData.kioskLocation = document.getElementById('kiosk-location').value;
                userData.kioskLicense = document.getElementById('kiosk-license').value;
            }
            
            // Save to localStorage (in a real app, this would be an API call)
            const users = JSON.parse(localStorage.getItem('acuasafe-users')) || [];
            const existingUser = users.find(user => user.email === email);
            
            if (existingUser) {
                alert('User with this email already exists!');
                return;
            }
            
            users.push(userData);
            localStorage.setItem('acuasafe-users', JSON.stringify(users));
            
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const userType = document.getElementById('user-type').value;
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('acuasafe-users')) || [];
            const user = users.find(u => u.email === email && u.password === password && u.userType === userType);
            
            if (user) {
                // Save current user to session
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect based on user type
                if (userType === 'customer') {
                    window.location.href = '../user/dashboard.html';
                } else if (userType === 'kiosk-admin') {
                    window.location.href = '../admin/dashboard.html';
                } else if (userType === 'super-admin') {
                    window.location.href = '../admin/dashboard.html';
                }
            } else {
                alert('Invalid credentials or user type!');
            }
        });
    }
    const adminUser = {
  name: "Admin User",
  email: "admin@acuasafe.com",
  phone: "1234567890",
  address: "Admin Address",
  password: "admin123",
  userType: "super-admin",
  kiosk: null
};

let users = JSON.parse(localStorage.getItem('acuasafe-users')) || [];
users.push(adminUser);
localStorage.setItem('acuasafe-users', JSON.stringify(users));

});