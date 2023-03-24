import { Task } from "./task.js";

const addNewListOption = (list) => {
	const listOption = document.createElement("option");
	listOption.value = list;
	listOption.textContent = list;
	currentListSelect.appendChild(listOption);
}

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

const populateCurrentListSelect = () => {
	lists.forEach(list => {
		addNewListOption(list);
	});
}
const populateSidebar = () => {
	taskList.tasks.forEach((task) => {
		const sameTask = new Task(task.id, task.value);
		sidebar.append(sameTask.createPElement());
	});
};

const retrieveLists = () => {
	if (!localStorage.getItem("lists")) {
		const lists = [];
		console.log(lists);
		localStorage.setItem("lists", JSON.stringify(lists));

		return lists;
	} else {
		return JSON.parse(localStorage.getItem("lists"));
	}
};

const retrieveTasks = () => {
	if (!localStorage.getItem("taskList")) {
		const newList = new List("Default", 0, []);
		
		localStorage.setItem("taskList", JSON.stringify(newList));
		lists.push(newList.name);
		localStorage.setItem("lists", JSON.stringify(lists));

		return newList;
	} else {
		return JSON.parse(localStorage.getItem("taskList"));
		
	}
};

const lists = retrieveLists();

const currentListSelect = document.querySelector("#currentList");

const taskList = retrieveTasks();
const sidebar = document.querySelector(".sidebar");

populateCurrentListSelect();
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
	populateCurrentTaskDiv(taskList.tasks[taskList.currentTaskIndex].value);
	highlightCurrentTask();
}
const newSelect = document.querySelector("#new");
const listInput = document.querySelector("#list");
const taskInput = document.querySelector("#task");

const submitButton = document.querySelector(".submitButton");

const addTask = () => {
	if (taskInput.value.trim() === "") {
		return;
	}

	const newTask = new Task(taskList.tasks.length + 1, taskInput.value);
	taskList.tasks.push(newTask);
	localStorage.setItem("taskList", JSON.stringify(taskList));

	const sidebar = document.querySelector(".sidebar");

	sidebar.appendChild(newTask.createPElement());

	if (taskList.tasks.length === 1) {
		populateCurrentTaskDiv(taskInput.value);
		highlightCurrentTask();
	}
};

newSelect.addEventListener("click", () => {
	if (newSelect.value === "list") {
		listInput.disabled = false;
		taskInput.disabled = true;
	} else if (newSelect.value === "task") {
		listInput.disabled = true;
		taskInput.disabled = false;
	}
});

taskInput.addEventListener("keyup", (event) => {
	if (event.key === "Enter") {
		addTask();
	}
});

submitButton.addEventListener("click", () => {
	const newSelect = document.querySelector("#new");
	if (newSelect.value === "task") {
		addTask();
		taskInput.value = "";
	}
	else if(newSelect.value === "list"){
		const newList = new List(listInput.value, 0, []);
		taskList.tasks.push(newList);
		localStorage.setItem("taskList", JSON.stringify(taskList));
		lists.push(newList.name);
		localStorage.setItem("lists", JSON.stringify(lists));
		addNewListOption(newList.name);
	}
});

deleteButton.addEventListener("click", () => {
	const task = document.querySelector(
		`.sidebar p:nth-child(${taskList.currentTaskIndex + 2})`
	);

	if (taskList.tasks.length > 1) {
		textNode.textContent =
			taskList.tasks[
				(taskList.currentTaskIndex + 1) % taskList.tasks.length
			].value;
	} else {
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
	textNode.textContent = taskList.tasks[taskList.currentTaskIndex].value;

	highlightCurrentTask();
});
