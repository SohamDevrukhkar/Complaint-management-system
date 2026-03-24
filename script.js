const form = document.getElementById("complaintForm");
const formTitle = document.getElementById("formTitle");
const subjectInput = document.getElementById("subject");
const descriptionInput = document.getElementById("description");
const priorityInput = document.getElementById("priority");
const statusInput = document.getElementById("status");
const complaintsBody = document.getElementById("complaintsBody");

let complaints = [];
let editId = null;

function generateId() {
  return "CMP-" + String(Date.now()).slice(-6);
}

function renderComplaints() {
  complaintsBody.innerHTML = "";

  complaints.forEach((item) => {
    const tr = document.createElement("tr");
    if (item.completed) tr.classList.add("completed-row");

    const statusClass =
      item.status === "Open" ? "open" :
      item.status === "In Progress" ? "progress" : "resolved";

    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.subject}</td>
      <td><span class="badge ${item.priority.toLowerCase()}">${item.priority}</span></td>
      <td><span class="${statusClass}">${item.status}</span></td>
      <td>${item.completed ? "Yes" : "No"}</td>
      <td>
        <div class="actions">
          <button class="small-btn edit" onclick="editComplaint('${item.id}')">Edit</button>
          <button class="small-btn delete" onclick="deleteComplaint('${item.id}')">Delete</button>
          <button class="small-btn toggle" onclick="toggleComplete('${item.id}')">
            ${item.completed ? "Mark Incomplete" : "Mark Complete"}
          </button>
        </div>
      </td>
    `;

    complaintsBody.appendChild(tr);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const payload = {
    subject: subjectInput.value.trim(),
    description: descriptionInput.value.trim(),
    priority: priorityInput.value,
    status: statusInput.value
  };

  if (!payload.subject || !payload.description || !payload.priority || !payload.status) return;

  if (editId) {
    complaints = complaints.map((c) =>
      c.id === editId ? { ...c, ...payload } : c
    );
    editId = null;
    formTitle.textContent = "Add Complaint";
  } else {
    complaints.push({
      id: generateId(),
      ...payload,
      completed: false
    });
  }

  form.reset();
  renderComplaints();
});

function editComplaint(id) {
  const item = complaints.find((c) => c.id === id);
  if (!item) return;

  editId = id;
  formTitle.textContent = "Edit Complaint";
  subjectInput.value = item.subject;
  descriptionInput.value = item.description;
  priorityInput.value = item.priority;
  statusInput.value = item.status;
}

function deleteComplaint(id) {
  complaints = complaints.filter((c) => c.id !== id);
  if (editId === id) {
    editId = null;
    form.reset();
    formTitle.textContent = "Add Complaint";
  }
  renderComplaints();
}

function toggleComplete(id) {
  complaints = complaints.map((c) =>
    c.id === id ? { ...c, completed: !c.completed } : c
  );
  renderComplaints();
}

window.editComplaint = editComplaint;
window.deleteComplaint = deleteComplaint;
window.toggleComplete = toggleComplete;
