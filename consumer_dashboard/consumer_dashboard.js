
document.addEventListener("DOMContentLoaded", function () {
    initializeApp();

    const bookingForm = document.getElementById('bookingFormDetails');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingFormSubmit);
    }

    // Navigation tabs
    document.getElementById("myBookingsTab")?.addEventListener("click", () => showContent("myBookings"));
    document.getElementById("checkSlotsTab")?.addEventListener("click", () => showContent("checkSlots"));
    document.getElementById("googleMapsTab")?.addEventListener("click", () => showContent("googleMaps"));
    document.getElementById("addWaitlistBtn")?.addEventListener("click", testAddToWaitlist);

});

function handleBookingFormSubmit(event) {
    event.preventDefault();
    const carModel = document.getElementById('carModel').value.trim();
    const bookingTimeInput = document.getElementById('bookingTime').value.trim();
    const bookingForm = document.getElementById('bookingFormDetails');
    const selectedSlot = bookingForm.dataset.slot || "Unknown Slot";

    if (!carModel || !bookingTimeInput) {
        alert("Please fill in all fields.");
        return;
    }

    let timeParts = bookingTimeInput.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
    if (!timeParts) {
        alert("Invalid time format. Please enter a valid time.");
        return;
    }

    let hours = parseInt(timeParts[1]);
    let minutes = parseInt(timeParts[2]);
    let ampm = timeParts[3];

    if (ampm) {
        if (ampm.toUpperCase() === "PM" && hours !== 12) hours += 12;
        else if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
    }

    const today = new Date();
    const selectedTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    const minBookingTime = new Date();
    minBookingTime.setMinutes(minBookingTime.getMinutes() + 30);

    if (selectedTime < minBookingTime) {
        alert("You must book at least 30 minutes in advance.");
        return;
    }

    let basePrice = 100, peakPrice = 150, specialEventSurcharge = 50, penaltyFee = 0;
    const hour = selectedTime.getHours();
    if (hour >= 17 && hour <= 21) basePrice = peakPrice;
    if ([5, 6].includes(today.getDay())) basePrice += specialEventSurcharge;

    const maxAllowedTime = new Date(selectedTime);
    maxAllowedTime.setHours(maxAllowedTime.getHours() + 3);
    const exitTime = new Date();
    if (exitTime > maxAllowedTime) penaltyFee = 200;

    const totalCost = basePrice + penaltyFee;
    localStorage.setItem("totalPrice", totalCost);

    alert(`Booking confirmed!\nSlot: ${selectedSlot}\nCar Model: ${carModel}\nTime: ${selectedTime.toLocaleTimeString()}\nTotal Cost: Rs. ${totalCost}`);
    showNotification(`Booking confirmed for Slot ${selectedSlot}. Total: Rs. ${totalCost}`);
    showContent('myBookings');
}

function bookParking(area, fee) {
    document.getElementById("bookingForm").style.display = "block";
    document.getElementById("carModel").value = '';
    document.getElementById("bookingTime").value = '';
}

function openBookingForm(slotId, fee) {
    showContent('bookingForm');
    const form = document.getElementById("bookingFormDetails");
    if (form) form.dataset.slot = slotId;
    bookParking(slotId, fee);
}

function initializeApp() {
    if (!document.querySelector('.content')) return;
    showContent('welcome');
    fetchWaitlist();
    fetchNotifications();
    fetchBookings();
}

function showContent(sectionId) {
    document.querySelectorAll('.content').forEach(section => {
        section.style.display = 'none';
    });

    const target = document.getElementById(sectionId);
    if (target) target.style.display = 'block';

    if (sectionId === 'myBookings') fetchBookings();
}

function fetchBookings() {
    showLoadingState();

    const bookings = [
        { id: "B001", parkingArea: "Basement Parking", carModel: "Toyota Corolla", slot: "A1", time: "10:00 AM - 11:00 AM", bookingDate: "2025-04-01", status: "Completed" },
        { id: "B002", parkingArea: "VIP Parking", carModel: "Honda Civic", slot: "B5", time: "2:00 PM - 3:00 PM", bookingDate: "2025-04-05", status: "Cancelled" },
        { id: "B003", parkingArea: "Open Area Parking", carModel: "BMW X5", slot: "C7", time: "4:00 PM - 5:00 PM", bookingDate: "2025-04-07", status: "Completed" }
    ];

    renderBookings(bookings);
}

function renderBookings(bookings) {
    const container = document.getElementById("bookingTableBody");
    if (!container) return;

    container.innerHTML = "";

    if (bookings.length === 0) {
        container.innerHTML = "<tr><td colspan='8'>No bookings found.</td></tr>";
        hideLoadingState();
        return;
    }

    bookings.forEach(b => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${b.id}</td>
            <td>${b.parkingArea}</td>
            <td>${b.carModel}</td>
            <td>${b.slot}</td>
            <td>${b.time}</td>
            <td>${b.bookingDate}</td>
            <td>${b.status}</td>
            <td>
                <button onclick="openBookingForm('${b.slot}', 100)">Book Again</button>
            </td>
        `;
        container.appendChild(row);
    });

    hideLoadingState();
}

function showLoadingState() {
    const loadingIndicator = document.getElementById("loadingIndicator");
    if (loadingIndicator) loadingIndicator.innerHTML = "<p>Loading...</p>";
}

function hideLoadingState() {
    const loadingIndicator = document.getElementById("loadingIndicator");
    if (loadingIndicator) loadingIndicator.innerHTML = "";
}

// Waitlist
let waitlist = [];

function fetchWaitlist() {
    waitlist = ["Ali", "Fatima"];
    updateWaitlistDisplay();
}

function addToWaitlist(userName) {
    userName = userName.trim();
    if (!userName) {
        alert("Please enter a valid name!");
        return;
    }
    waitlist.push(userName);
    updateWaitlistDisplay();
    showNotification(`${userName} added to the waitlist.`);
}

function removeFromWaitlist(index) {
    waitlist.splice(index, 1);
    updateWaitlistDisplay();
}

function updateWaitlistDisplay() {
    const waitlistSection = document.getElementById("waitlistdisplay");
    if (!waitlistSection) return;

    if (waitlist.length === 0) {
        waitlistSection.innerHTML = "<h2>Waitlist</h2><p>No users in the waitlist.</p>";
        return;
    }

    waitlistSection.innerHTML = `<h2>Waitlist</h2><table border="1">
        <tr><th>#</th><th>Name</th><th>Action</th></tr>` +
        waitlist.map((user, index) => 
            `<tr><td>${index + 1}</td><td>${user}</td>
            <td><button onclick="removeFromWaitlist(${index})">Remove</button></td></tr>`).join('') + "</table>";
}

function testAddToWaitlist() {
    const userName = document.getElementById("waitlistName").value;
    if (!userName.trim()) {
        alert("Please enter your name!");
        return;
    }
    addToWaitlist(userName);
    document.getElementById("waitlistName").value = "";
}

// Notifications
let notifications = [];

function fetchNotifications() {
    notifications = [`${new Date().toLocaleTimeString()} - Welcome to the parking app!`];
    updateNotificationsDisplay();
}

function showNotification(message) {
    const timestamp = new Date().toLocaleTimeString();
    notifications.unshift(`${timestamp} - ${message}`);
    updateNotificationsDisplay();
}

function updateNotificationsDisplay() {
    const notificationList = document.getElementById("notification-list");
    if (!notificationList) return;

    if (notifications.length === 0) {
        notificationList.innerHTML = "<p>No new notifications.</p>";
    } else {
        notificationList.innerHTML = notifications
            .map(notification => `<div class="notification-item">${notification}</div>`)
            .join('');
    }
}
//--------------------feedback-------------------

function openFeedback() {
    document.getElementById('feedbackModal').style.display = 'block';
}

function closeFeedback() {
    document.getElementById('feedbackModal').style.display = 'none';
}

// Optional: Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('feedbackModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Handle Feedback Form Submit
document.addEventListener('DOMContentLoaded', function () {
    const feedbackForm = document.getElementById('feedbackForm');
    feedbackForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const rating = document.getElementById('rating').value;
        const comments = document.getElementById('comments').value;

        console.log("Feedback submitted:", rating, comments);

        // Show confirmation
        alert("Thank you for your feedback!");

        // Reset and close
        feedbackForm.reset();
        closeFeedback();
    });
});


// Logout
function logout() {
    if (confirm("Are you sure you want to log out?")) {
        window.location.href = "login.html";
    }
}
