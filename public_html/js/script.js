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
    console.log("here");
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
    let previousTask;

    if(taskList.currentTaskIndex === 0){
        previousTask = document.querySelector(`.sidebar p:nth-child(${taskList.tasks.length + 1})`);
    }
    else {
        previousTask = document.querySelector(`.sidebar p:nth-child(${taskList.currentTaskIndex + 1})`);
    }
   
    const highlight = document.querySelector(`.sidebar p:nth-child(${taskList.currentTaskIndex + 2})`);
    
    if(previousTask){
        previousTask.classList.remove("highlight");
    }

    if(highlight){
        highlight.classList.add("highlight");
    }
}

highlightCurrentTask();

const submitButton = document.querySelector("[type=\"submit\"]");
const taskInput = document.querySelector("[type=\"text\"]");

deleteButton.textContent = "DELETE";
nextButton.textContent = "NEXT";

const addTask = () => {
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

submitButton.addEventListener("click", addTask);
taskInput.addEventListener("keyup", event => {
    if(event.key === "Enter"){
        addTask();
    }
});

deleteButton.addEventListener("click", () => {
    const task = document.querySelector(`.sidebar p:nth-child(${taskList.currentTaskIndex + 2})`);
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

