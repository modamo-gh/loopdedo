const createTask = (taskString) => {
	const taskP = document.createElement("p");
	taskP.textContent = taskString;

	return taskP;
};

const highlightCurrentTask = () => {
	const currentlyHighlightedTask = document.querySelector(".highlight");
	if (currentlyHighlightedTask) {
		currentlyHighlightedTask.classList.remove("highlight");
	}

	const taskToHighlight = document.querySelector(
		`.sidebar p:nth-child(${taskList.currentTaskIndex + 2})`
	);
	if (taskToHighlight) {
		taskToHighlight.classList.add("highlight");
	}
};

const populateCurrentTaskDiv = (task) => {
	textNode.textContent = task;
	currentTask.appendChild(textNode);
	currentTaskDiv.appendChild(currentTask);
	currentTaskDiv.appendChild(buttons);
	buttons.hidden = false;
};

const populateSidebar = () => {
	taskList.tasks.forEach((task) => {
		const taskP = createTask(task);
		sidebar.appendChild(taskP);
	});
};

const retrieveTasks = () => {
	if (!localStorage.getItem("taskList")) {
		return new List("tasks", 0, []);
	} else {
		return JSON.parse(localStorage.getItem("taskList"));
	}
};

const taskList = retrieveTasks();
const sidebar = document.querySelector(".sidebar");

populateSidebar();

const currentTaskDiv = document.querySelector(".currentTask");
const currentTask = document.createElement("p");
const textNode = document.createTextNode("");

const buttons = document.createElement("div");

const deleteButton = document.createElement("button");
deleteButton.textContent = "DELETE";

const nextButton = document.createElement("button");
nextButton.textContent = "NEXT";

buttons.classList.add("buttons");
buttons.appendChild(deleteButton);
buttons.appendChild(nextButton);

if (taskList.tasks.length) {
	populateCurrentTaskDiv(taskList.tasks[taskList.currentTaskIndex]);
	highlightCurrentTask();
}

const submitButton = document.querySelector('[type="submit"]');
const taskInput = document.querySelector('[type="text"]');

const addTask = () => {
	if (taskInput.value.trim() === "") {
		return;
	}

	taskList.tasks.push(taskInput.value);
	localStorage.setItem("taskList", JSON.stringify(taskList));

	const taskP = createTask(taskInput.value);

	const sidebar = document.querySelector(".sidebar");

	sidebar.appendChild(taskP);

	if (taskList.tasks.length === 1) {
		populateCurrentTaskDiv(taskInput.value);
		highlightCurrentTask();
	}
};

submitButton.addEventListener("click", () => {
	addTask();
	taskInput.value = "";
	taskInput.focus();
});

taskInput.addEventListener("keyup", (event) => {
	if (event.key === "Enter") {
		addTask();
		taskInput.value = "";
	}
});

deleteButton.addEventListener("click", () => {
	const task = document.querySelector(
		`.sidebar p:nth-child(${taskList.currentTaskIndex + 2})`
	);

	if(taskList.tasks.length > 1){
		textNode.textContent =
		taskList.tasks[(taskList.currentTaskIndex + 1) % taskList.tasks.length];
	}
	else{
		textNode.textContent = "";
		buttons.hidden = true;
	}
	
	taskList.tasks.splice(taskList.currentTaskIndex, 1);
	localStorage.setItem("taskList", JSON.stringify(taskList));

	const currentlyHighlightedTask = document.querySelector(".highlight");
	if (currentlyHighlightedTask) {
		currentlyHighlightedTask.classList.remove("highlight");
	}

	sidebar.removeChild(task);

	if (taskList.currentTaskIndex === taskList.tasks.length) {
		taskList.currentTaskIndex = 0;
	}
	const taskToHighlight = document.querySelector(
		`.sidebar p:nth-child(${taskList.currentTaskIndex + 2})`
	);
	if (taskToHighlight) {
		taskToHighlight.classList.add("highlight");
	}
});

nextButton.addEventListener("click", () => {
	taskList.currentTaskIndex =
		(taskList.currentTaskIndex + 1) % taskList.tasks.length;
	localStorage.setItem("taskList", JSON.stringify(taskList));
	textNode.textContent = taskList.tasks[taskList.currentTaskIndex];

	highlightCurrentTask();
});
