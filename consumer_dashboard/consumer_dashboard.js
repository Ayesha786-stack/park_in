 document.addEventListener("DOMContentLoaded", function () {
    initializeApp();

    const bookingForm = document.getElementById('bookingFormDetails');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingFormSubmit);
    }

    // Navigation tabs
    document.getElementById("myBookingsTab")?.addEventListener("click", () => showContent("myBookings"));
    document.getElementById("checkSlotsTab")?.addEventListener("click", () => showContent("checkSlots"));
    document.getElementById("addWaitlistBtn")?.addEventListener("click", testAddToWaitlist);

    // Hamburger menu toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            console.log("Hamburger menu clicked!");  // Debugging line
            toggleSidebar();
        });
    }
});

// Function to toggle the sidebar (for small screens)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar'); // Get the sidebar by class
    if (sidebar) {
        console.log("Toggling sidebar visibility...");  // Debugging line
        sidebar.classList.toggle('active'); // Toggle the 'active' class to show/hide the sidebar
    }
}

// Function to hide the sidebar after clicking a section
function hideSidebar() {
    const sidebar = document.querySelector('.sidebar'); // Get the sidebar by class
    sidebar.classList.remove('active'); // Remove 'active' class to hide the sidebar
}

// Placeholder for showContent function
function showContent(contentId) {
    const contentSections = document.querySelectorAll('.content');
    contentSections.forEach(section => section.style.display = 'none'); // Hide all sections
    document.getElementById(contentId).style.display = 'block'; // Show selected section
}

// Function to open the booking form and populate the selected slot
function openBookingForm(slot) {
    const bookingForm = document.getElementById('bookingFormDetails');
    if (bookingForm) {
        // Set the selected slot as a data attribute on the form for later use
        bookingForm.dataset.slot = slot;
        
        // Populate the slot field (you can add additional slot details if needed)
        document.getElementById('selectedSlot').value = slot;

        // Show the booking form if it is hidden (optional)
        bookingForm.style.display = 'block';
        
        // Optionally hide other content or sections (if you want to hide the rest of the content when the form is open)
        showContent('bookingForm');
    }
}

// This function shows content by section ID
function showContent(contentId) {
    document.querySelectorAll('.content').forEach(section => {
        section.style.display = 'none';
    });

    const target = document.getElementById(contentId);
    if (target) target.style.display = 'block';
}

// Handle booking form submission
function handleBookingFormSubmit(event) {
    event.preventDefault();

    const carModel = document.getElementById('carModel').value.trim();
    const startTimeStr = document.getElementById('startTime').value.trim();
    const endTimeStr = document.getElementById('endTime').value.trim();
    const bookingForm = document.getElementById('bookingFormDetails');
    const selectedSlot = bookingForm.dataset.slot || document.getElementById('selectedSlot').value || "Unknown Slot";

    if (!carModel || !startTimeStr || !endTimeStr) {
        alert("Please fill in all fields.");
        return;
    }

    function parseTimeString(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    }

    const startTime = parseTimeString(startTimeStr);
    const endTime = parseTimeString(endTimeStr);

    const shopOpenTime = new Date();
    shopOpenTime.setHours(10, 0, 0, 0);
    const shopCloseTime = new Date();
    shopCloseTime.setHours(23, 58, 59, 999);

    if (startTime < shopOpenTime || startTime >= shopCloseTime) {
        alert("Booking time must be between 10:00 AM and 12:00 AM.");
        return;
    }

    if (endTime < shopOpenTime || endTime >= shopCloseTime) {
        alert("End time must be between 10:00 AM and 12:00 AM.");
        return;
    }

    if (endTime <= startTime) {
        alert("End time must be after start time.");
        return;
    }

    const now = new Date();
    const minBookingTime = new Date();
    minBookingTime.setMinutes(minBookingTime.getMinutes() + 30);
    if (startTime < minBookingTime) {
        alert("You must book at least 30 minutes in advance.");
        return;
    }

    // Pricing logic
    let basePrice = 100, peakPrice = 150, eventSurcharge = 50, penalty = 0;
    const bookingHour = startTime.getHours();
    if (bookingHour >= 17 && bookingHour <= 21) basePrice = peakPrice;
    if ([5, 6].includes(now.getDay())) basePrice += eventSurcharge;

    const durationHours = Math.abs((endTime - startTime) / (1000 * 60 * 60));
    const maxAllowedHours = 3;
    if (durationHours > maxAllowedHours) penalty = 200;

    const total = basePrice + penalty;
    localStorage.setItem("totalPrice", total);

    //  Booking ID Generation and Save Booking Info
    const bookingId = "BK" + Date.now();
const bookingData = {
    bookingId: bookingId,
    area: selectedArea,
    carModel: carModel,
    slot: selectedSlot,
    time: `${startTimeStr} - ${endTimeStr}`, // Combined time for display
    date: new Date().toLocaleDateString(),
    totalPrice: total,
    status: "upcoming" // Match your HTML section ID: "upcomingBody"
};


    localStorage.setItem("bookingData", JSON.stringify(bookingData));

    alert(`Booking confirmed!\nBooking ID: ${bookingId}\nSlot: ${selectedSlot}\nCar: ${carModel}\nFrom: ${startTimeStr} To: ${endTimeStr}\nTotal Cost: Rs. ${total}`);
    
    showNotification(`Booking confirmed for Slot ${selectedSlot}. Total: Rs. ${total}`);
    
    alert(
  "Your slot has been successfully booked!\n\n" +
  "Please check-in at least 15 minutes before your scheduled time.\n" +
  "If you do not check-in on time, your slot will be released.\n" +
  "Alternatively, you can opt to join the waitlist."
);
}

// Bind form submit
document.getElementById("bookingFormDetails").addEventListener("submit", handleBookingFormSubmit);

// Initialize app on load
function initializeApp() {
    if (!document.querySelector('.content')) return;
    showContent('welcome');
    fetchWaitlist();
    fetchNotifications();
    fetchBookings();
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initializeApp);

// Function to show content (hide other sections)
function showContent(sectionId) {
    document.querySelectorAll('.content').forEach(section => {
        section.style.display = 'none';
    });

    const target = document.getElementById(sectionId);
    if (target) target.style.display = 'block';

    if (sectionId === 'myBookings') fetchBookings();
}

function getStoredBookings() {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
}

function renderBookings() {
    const bookings = getStoredBookings(); // get from localStorage

    const upcomingBody = document.getElementById('upcomingBody');
    const activeBody = document.getElementById('activeBody');
    const historyBody = document.getElementById('historyBody');
    const cancelledBody = document.getElementById('cancelledBody');

    upcomingBody.innerHTML = '';
    activeBody.innerHTML = '';
    historyBody.innerHTML = '';
    cancelledBody.innerHTML = '';

    bookings.forEach(b => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${b.bookingId}</td>
            <td>${b.area}</td>
            <td>${b.car}</td>
            <td>${b.slot}</td>
            <td>${b.time}</td>
            <td>${b.date}</td>
            <td>${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</td>
            <td>
                ${
                    b.status === 'upcoming'
                        ? `
                            <button onclick="handleCheckIn('${b.id}')">Check-In</button>
                            <button onclick="handleCancel('${b.id}')">Cancel</button>
                          `
                        : b.status === 'active'
                        ? `
                            <button onclick="handleCheckOut('${b.id}')">Check-Out</button>
                          `
                        : b.status === 'completed'
                        ? `<span>Completed</span>`
                        : `<span>Cancelled</span>`
                }
            </td>
        `;

        if (b.status === 'upcoming') {
            upcomingBody.appendChild(row);
        } else if (b.status === 'active') {
            activeBody.appendChild(row);
        } else if (b.status === 'completed') {
            historyBody.appendChild(row);
        } else if (b.status === 'cancelled') {
            cancelledBody.appendChild(row);
        }
    });
}


// Handle Check-In
function handleCheckIn(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    const today = new Date().toISOString().split('T')[0];

    if (booking.date !== today) {
        alert("You can only check in on the booking date.");
        console.log(`Check-In blocked: Booking date is ${booking.date}, but today is ${today}`);
        return;
    }

    if (confirm("Are you sure you want to check in?")) {
        booking.checkInTime = new Date().toISOString(); // Record check-in time
        updateBookingStatus(bookingId, 'active');

        // Start countdown after check-in
        startCheckInCountdown();
    }
}

// Handle Check-Out
function handleCheckOut(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    const now = new Date();

    if (confirm("Are you sure you want to check out?")) {
        // Mark booking as completed (or change status as needed)
        updateBookingStatus(bookingId, 'completed');
        
        // Open the payment modal with booking details
        openPaymentModal(bookingId);
    }
}

// Handle Cancel
function handleCancel(bookingId) {
    if (confirm("Are you sure you want to cancel this booking?")) {
        updateBookingStatus(bookingId, 'cancelled');
    }
}

// Common status updater
function updateBookingStatus(bookingId, newStatus) {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = newStatus;
        console.log(`✅ Booking ${bookingId} status updated to: ${newStatus}`);
    }
    renderBookings();
}

// Initial load
function fetchBookings() {
    renderBookings();
    showTab('upcoming'); // Default tab
}

document.addEventListener('DOMContentLoaded', () => {
    fetchBookings();
});


//-----------------parking area------------

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

// Waitlist
let waitlist = [];

function addToWaitlist(userName, startTime, endTime, areaName) {
    userName = userName.trim();
    if (!userName || !startTime || !endTime || !areaName) {
        alert("Please enter a valid name, start time, end time, and select a parking area!");
        return;
    }

    const start = new Date(`1970-01-01T${startTime}:00Z`); // Time in HH:MM format
    const end = new Date(`1970-01-01T${endTime}:00Z`);   // Time in HH:MM format

    if (start >= end) {
        alert("End time must be after start time!");
        return;
    }

    // Calculate wait time in minutes
    const waitDuration = (end - start) / (1000 * 60); // Convert milliseconds to minutes

    // Store user info and selected parking area (e.g., 'Basement parking' instead of 'Area 1')
    const user = { name: userName, waitStartTime: startTime, waitEndTime: endTime, waitDuration, area: areaName };
    waitlist.push(user);
    updateWaitlistDisplay();
    showNotification(`${userName} added to the waitlist for ${areaName} from ${startTime} to ${endTime}.`);
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
        <tr><th>#</th><th>Name</th><th>Parking Area</th><th>Wait Time</th><th>Action</th></tr>` +
        waitlist.map((user, index) => 
            `<tr><td>${index + 1}</td><td>${user.name}</td><td>${user.area}</td><td>${user.waitStartTime} - ${user.waitEndTime} (${user.waitDuration} min)</td>
            <td><button onclick="removeFromWaitlist(${index})">Remove</button></td></tr>`).join('') + "</table>";
}

function testAddToWaitlist() {
    const userName = document.getElementById("waitlistName").value;
    const startTime = document.getElementById("waitlistStartTime").value;
    const endTime = document.getElementById("waitlistEndTime").value;
    const areaName = document.getElementById("waitlistArea").value;
    
    if (!userName.trim() || !startTime || !endTime || !areaName) {
        alert("Please enter a valid name, start time, end time, and select a parking area!");
        return;
    }

    addToWaitlist(userName, startTime, endTime, areaName);
    document.getElementById("waitlistName").value = "";
    document.getElementById("waitlistStartTime").value = "";
    document.getElementById("waitlistEndTime").value = "";
    document.getElementById("waitlistArea").value = ""; // Reset dropdown to default value
}

// Function to show notifications (for simplicity, just using alerts)
function showNotification(message) {
    alert(message);
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
//---------------------countdown-------------------
let checkInTimeLimit = 15 * 60;
function startCheckInCountdown() {
    const countdownElement = document.getElementById("countdown");

    const interval = setInterval(() => {
        const minutes = Math.floor(checkInTimeLimit / 60);
        const seconds = checkInTimeLimit % 60;
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (checkInTimeLimit <= 0) {
            clearInterval(interval);
            document.getElementById("booking-status").textContent = "Check-in time expired!";
            countdownElement.textContent = "00:00";

            //  Show waitlist modal after countdown ends
            showWaitlistModal();

            return;
        }

        checkInTimeLimit--;
    }, 1000);
}
// Show Waitlist Modal
function showWaitlistModal() {
    document.getElementById("waitlistModal").style.display = "block";
}

// Close Modal
document.getElementById("closeModalBtn").addEventListener("click", function () {
    document.getElementById("waitlistModal").style.display = "none";
});

// Join Waitlist
document.getElementById("joinWaitlistBtn").addEventListener("click", function () {
    document.getElementById("waitlistModal").style.display = "none";
    
    // Simulate backend call (can be replaced with AJAX or fetch)
    alert("You have been added to the waitlist!");
});


// Logout
function logout() {
    if (confirm("Are you sure you want to log out?")) {
window.location.href = "login.html";
    }
}



