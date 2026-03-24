const form = document.getElementById("complaintForm");
const formTitle = document.getElementById("formTitle");
const subjectInput = document.getElementById("subject");
const descriptionInput = document.getElementById("description");
const priorityInput = document.getElementById("priority");
const statusInput = document.getElementById("status");
const complaintsBody = document.getElementById("complaintsBody");
const userName = document.getElementById("userName");

let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
let editId = null;

function setupUser() {
  let savedUser = localStorage.getItem("username");

  if (!savedUser) {
    const enteredName = prompt("Enter your username");
    if (enteredName && enteredName.trim() !== "") {
      savedUser = enteredName.trim();
      localStorage.setItem("username", savedUser);
    } else {
      savedUser = "User";
    }
  }

  userName.textContent = `Welcome, ${savedUser}`;
}

function saveComplaints() {
  localStorage.setItem("complaints", JSON.stringify(complaints));
}

function renderComplaints() {
  complaintsBody.innerHTML = "";

  complaints.forEach((complaint) => {
    const row = document.createElement("tr");

    if (complaint.completed) {
      row.classList.add("completed-row");
    }

    row.innerHTML = `
      <td>${complaint.id}</td>
      <td>${complaint.subject}</td>
      <td><span class="badge ${complaint.priority.toLowerCase()}">${complaint.priority}</span></td>
      <td class="${
        complaint.status === "Open"
          ? "open"
          : complaint.status === "In Progress"
          ? "progress"
          : "resolved"
      }">${complaint.status}</td>
      <td>${complaint.completed ? "Yes" : "No"}</td>
      <td>
        <div class="actions">
          <button class="small-btn edit" onclick="editComplaint(${complaint.id})">Edit</button>
          <button class="small-btn delete" onclick="deleteComplaint(${complaint.id})">Delete</button>
          <button class="small-btn toggle" onclick="toggleComplaint(${complaint.id})">
            ${complaint.completed ? "Undo" : "Complete"}
          </button>
        </div>
      </td>
    `;

    complaintsBody.appendChild(row);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const complaintData = {
    subject: subjectInput.value.trim(),
    description: descriptionInput.value.trim(),
    priority: priorityInput.value,
    status: statusInput.value,
  };

  if (!complaintData.subject || !complaintData.description || !complaintData.priority || !complaintData.status) {
    return;
  }

  if (editId !== null) {
    complaints = complaints.map((complaint) =>
      complaint.id === editId ? { ...complaint, ...complaintData } : complaint
    );
    editId = null;
    formTitle.textContent = "Add Complaint";
  } else {
    complaints.push({
      id: Date.now(),
      ...complaintData,
      completed: false,
    });
  }

  saveComplaints();
  renderComplaints();
  form.reset();
});

window.editComplaint = function (id) {
  const complaint = complaints.find((item) => item.id === id);
  if (!complaint) return;

  subjectInput.value = complaint.subject;
  descriptionInput.value = complaint.description;
  priorityInput.value = complaint.priority;
  statusInput.value = complaint.status;

  editId = id;
  formTitle.textContent = "Edit Complaint";
};

window.deleteComplaint = function (id) {
  complaints = complaints.filter((item) => item.id !== id);
  saveComplaints();
  renderComplaints();
};

window.toggleComplaint = function (id) {
  complaints = complaints.map((item) =>
    item.id === id ? { ...item, completed: !item.completed } : item
  );
  saveComplaints();
  renderComplaints();
};

setupUser();
renderComplaints();

complaints.push({
  id: Date.now(),
  subject: subjectInput.value.trim(),
  description: descriptionInput.value.trim(),
  priority: priorityInput.value,
  status: statusInput.value,
  completed: false,
  assignedTo: ""
});


