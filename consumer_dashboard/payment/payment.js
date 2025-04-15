document.addEventListener("DOMContentLoaded", function () {
    initializePayment();
});

function initializePayment() {
    let totalPrice = localStorage.getItem("totalPrice");

    if (!totalPrice) {
        console.warn("⚠ No total price found in localStorage. Setting default value.");
        totalPrice = 0; // Default value to avoid "null"
        localStorage.setItem("totalPrice", totalPrice); // Store it
    }

    totalPrice = parseFloat(totalPrice); // Convert to number
    let priceElement = document.getElementById("totalPrice");
    
    if (priceElement) {
        priceElement.innerText = `Total Price: Rs.${totalPrice}`;
    }
}


// ✅ Function to select a payment method (Improved UI effect)
function selectPayment(method) {
    let paymentInputs = document.querySelectorAll('input[name="payment"]');
    
    // Deselect all options before selecting the clicked one
    paymentInputs.forEach(input => input.checked = false);

    let selectedInput = document.getElementById(method);
    if (selectedInput) {
        selectedInput.checked = true;
    }
}

// ✅ Function to open the payment modal
function openModal() {
    let selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
        alert("Please select a payment method.");
        return;
    }

    let totalPrice = localStorage.getItem("totalPrice");
    if (!totalPrice) {
        alert("Total price not found! Please book again.");
        return;
    }

    totalPrice = parseFloat(totalPrice); // Ensure numeric conversion
    let adminNumber = selectedPayment.value === "easypaisa" ? "0345-XXXXXXX" : "0300-XXXXXXX";

    let priceElement = document.getElementById("modalTotalPrice");
    let adminElement = document.getElementById("adminNumberModal");

    if (!priceElement || !adminElement) {
        alert("Error: Payment details not found. Try again!");
        return;
    }

    priceElement.innerText = `Total Price: Rs.${totalPrice}`;
    adminElement.innerText = `Send payment to: ${adminNumber}`;

    document.getElementById("paymentModal").style.display = "block";
    document.getElementById("modalOverlay").style.display = "block";
}

// ✅ Function to close the modal
function closeModal() {
    document.getElementById("paymentModal").style.display = "none";
    document.getElementById("modalOverlay").style.display = "none";
}

// ✅ Function to confirm payment
function confirmPayment() {
    let screenshotInput = document.getElementById("paymentScreenshot");

    // Check if a file is uploaded
    if (screenshotInput.files.length === 0) {
        alert("Please upload the payment screenshot.");
        return;
    }

    // Validate file type (only image formats allowed)
    let file = screenshotInput.files[0];
    let allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
        alert("Invalid file format! Please upload a PNG or JPG image.");
        return;
    }

    alert("Payment confirmed! Redirecting to dashboard...");
    window.location.href = "../consumer_dashboard.html"; // Adjust if needed
}

