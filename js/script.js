const tasks = [];
const submitButton = document.querySelector("#submitButton");
const taskInput = document.querySelector("#task");

const currentTask = document.createElement("p");
let textNode = document.createTextNode("");
currentTask.appendChild(textNode);

const nextButton = document.createElement("button");
nextButton.textContent = "NEXT";

let currentTaskIndex = 0;

submitButton.addEventListener("click", () => {
    tasks.push(taskInput.value);

    if(tasks.length === 1){
        textNode.textContent = tasks[currentTaskIndex];
        body.appendChild(nextButton);
    }
})

const body = document.querySelector("body");
body.appendChild(currentTask);

nextButton.addEventListener("click", () => {
    currentTaskIndex = (currentTaskIndex + 1) % tasks.length;
    textNode.textContent = tasks[currentTaskIndex];
});