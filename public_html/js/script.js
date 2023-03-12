const tasks = [];
const submitButton = document.querySelector("#submitButton");
const taskInput = document.querySelector("#task");

const currentTask = document.createElement("p");
let textNode = document.createTextNode("");
currentTask.appendChild(textNode);

const nextButton = document.createElement("button");
nextButton.textContent = "NEXT";

let currentTaskIndex = 0;
const container = document.querySelector(".container");

const taskDiv = document.createElement("div")
taskDiv.classList.add("taskDiv");

submitButton.addEventListener("click", () => {
    tasks.push(taskInput.value);

    if(tasks.length === 1){
        textNode.textContent = tasks[currentTaskIndex];
        taskDiv.appendChild(nextButton);
    }
})

taskDiv.appendChild(currentTask);
container.appendChild(taskDiv);

nextButton.addEventListener("click", () => {
    currentTaskIndex = (currentTaskIndex + 1) % tasks.length;
    textNode.textContent = tasks[currentTaskIndex];
});