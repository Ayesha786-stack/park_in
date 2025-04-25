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

//----------------------Modal Functions-----------------------
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
//----------------------payment modal-------------------------
const paymentModal = document.getElementById("paymentModal");
const closeBtn = document.querySelector(".close-btn");

function openPaymentModal(payment) {
  document.getElementById("paymentId").value = payment.id;
  document.getElementById("paymentUser").value = payment.user;
  document.getElementById("paymentAmount").value = payment.amount;
  document.getElementById("paymentStatus").value = payment.status;

  paymentModal.style.display = "block";
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

// ---------------------- Users -----------------------

const users = [
  { id: 'U001', name: 'User One', email: 'user1@example.com', role: 'Consumer' },
  { id: 'U002', name: 'User Two', email: 'user2@example.com', role: 'Admin' }
];

function renderUsers() {
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = '';

  users.forEach(user => {
    const tr = document.createElement('tr');

    // Create table cells for user data
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
    `;

    // Create actions (buttons) cell
    const tdActions = document.createElement('td');

    // Create the Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('btn-edit');
    editBtn.onclick = () => openEditModal(user.id);

    // Create the Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('btn-delete');
    deleteBtn.onclick = () => confirmDeleteUser(user.id);

    // Add buttons to the actions cell
    tdActions.appendChild(editBtn);
    tdActions.appendChild(deleteBtn);

    // Append actions cell to the row
    tr.appendChild(tdActions);

    // Append the row to the table body
    tbody.appendChild(tr);
  });
}

function openEditModal(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;

  document.getElementById('editUserId').value = user.id;
  document.getElementById('editUserName').value = user.name;
  document.getElementById('editUserEmail').value = user.email;
  document.getElementById('editUserRole').value = user.role;

  document.getElementById('editUserModal').style.display = 'flex';
}

function closeEditModal() {
  document.getElementById('editUserModal').style.display = 'none';
}

function confirmDeleteUser(userId) {
  openModal("Delete User", "Are you sure you want to delete this user?", () => {
    const index = users.findIndex(u => u.id === userId);
    if (index > -1) users.splice(index, 1);
    renderUsers();
  });
}

document.getElementById('editUserForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const id = document.getElementById('editUserId').value;
  const name = document.getElementById('editUserName').value;
  const email = document.getElementById('editUserEmail').value;
  const role = document.getElementById('editUserRole').value;

  const user = users.find(u => u.id === id);
  if (user) {
    user.name = name;
    user.email = email;
    user.role = role;
  }

  renderUsers();
  closeEditModal();
});


// ---------------------- Payments -----------------------
function renderPayments() {
  const data = [
    { id: '1234', user: 'John Doe', amount: '100', status: 'Paid', date: '2025-04-10' },
    { id: '1235', user: 'Jane Doe', amount: '50', status: 'Pending', date: '2025-04-11' }
  ];

  const tbody = document.getElementById('paymentTableBody');
  tbody.innerHTML = ''; // Clear existing rows

  data.forEach(payment => {
    const row = document.createElement('tr');

    // Create the "View Payment" button in the Action field (6th column)
    const actionBtn = document.createElement('button');
    actionBtn.innerText = 'View Payment';
    actionBtn.onclick = () => openPaymentModal(payment);  // Open the modal when clicked

    row.innerHTML = `
      <td>${payment.id}</td>
      <td>${payment.user}</td>
      <td>${payment.amount}</td>
      <td>${payment.status}</td>
      <td>${payment.date}</td>  <!-- Date field, no buttons here -->
      <td></td> <!-- Empty Action column, will contain the "View Payment" button -->
    `;

    // Append the "View Payment" button to the Action field (6th column)
    row.children[5].appendChild(actionBtn);

    tbody.appendChild(row);
  });

  // Remove the button below the table
  const viewPaymentButton = document.getElementById("viewPaymentButton");
  if (viewPaymentButton) {
    viewPaymentButton.style.display = "none";  // Hides the "View Payment" button below the table
  }
}



// ---------------------- Bookings Data -----------------------

function renderBookings() {
  const data = [
    { bookingId: 'B001', user: 'User1', parkingArea: 'Area 1', slot: 'Slot 1', status: 'Pending' },
    { bookingId: 'B002', user: 'User2', parkingArea: 'Area 2', slot: 'Slot 2', status: 'Confirmed' }
  ];

  const tbody = document.getElementById('bookingTableBody');
  tbody.innerHTML = '';

  data.forEach(booking => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${booking.bookingId}</td>
      <td>${booking.user}</td>
      <td>${booking.parkingArea}</td>
      <td>${booking.slot}</td>
      <td>${booking.status}</td>
    `;

    // Create a new <td> for buttons
    const actionTd = document.createElement('td');

    // Create Approve button
    const approveBtn = document.createElement('button');
    approveBtn.textContent = 'Approve';
    approveBtn.classList.add('btn-approve');
    approveBtn.onclick = function () {
      handleBookingAction(this, 'Approve');
    };

    // Create Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.classList.add('btn-cancel');
    cancelBtn.onclick = function () {
      handleBookingAction(this, 'Cancel');
    };

    // Append buttons to <td>
    actionTd.appendChild(approveBtn);
    actionTd.appendChild(cancelBtn);

    // Append <td> to row
    row.appendChild(actionTd);

    // Append row to table body
    tbody.appendChild(row);
  });
}

//-----------------------Report---------------------
// Sample reports data
const sampleReports = [
  { id: "RPT001", type: "Daily Summary", date: "2025-04-15" },
  { id: "RPT002", type: "Payment Report", date: "2025-04-14" }
];

function renderReports() {
  const tableBody = document.getElementById("reportsTableBody");
  const message = document.getElementById("noReportsMessage");

  if (sampleReports.length === 0) {
    message.style.display = "block";
    return;
  }

  sampleReports.forEach(report => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${report.id}</td>
      <td>${report.type}</td>
      <td>${report.date}</td>
      <td>
        <button class="download-btn" onclick="downloadReport('${report.id}')">Download</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function downloadReport(reportId) {
  alert(`Downloading report: ${reportId}`);
  // You can implement actual download logic here later
}

// Call this when the Reports tab is opened
renderReports();

//-----------------------waitlist-------------------
const waitlistRequests = [
  { user: "Ayesha", slot: "Area 1 - Slot 5", status: "Pending" },
  { user: "Fareeha Noor", slot: "Area 2 - Slot 1", status: "Pending" },
];

function renderWaitlist() {
  const tableBody = document.getElementById("waitlistTableBody");
  const message = document.getElementById("noWaitlistMessage");
  tableBody.innerHTML = ""; // Clear existing rows

  if (waitlistRequests.length === 0) {
    message.style.display = "block";
    return;
  }

  message.style.display = "none";

  waitlistRequests.forEach((req, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${req.user}</td>
      <td>${req.slot}</td>
      <td>${req.status}</td>
      <td>
        <button class="approve-btn" onclick="updateWaitlistStatus(${index}, 'Approved')">Approve</button>
        <button class="reject-btn" onclick="updateWaitlistStatus(${index}, 'Rejected')">Reject</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function updateWaitlistStatus(index, newStatus) {
  waitlistRequests[index].status = newStatus;
  renderWaitlist();
}
// Call renderWaitlist() when the page is loaded
window.onload = function() {
  renderWaitlist();
};

//-----------------------parking slot---------------
// Dummy data for parking slots
const parkingSlots = [
  { id: 1, number: "Slot 1", area: "Area 1", status: "Available" },
  { id: 2, number: "Slot 2", area: "Area 1", status: "Occupied" },
  { id: 3, number: "Slot 3", area: "Area 2", status: "Available" },
  { id: 4, number: "Slot 4", area: "Area 2", status: "Occupied" },
];

// Render parking slots dynamically (using dummy data)
function renderSlots() {
  const slotsList = document.getElementById("slotsList");
  slotsList.innerHTML = ""; // Clear existing slots

  parkingSlots.forEach((slot) => {
    const slotDiv = document.createElement("div");
    slotDiv.classList.add("slot");
    slotDiv.innerHTML = `
      <p><strong>${slot.number}</strong> (${slot.area}) - Status: ${slot.status}</p>
      <button onclick="editSlot(${slot.id})">Edit</button>
      <button onclick="removeSlot(${slot.id})">Remove</button>
    `;
    slotsList.appendChild(slotDiv);
  });
}

// Simulated Edit/Remove without backend
function editSlot(slotId) {
  const slot = parkingSlots.find(s => s.id === slotId);
  alert(`Edit ${slot.number} (current status: ${slot.status})`);
}

function removeSlot(slotId) {
  const index = parkingSlots.findIndex(s => s.id === slotId);
  if (index !== -1) {
    parkingSlots.splice(index, 1); // Remove slot
    renderSlots(); // Re-render the list
  }
}

// Initial render of slots
renderSlots();


// Handle all .close-btn elements
document.querySelectorAll(".close-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
    document.getElementById("paymentModal").style.display = "none";
    document.getElementById("editUserModal").style.display = "none";
  });
});

// Close modal when clicking outside
window.onclick = function(event) {
  const modals = ["modal", "paymentModal", "editUserModal"];
  modals.forEach(id => {
    const el = document.getElementById(id);
    if (event.target === el) {
      el.style.display = "none";
    }
  });
};


// ---------------------- Load All Data -----------------------

document.addEventListener('DOMContentLoaded', function () {
  renderUsers();
  renderPayments();
  renderBookings();
});
