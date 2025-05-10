let selectedPayment = null;

function selectPayment(method) {
    selectedPayment = method;
    document.getElementById("easypaisa").checked = method === "easypaisa";
    document.getElementById("jazzcash").checked = method === "jazzcash";

    const adminNumber = method === "easypaisa" 
        ? "0345-XXXXXXX (Easypaisa)" 
        : "0300-XXXXXXX (JazzCash)";
    
    document.getElementById("adminNumberMain").innerText = `Send payment to: ${adminNumber}`;
    document.getElementById("adminNumberModal").innerText = `Send payment to: ${adminNumber}`;
}

function openModal() {
    if (!selectedPayment) {
        alert("Please select a payment method.");
        return;
    }

    const bookingData = JSON.parse(localStorage.getItem("bookingData"));
    if (!bookingData) {
        alert("No booking data found.");
        return;
    }

    // Set modal content
    document.getElementById("modalBookingId").innerText = `Booking ID: ${bookingData.bookingId}`;
    document.getElementById("modalTotalPrice").innerText = `Total Price: Rs. ${bookingData.totalPrice}`;

    document.getElementById("modalOverlay").style.display = "block";
    document.getElementById("paymentModal").style.display = "block";

    // Enable checkout when file is selected
    const screenshotInput = document.getElementById("paymentScreenshot");
    screenshotInput.value = ""; // Reset input
    screenshotInput.onchange = function () {
        document.getElementById("checkoutBtn").disabled = !screenshotInput.files.length;
    };
}

function closeModal() {
    document.getElementById("modalOverlay").style.display = "none";
    document.getElementById("paymentModal").style.display = "none";
}

function confirmPayment() {
    const screenshotInput = document.getElementById("paymentScreenshot");
    if (!screenshotInput.files.length) {
        alert("Please upload a payment screenshot.");
        return;
    }

    alert("Payment submitted successfully. You will receive a confirmation shortly.");
    localStorage.removeItem("bookingData");
    window.location.href = "../consumer_dashboard.html";
}

function initializePaymentPage() {
    const bookingData = JSON.parse(localStorage.getItem("bookingData"));
    if (!bookingData) {
        document.getElementById("totalPrice").innerText = "No booking found.";
        return;
    }

    // Set booking ID and price
    document.getElementById("bookingId").value = bookingData.bookingId;
    document.getElementById("totalPrice").innerText = `Total Price: Rs. ${bookingData.totalPrice}`;
}

// Call initialize on page load
window.onload = initializePaymentPage;
