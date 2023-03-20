let taskList;
const textNode = document.createTextNode("");
const currentTaskDiv = document.querySelector(".currentTask");
const buttons = document.createElement("div");
const nextButton = document.createElement("button");
const deleteButton = document.createElement("button");
const currentTask = document.createElement("p");

buttons.classList.add("buttons");
buttons.appendChild(deleteButton);
buttons.appendChild(nextButton);

if(!localStorage.getItem("taskList")){
    taskList = new List("main", 0, []);
}
else {
    taskList = JSON.parse(localStorage.getItem("taskList"));
}

const sidebar = document.querySelector(".sidebar");

taskList.tasks.forEach(task => {
    const taskP = createTask(task);
    sidebar.appendChild(taskP);
});

if(taskList.tasks.length){
    textNode.textContent = taskList.tasks[taskList.currentTaskIndex];
    currentTask.appendChild(textNode);
    currentTaskDiv.appendChild(currentTask);    
    currentTaskDiv.appendChild(buttons);
}

const highlightCurrentTask = () => {
    const currentHighlightedTask = document.querySelector(".highlight");
    if(currentHighlightedTask){
        currentHighlightedTask.classList.remove("highlight");
    }

    const taskToHighlight = document.querySelector(`.sidebar p:nth-child(${taskList.currentTaskIndex + 2})`);
    if(taskToHighlight){
        taskToHighlight.classList.add("highlight");
    }
}

highlightCurrentTask();

const submitButton = document.querySelector("[type=\"submit\"]");
const taskInput = document.querySelector("[type=\"text\"]");

deleteButton.textContent = "DELETE";
nextButton.textContent = "NEXT";

const addTask = () => {
    if(taskInput.value.trim() === ""){
        return;
    }

    taskList.tasks.push(taskInput.value);
    localStorage.setItem("taskList", JSON.stringify(taskList));

    const taskP = createTask(taskInput.value);

    const sidebar = document.querySelector(".sidebar");

    sidebar.appendChild(taskP);

    if(taskList.tasks.length === 1){
        textNode.textContent = taskInput.value;
    currentTask.appendChild(textNode);
    currentTaskDiv.appendChild(currentTask);    
    currentTaskDiv.appendChild(buttons);
    highlightCurrentTask();
    }
};

submitButton.addEventListener("click", () => {
    addTask();
    taskInput.value = "";
    taskInput.focus();
});
taskInput.addEventListener("keyup", event => {
    if(event.key === "Enter"){
        addTask();
        taskInput.value = "";
    }
});

deleteButton.addEventListener("click", () => {
    const task = document.querySelector(`.sidebar p:nth-child(${taskList.currentTaskIndex + 2})`);
    textNode.textContent = taskList.tasks[taskList.currentTaskIndex + 1];
    taskList.tasks.splice(taskList.tasks.currentTaskIndex, 1);
    sidebar.removeChild(task);
    localStorage.setItem("taskList", JSON.stringify(taskList));
})

nextButton.addEventListener("click", () => {
    taskList.currentTaskIndex = (taskList.currentTaskIndex + 1) % taskList.tasks.length;
    localStorage.setItem("taskList", JSON.stringify(taskList));
    textNode.textContent = taskList.tasks[taskList.currentTaskIndex];

    highlightCurrentTask();
});

function createTask(taskString) {
    const taskP = document.createElement("p");
    taskP.textContent = taskString;

    return taskP;
}

