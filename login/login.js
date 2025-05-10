document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from refreshing

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    // Dummy users database (Replace with real backend logic later)
    let users = [
        { name: "Admin", email: "admin@example.com", password: "admin123", role: "admin" },
        { name: "User", email: "user@example.com", password: "user123", role: "consumer" }
    ];

    // Check if user exists
    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert(`Welcome, ${user.name}!`); // Display welcome message

        // Redirect based on role
        if (user.role === "admin") {
            window.location.href = "../admin_dashboard/admin_dashboard.html";
        } else {
            window.location.href = "../consumer_dashboard.html";
        }
    } else {
        document.getElementById("error-msg").innerText = "Invalid email or password!";
    }
}); 