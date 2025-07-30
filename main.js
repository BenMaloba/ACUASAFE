document.addEventListener('DOMContentLoaded', function() {
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
    
    // Check if user is logged in and update navigation
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        // Find all login/register links and replace with logout
        document.querySelectorAll('nav ul li a[href="auth/login.html"], nav ul li a[href="auth/register.html"]').forEach(link => {
            link.parentElement.innerHTML = '<a href="#" id="logout">Logout</a>';
            
            // Add logout event listener
            document.getElementById('logout').addEventListener('click', function(e) {
                e.preventDefault();
                sessionStorage.removeItem('currentUser');
                window.location.reload();
            });
        });
    }
});