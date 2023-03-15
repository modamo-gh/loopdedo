let tasks;

if(!localStorage.getItem("tasks")){
    tasks = [];
}
else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
}

const sidebar = document.querySelector(".sidebar");

tasks.forEach(task => {
    const taskP = createTask(task);
    sidebar.appendChild(taskP);
});

const submitButton = document.querySelector("[type=\"submit\"]");
const taskInput = document.querySelector("[type=\"text\"]");

const currentTask = document.createElement("p");
let textNode = document.createTextNode("");
currentTask.appendChild(textNode);

const nextButton = document.createElement("button");
nextButton.textContent = "NEXT";

let currentTaskIndex = 0;

const currentTaskDiv = document.querySelector(".currentTask");

submitButton.addEventListener("click", () => {
    tasks.push(taskInput.value);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    if(tasks.length === 1){
        textNode.textContent = tasks[currentTaskIndex];
        currentTaskDiv.appendChild(nextButton);
    }

    const taskP = createTask(taskInput.value);

    const sidebar = document.querySelector(".sidebar");

    sidebar.appendChild(taskP);
})

currentTaskDiv.appendChild(currentTask);

nextButton.addEventListener("click", () => {
    currentTaskIndex = (currentTaskIndex + 1) % tasks.length;
    textNode.textContent = tasks[currentTaskIndex];
});

function createTask(taskString) {
    const taskP = document.createElement("p");
    taskP.textContent = taskString;

    return taskP;
}