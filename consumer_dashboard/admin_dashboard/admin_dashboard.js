// Logout function
function logout() {
  alert("Logging out...");
  window.location.href = "login.html";
}

// Section switcher
function showContent(sectionId) {
  document.querySelectorAll('.content').forEach(content => {
    content.style.display = 'none';
  });

  const selectedContent = document.getElementById(sectionId);
  if (selectedContent) selectedContent.style.display = 'block';
}

// ----------------------Modal Functions-----------------------
function openModal(title, message, confirmCallback) {
  const modal = document.getElementById("modal");
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalMessage").textContent = message;

  document.getElementById("modalConfirmBtn").onclick = () => {
    confirmCallback();
    closeModal();
  };

  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// ---------------------- Payment Modal -------------------------
const paymentModal = document.getElementById("paymentModal");
const closeBtn = document.querySelector(".close-btn");

function openPaymentModal(payment) {
  document.getElementById("paymentId").value = payment.id;
  document.getElementById("paymentUser").value = payment.user;
  document.getElementById("paymentAmount").value = payment.amount;
  document.getElementById("paymentStatus").value = payment.status;

  paymentModal.style.display = "block";
}

function closePaymentModal() {
  paymentModal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target === paymentModal) {
    closePaymentModal();
  }
};

// ---------------------- Parking Areas -----------------------
function addParkingAreaForm() {
  document.getElementById('addParkingAreaForm').style.display = 'block';
}

function closeAddParkingAreaForm() {
  document.getElementById('addParkingAreaForm').style.display = 'none';
}

function addParkingArea() {
  const areaName = document.getElementById('areaName').value;
  const capacity = document.getElementById('capacity').value;

  if (!areaName || !capacity) {
    alert('Please fill in all fields');
    return;
  }

  const tableBody = document.getElementById('parkingAreasTableBody');
  const row = tableBody.insertRow();
  row.innerHTML = `
    <td>${areaName}</td>
    <td>Example Location</td>
    <td>Available</td>
    <td>
      <button onclick="editParkingArea(this)">Edit</button>
      <button onclick="deleteParkingArea(this)">Delete</button>
    </td>
  `;

  document.getElementById('areaName').value = '';
  document.getElementById('capacity').value = '';
  closeAddParkingAreaForm();
}

function editParkingArea(button) {
  const row = button.closest('tr');
  const areaName = row.cells[0].textContent;

  openModal("Edit Parking Area", `Edit the details for ${areaName}.`, () => {
    alert(`Edited parking area: ${areaName}`);
  });
}

function deleteParkingArea(button) {
  const row = button.closest('tr');
  openModal("Delete Parking Area", "Are you sure you want to delete this parking area?", () => {
    row.remove();
  });
}

// ---------------------- Bookings -----------------------
function handleBookingAction(button, action) {
  const row = button.closest('tr');
  const bookingId = row.cells[0].textContent;

  openModal(`${action} Booking`, `Are you sure you want to ${action.toLowerCase()} booking ID: ${bookingId}?`, () => {
    alert(`${action} booking with ID: ${bookingId}`);
  });
}


// ---------------------- Payments -----------------------
function renderPayments() {
  const data = [
    { id: '1234', user: 'John Doe', amount: '100', status: 'Paid', date: '2025-04-10' },
    { id: '1235', user: 'Jane Doe', amount: '50', status: 'Pending', date: '2025-04-11' }
  ];

  const tbody = document.getElementById('paymentTableBody');
  tbody.innerHTML = '';

  data.forEach(payment => {
    const row = document.createElement('tr');

    const actionBtn = document.createElement('button');
    actionBtn.innerText = 'View Payment';
    actionBtn.onclick = () => openPaymentModal(payment);

    row.innerHTML = `
      <td>${payment.id}</td>
      <td>${payment.user}</td>
      <td>${payment.amount}</td>
      <td>${payment.status}</td>
      <td>${payment.date}</td>
      <td></td>
    `;

    row.children[5].appendChild(actionBtn);
    tbody.appendChild(row);
  });
}

// ---------------------- Sleep Mode Auto Release -----------------------
let parkingSlots = [
  { id: 'A1', status: 'In Use', assignedTo: 'User1', startTime: new Date() },
  { id: 'A2', status: 'Available', assignedTo: null, startTime: null }
];

function checkSleepMode() {
  const currentTime = new Date();
  parkingSlots.forEach(slot => {
    if (slot.status === 'In Use') {
      const timeElapsed = (currentTime - new Date(slot.startTime)) / 1000 / 60; // Time in minutes
      if (timeElapsed > 120) { // 2 hours max usage time
        slot.status = 'Available';
        slot.assignedTo = null;
        alert(`Slot ${slot.id} released due to inactivity.`);
      }
    }
  });
}

// ---------------------- Waitlist Assignment -----------------------
const waitlist = [
  { userId: 'U003', userName: 'User Three', slotRequested: 'A1' }
];

function checkForAvailableSlots() {
  parkingSlots.forEach(slot => {
    if (slot.status === 'Available' && waitlist.length > 0) {
      const nextUser = waitlist.shift();
      slot.assignedTo = nextUser.userName;
      slot.status = 'In Use';
      alert(`Waitlist user ${nextUser.userName} has been assigned to slot ${slot.id}`);
    }
  });
}

setInterval(() => {
  checkSleepMode();
  checkForAvailableSlots();
}, 60000); // Check every minute

// Initialize renderers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  renderUsers();
  renderPayments();
  renderBookings();
});
