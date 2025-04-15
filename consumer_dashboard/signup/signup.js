document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validate form
    if (name === "" || email === "" || password === "" || confirmPassword === "") {
        alert("All fields are required!");
        return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Check password strength (optional: add more rules)
    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    // If everything is valid, you can proceed with form submission (or AJAX request)
    alert("Sign-up successful!");

    // Reset the form
    document.getElementById("signupForm").reset();
});
