document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();
    let responseMessage = document.getElementById("responseMessage");

    if (name && email && message) {
        responseMessage.style.color = "green";
        responseMessage.textContent = "Thank you, " + name + "! Your message has been sent successfully.";
        this.reset(); // Only reset when fields are correctly filled
    } else {
        responseMessage.style.color = "red";
        responseMessage.textContent = "Please fill in all fields.";
    }
});
