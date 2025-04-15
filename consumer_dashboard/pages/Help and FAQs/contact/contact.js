// script.js
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting the traditional way

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;
    let responseMessage = document.getElementById("responseMessage");

    if (name && email && message) {
        responseMessage.style.color = "green";
        responseMessage.textContent = "Thank you, " + name + "! Your message has been sent successfully.";
    } else {
        responseMessage.style.color = "red";
        responseMessage.textContent = "Please fill in all fields.";
    }

    document.getElementById("contactForm").reset(); // Reset the form fields
});
