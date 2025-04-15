// Payment details
const paymentAccounts = {
    easypaisa: {
        number: "+92XXXXXXXXXX",
        instructions: "Open the Easypaisa app > Select 'Send Money' > Enter the number > Confirm payment."
    },
    jazzcash: {
        number: "+92YYYYYYYYYY",
        instructions: "Open the JazzCash app > Select 'Send Money' > Enter the number > Confirm payment."
    }
};

let selectedPayment = "";

// Select payment method
function selectPayment(method) {
    selectedPayment = method;
    document.getElementById(method).checked = true;
}

// Open payment modal
function openModal() {
    if (!selectedPayment) return alert("Please select a payment method.");
    
    const paymentDetails = paymentAccounts[selectedPayment];

    document.getElementById("adminNumber").innerHTML = `
        <strong>Admin Account:</strong> ${paymentDetails.number} (${selectedPayment.toUpperCase()})<br><br>
        <strong>How to Pay:</strong> ${paymentDetails.instructions}
    `;

    document.getElementById("paymentModal").style.display = "block";
    document.getElementById("modalOverlay").style.display = "block";
}

// Close modal
function closeModal() {
    document.getElementById("paymentModal").style.display = "none";
    document.getElementById("modalOverlay").style.display = "none";
}

// Confirm payment
function confirmPayment() {
    if (!document.getElementById("paymentScreenshot").files.length) {
        return alert("Please upload a payment screenshot.");
    }
    alert("Payment screenshot uploaded! Await verification.");
    closeModal();
}
