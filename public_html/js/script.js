import { Task } from "./task.js";

const addNewListOption = (listName) => {
	const listOption = document.createElement("option");
	listOption.value = listName;
	listOption.textContent = listName;
	chooseListSelect.appendChild(listOption);
};

const createNewList = () => {
	if (listInput.value.trim() === "") {
		return;
	}

	const newListName = listInput.value;
	const newList = new List(newListName, 0, []);
	localStorage.setItem(newList.getName(), JSON.stringify(newList));

	lists.push(newList.getName());
	localStorage.setItem("lists", JSON.stringify(lists));

	return newList;
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
	for (let listIndex = 1; listIndex < lists.length; listIndex++) {
		addNewListOption(lists[listIndex]);
	}
};

const populateSidebar = (list) => {
	list.tasks.forEach((item) => {
		if (item.type === "Task") {
			const sameTask = new Task(item.id, item.value);
			sidebar.append(sameTask.createPElement());
		} else {
			const sameList = new List(
				item.name,
				item.currentTaskIndex,
				item.tasks
			);
			sidebar.append(sameList.createH3Element());

			populateSidebar(item);
		}
	});
	// taskList.tasks.forEach((task) => {
	//
	// });
};

const resetForm = () => {
	chooseListSelect.selectedIndex = 0;
	newSelect.disabled = false;
	listInput.value = "";
	taskInput.disabled = false;
};

const retrieveLists = () => {
	if (!localStorage.getItem("lists")) {
		const lists = ["Default"];
		localStorage.setItem("lists", JSON.stringify(lists));

		return lists;
	} else {
		return JSON.parse(localStorage.getItem("lists"));
	}
};

const retrieveTasks = () => {
	return JSON.parse(localStorage.getItem("taskList"));
};

const sidebar = document.querySelector(".sidebar");
const currentListHeader = document.querySelector("h2");
const chooseListSelect = document.querySelector("#chooseList");
const newSelect = document.querySelector("#new");
const listInput = document.querySelector("#list");
const taskInput = document.querySelector("#task");
const submitButton = document.querySelector(".submitButton");

const lists = retrieveLists();

const taskList = retrieveTasks();

populateCurrentListSelect();
// populateSidebar(taskList);

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

// if (taskList.tasks.length) {
// 	populateCurrentTaskDiv(taskList.tasks[taskList.currentTaskIndex].value);
// 	highlightCurrentTask();
// }

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

chooseListSelect.addEventListener("click", () => {
	if (
		chooseListSelect.value !== "select" &&
		chooseListSelect.value !== "create"
	) {
		currentListHeader.textContent = chooseListSelect.value;

		if (
			chooseListSelect.value === "Default" &&
			!localStorage.getItem("Default")
		) {
			const defaultList = new List("Default", 0, []);
			localStorage.setItem("Default", JSON.stringify(defaultList));
			populateSidebar(defaultList);
		} else {
			const selectedList = JSON.parse(
				localStorage.getItem(chooseListSelect.value)
			);

			populateSidebar(selectedList);
		}
	} else if (chooseListSelect.value === "create") {
		newSelect.disabled = true;
		taskInput.disabled = true;
	}
});

newSelect.addEventListener("click", () => {
	if (newSelect.value === "list") {
		listInput.disabled = false;
		taskInput.disabled = true;
	} else if (newSelect.value === "task") {
		listInput.disabled = true;
		taskInput.disabled = false;
	}
});

listInput.addEventListener("keyup", (event) => {
	if (event.key === "Enter") {
		if (chooseListSelect.value === "create") {
			const newList = createNewList();
			addNewListOption(newList.getName());
			resetForm();
		}
	}
});

taskInput.addEventListener("keyup", (event) => {
	if (event.key === "Enter") {
		addTask();
		taskInput.value = "";
	}
});

submitButton.addEventListener("click", () => {
	if (chooseListSelect.value === "create") {
		const newList = createNewList();

		addNewListOption(newList.getName());

		resetForm();
	} else if (newSelect.value === "task") {
		addTask();
		taskInput.value = "";
	} else if (newSelect.value === "list") {
		const newList = new List(listInput.value, 0, []);
		taskList.tasks.push(newList);
		localStorage.setItem("taskList", JSON.stringify(taskList));
		localStorage.setItem(newList.getName(), JSON.stringify(newList));
		lists.push(newList.name);
		localStorage.setItem("lists", JSON.stringify(lists));
		addNewListOption(newList.getName());
		sidebar.append(newList.createH3Element());
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
