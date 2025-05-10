// Mock data for bookings
const mockBookings = [
    {
        booking_id: 1,
        area_name: 'Main Area',
        slot_number: 12,
        start_time: '2025-04-09 08:00',
        end_time: '2025-04-09 10:00',
        booking_status: 'Paid'
    },
    {
        booking_id: 2,
        area_name: 'North Wing',
        slot_number: 3,
        start_time: '2025-04-09 09:00',
        end_time: '2025-04-09 11:00',
        booking_status: 'Pending'
    }
];

// Mock data for parking slots
const mockSlots = [
    { area_name: 'Main Area', slot_number: 12, status: 'Available' },
    { area_name: 'North Wing', slot_number: 3, status: 'Occupied' }
];

// Simulate successful fetch for bookings
setTimeout(() => {
    const bookingContainer = document.querySelector('.user-bookings .booking-details');
    bookingContainer.innerHTML = ''; // Clear any previous data

    if (mockBookings.length > 0) {
        mockBookings.forEach(booking => {
            const bookingElement = document.createElement('div');
            bookingElement.classList.add('booking-item');
            bookingElement.innerHTML = `
                <p><strong>Booking #${booking.booking_id}</strong></p>
                <p><i class="material-icons">location_on</i> Parking Area: ${booking.area_name}</p>
                <p><i class="material-icons">directions_car</i> Slot: ${booking.slot_number}</p>
                <p><i class="material-icons">timer</i> Duration: ${booking.start_time} to ${booking.end_time}</p>
                <p><i class="material-icons">payment</i> Payment Status: ${booking.booking_status}</p>
                <button class="cancel-btn" onclick="cancelBooking(${booking.booking_id})">Cancel Booking</button>
            `;
            bookingContainer.appendChild(bookingElement);
        });
    } else {
        bookingContainer.innerHTML = '<p>No active bookings</p>';
    }
}, 1000);

// Simulate successful fetch for parking slots
setTimeout(() => {
    const slotsContainer = document.querySelector('.available-slots .slots-list');
    slotsContainer.innerHTML = ''; // Clear any previous slots

    mockSlots.forEach(slot => {
        const slotElement = document.createElement('div');
        slotElement.classList.add('slot-item');
        slotElement.innerHTML = `
            <p><strong>Area: ${slot.area_name}</strong> - Slot: ${slot.slot_number}</p>
            <p>Status: ${slot.status}</p>
        `;
        slotsContainer.appendChild(slotElement);
    });
}, 1000);

// Logout function to redirect to Consumer Dashboard
function logout() {
    
    window.location.href = "../consumer_dashboard.html";  
}
