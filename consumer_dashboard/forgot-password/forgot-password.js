document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    
    // Basic email validation (you can add more sophisticated checks here)
    if (email === "") {
        document.getElementById('error-msg').innerText = "Please enter your email.";
        return;
    }
    
    // Simulate sending a reset link
    // You would typically make an AJAX request here to send the email to the server.
    console.log("Password reset link sent to", email);
    
    // Display a success message or redirect user to another page (e.g., confirmation page)
    alert("Password reset link sent to your email.");
});
