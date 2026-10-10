const API_URL = "http://localhost:5000/tasks";

window.onload = loadTasks;

async function loadTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {
        displayTask(task);
    });
}

async function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: taskText
        })
    });

    taskInput.value = "";
    loadTasks();
}

function displayTask(task) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";

    taskDiv.innerHTML = `
        <div>
            <strong class="task-title">${task.title}</strong>
            <p>Status: <span class="status">${task.status}</span></p>
        </div>

        <div class="task-buttons">
            <button class="edit-btn">Edit</button>

            <button class="complete-btn">Complete</button>

            <button class="delete-btn">Delete</button>
        </div>
    `;

    const editButton = taskDiv.querySelector(".edit-btn");

    editButton.addEventListener("click", function () {
        const newTitle = prompt("Edit your task:", task.title);

        if (newTitle !== null && newTitle.trim() !== "") {
            editTask(task._id, newTitle.trim());
        }
    });

    const completeButton = taskDiv.querySelector(".complete-btn");

    if (task.status === "Completed") {
        completeButton.remove();
    } else {
        completeButton.addEventListener("click", function () {
            completeTask(task._id);
        });
    }

    const deleteButton = taskDiv.querySelector(".delete-btn");

    deleteButton.addEventListener("click", function () {
        deleteTask(task._id);
    });

    document.getElementById("taskList").appendChild(taskDiv);
}

async function editTask(id, newTitle) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: newTitle
        })
    });

    loadTasks();
}

async function completeTask(id) {
    await fetch(`${API_URL}/${id}/complete`, {
        method: "PUT"
    });

    loadTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}