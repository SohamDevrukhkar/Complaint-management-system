const adminUser = document.getElementById("adminUser");
const complaintsTable = document.getElementById("complaintsTable");
const usersTable = document.getElementById("usersTable");
const userForm = document.getElementById("userForm");
const newUserName = document.getElementById("newUserName");

const totalComplaints = document.getElementById("totalComplaints");
const pendingComplaints = document.getElementById("pendingComplaints");
const resolvedComplaints = document.getElementById("resolvedComplaints");
const activeUsers = document.getElementById("activeUsers");

let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [
  { id: 1, name: "Rahul", role: "Staff" },
  { id: 2, name: "Priya", role: "Staff" },
  { id: 3, name: "Admin", role: "Admin" }
];

function saveComplaints() {
  localStorage.setItem("complaints", JSON.stringify(complaints));
}

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function setupAdmin() {
  const savedUser = localStorage.getItem("username") || "Admin";
  adminUser.textContent = `Welcome, ${savedUser}`;
}

function updateStats() {
  totalComplaints.textContent = complaints.length;
  pendingComplaints.textContent = complaints.filter(
    (item) => item.status === "Open" || item.status === "In Progress"
  ).length;
  resolvedComplaints.textContent = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;
  activeUsers.textContent = users.length;
}

function getStatusClass(status) {
  if (status === "Open") return "status-open";
  if (status === "In Progress") return "status-progress";
  return "status-resolved";
}

function renderComplaints() {
  complaintsTable.innerHTML = "";

  if (complaints.length === 0) {
    complaintsTable.innerHTML = `
      <tr>
        <td colspan="6">No complaints found.</td>
      </tr>
    `;
    return;
  }

  complaints.forEach((complaint) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${complaint.id}</td>
      <td>${complaint.subject}</td>
      <td><span class="badge ${complaint.priority.toLowerCase()}">${complaint.priority}</span></td>
      <td class="${getStatusClass(complaint.status)}">${complaint.status}</td>
      <td>
        <select onchange="assignComplaint(${complaint.id}, this.value)">
          <option value="">Assign Staff</option>
          ${users
            .filter((user) => user.role === "Staff")
            .map(
              (user) => `
                <option value="${user.name}" ${complaint.assignedTo === user.name ? "selected" : ""}>
                  ${user.name}
                </option>
              `
            )
            .join("")}
        </select>
      </td>
      <td>
        <div class="actions">
          <select onchange="changeStatus(${complaint.id}, this.value)">
            <option value="Open" ${complaint.status === "Open" ? "selected" : ""}>Open</option>
            <option value="In Progress" ${complaint.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Resolved" ${complaint.status === "Resolved" ? "selected" : ""}>Resolved</option>
          </select>
        </div>
      </td>
    `;

    complaintsTable.appendChild(row);
  });
}

function renderUsers() {
  usersTable.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.role}</td>
      <td>
        <button class="small-btn delete" onclick="deleteUser(${user.id})" ${
          user.role === "Admin" ? "disabled" : ""
        }>
          Delete
        </button>
      </td>
    `;

    usersTable.appendChild(row);
  });
}

window.assignComplaint = function (id, assignedTo) {
  complaints = complaints.map((item) =>
    item.id === id ? { ...item, assignedTo } : item
  );
  saveComplaints();
  renderComplaints();
  updateStats();
};

window.changeStatus = function (id, status) {
  complaints = complaints.map((item) =>
    item.id === id
      ? {
          ...item,
          status,
          completed: status === "Resolved"
        }
      : item
  );
  saveComplaints();
  renderComplaints();
  updateStats();
};

window.deleteUser = function (id) {
  users = users.filter((user) => user.id !== id);
  saveUsers();
  renderUsers();
  renderComplaints();
  updateStats();
};

userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = newUserName.value.trim();
  if (!name) return;

  users.push({
    id: Date.now(),
    name,
    role: "Staff"
  });

  saveUsers();
  renderUsers();
  renderComplaints();
  updateStats();
  userForm.reset();
});

setupAdmin();
saveUsers();
renderUsers();
renderComplaints();
updateStats();
