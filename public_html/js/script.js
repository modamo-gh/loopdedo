let taskList;

if(!localStorage.getItem("taskList")){
    taskList = {
        currentTaskDiv: 0,
        tasks: []
    };
}
else {
    taskList = tasks = JSON.parse(localStorage.getItem("taskList"));
}

const sidebar = document.querySelector(".sidebar");

taskList.tasks.forEach(task => {
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
    taskList.tasks.push(taskInput.value);
    currentTaskIndex = taskList.tasks.length - 1;
    localStorage.setItem("taskList", JSON.stringify(taskList));

    if(taskList.tasks.length){
        textNode.textContent = taskList.tasks[currentTaskIndex];
        currentTaskDiv.appendChild(nextButton);
    }

    const taskP = createTask(taskInput.value);

    const sidebar = document.querySelector(".sidebar");

    sidebar.appendChild(taskP);

    highlightCurrentTask();
})

currentTaskDiv.appendChild(currentTask);

nextButton.addEventListener("click", () => {
    currentTaskIndex = (currentTaskIndex + 1) % taskList.tasks.length;
    textNode.textContent = taskList.tasks[currentTaskIndex];

    highlightCurrentTask();
});

function createTask(taskString) {
    const taskP = document.createElement("p");
    taskP.textContent = taskString;

    return taskP;
}

const highlightCurrentTask = () => {
    let previousTask;
    if(currentTaskIndex + 1 === 1){
        previousTask = document.querySelector(`.sidebar p:nth-child(${taskList.tasks.length + 1})`);

    }
    else {
        previousTask = document.querySelector(`.sidebar p:nth-child(${currentTaskIndex + 1})`);
    }
    const highlight = document.querySelector(`.sidebar p:nth-child(${currentTaskIndex + 2})`);
    
    previousTask.classList.remove("highlight");
    highlight.classList.add("highlight");
}