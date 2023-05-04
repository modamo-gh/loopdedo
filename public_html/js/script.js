import { List } from "./list.js";
import { Task } from "./task.js";

const addNewListOption = (listName) => {
	const listOption = document.createElement("option");
	listOption.value = listName;
	listOption.textContent = listName;
	chooseListSelect.appendChild(listOption);
};

const addTask = () => {
	if (taskInput.value.trim() === "") {
		return;
	}

	const newTask = new Task(
		currentList.tasks.length + 1,
		taskInput.value,
		currentList.name
	);
	addTaskToCurrentList(newTask);
	updateLists();

	items.appendChild(newTask.createPElement());

	if (currentList.tasks.length === 1) {
		displayCurrentTask(taskInput.value);
		highlightCurrentTask(getCurrentTaskID(currentList));
	}
};

const addTaskToCurrentList = (task) => {
	currentList.tasks.push(task);
	localStorage.setItem(currentList.name, JSON.stringify(currentList));
};

const clearSidebar = () => {
	const currentItems = items.childNodes;

	for (let itemIndex = currentItems.length - 1; itemIndex >= 0; itemIndex--) {
		items.removeChild(currentItems[itemIndex]);
	}
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
};

const getCurrentTask = (currentList) => {
	const currentItem = currentList.tasks[currentList.currentTaskIndex];
	let currentTask;
	if (currentItem) {
		if (currentItem.type === "List") {
			currentTask = getCurrentTask(currentItem);
		} else {
			currentTask = currentList.tasks[currentList.currentTaskIndex];
		}

		return currentTask;
	}
};

const getCurrentTaskID = (currentList) => {
	const currentItem = currentList.tasks[currentList.currentTaskIndex];
	let currentTaskID;
	if (currentItem) {
		if (currentItem.type === "List") {
			currentTaskID = getCurrentTaskID(currentItem);
		} else {
			currentTaskID = `${currentList.name}-${
				currentList.tasks[currentList.currentTaskIndex].id
			}`;
		}

		return currentTaskID;
	}
};

const highlightCurrentTask = (currentTaskID) => {
	const currentlyHighlightedTask = document.querySelector(".highlight");
	if (currentlyHighlightedTask) {
		currentlyHighlightedTask.classList.remove("highlight");
	}

	const taskToHighlight = document.querySelector(
		`p[data-id=${currentTaskID}]`
	);
	if (taskToHighlight) {
		taskToHighlight.classList.add("highlight");
	}
};

const displayCurrentTask = (taskValue) => {
	textNode.textContent = taskValue;
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
			const sameTask = new Task(item.id, item.value, list.name);
			items.appendChild(sameTask.createPElement());
		} else if (item.type === "List") {
			let sameList = new List(
				item.name,
				item.currentTaskIndex,
				item.tasks
			);

			items.appendChild(sameList.createH3Element());
			sameList = retrieveList(sameList);

			populateSidebar(sameList);
		}
	});
};

const resetForm = () => {
	chooseListSelect.selectedIndex = 0;
	newSelect.disabled = false;
	newSelect.selectedIndex = 0;
	listInput.value = "";
	taskInput.disabled = false;
	taskInput.value = "";
};

const retrieveList = (currentList) => {
	return JSON.parse(localStorage.getItem(currentList.name));
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

const updateCurrentTaskIndex = (currentList) => {
	currentList.currentTaskIndex =
		(currentList.currentTaskIndex + 1) % currentList.tasks.length;
	localStorage.setItem(currentList.name, JSON.stringify(currentList));

	if (currentList.tasks[currentList.currentTaskIndex].type === "List") {
		const subList = currentList.tasks[currentList.currentTaskIndex];
		updateCurrentTaskIndex(subList);
	}
};

const updateLists = () => {
	lists.forEach((listName) => {
		const list = JSON.parse(localStorage.getItem(listName));

		const numberOfItems = list.tasks.length;

		for (let itemIndex = 0; itemIndex < numberOfItems; itemIndex++) {
			if (list.tasks[itemIndex].type === "List") {
				list.tasks[itemIndex] = retrieveList(list.tasks[itemIndex]);
				localStorage.setItem(list.name, JSON.stringify(list));
			}
		}
	});
};

const items = document.querySelector(".items");
const currentListHeader = document.querySelector("h2");
const chooseListSelect = document.querySelector("#chooseList");
const newSelect = document.querySelector("#new");
const listInput = document.querySelector("#list");
const taskInput = document.querySelector("#task");
const submitButton = document.querySelector(".submitButton");
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

const lists = retrieveLists();

let currentList;

populateCurrentListSelect();

chooseListSelect.addEventListener("click", () => {
	if (
		chooseListSelect.value !== "select" &&
		chooseListSelect.value !== "create"
	) {
		newSelect.disabled = false;
		taskInput.disabled = false;

		currentListHeader.textContent = chooseListSelect.value;

		if (
			chooseListSelect.value === "Default" &&
			!localStorage.getItem("Default")
		) {
			const defaultList = new List("Default", 0, []);
			localStorage.setItem(
				defaultList.getName(),
				JSON.stringify(defaultList)
			);
			currentList = defaultList;
		} else {
			currentList = JSON.parse(
				localStorage.getItem(chooseListSelect.value)
			);
		}

		clearSidebar();
		populateSidebar(currentList);
		highlightCurrentTask(getCurrentTaskID(currentList));

		if (currentList.tasks.length) {
			displayCurrentTask(
				getCurrentTask(currentList).value
			);
		} else {
			textNode.textContent = "";
			buttons.hidden = true;
		}
	} else if (chooseListSelect.value === "create") {
		newSelect.disabled = true;
		listInput.disabled = false;
		taskInput.disabled = true;
	} else {
		resetForm();
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
	else if(event.key === " "){
		listInput.value = listInput.value.slice(0, -1);
		listInput.value += "-";
	}
});

taskInput.addEventListener("keyup", (event) => {
	if (event.key === "Enter") {
		addTask();
		resetForm();
	}
});

submitButton.addEventListener("click", () => {
	if (chooseListSelect.value === "create") {
		const newList = createNewList();

		addNewListOption(newList.getName());
	} else if (newSelect.value === "task") {
		addTask();
		updateLists();
	} else if (newSelect.value === "list") {
		const newList = new List(listInput.value, 0, []);
		currentList.tasks.push(newList);
		localStorage.setItem(currentList.name, JSON.stringify(currentList));
		localStorage.setItem(newList.getName(), JSON.stringify(newList));
		lists.push(newList.name);
		localStorage.setItem("lists", JSON.stringify(lists));
		addNewListOption(newList.getName());
		items.append(newList.createH3Element());
	}

	resetForm();
	highlightCurrentTask(getCurrentTaskID(currentList));
});

deleteButton.addEventListener("click", () => {
	const task = document.querySelector(
		`p[data-id=${getCurrentTaskID(currentList)}]`
	);

	if (currentList.tasks.length > 1) {
		textNode.textContent =
			currentList.tasks[
				(currentList.currentTaskIndex + 1) % currentList.tasks.length
			].value;
	} else {
		textNode.textContent = "";
		buttons.hidden = true;
	}

	currentList.tasks.splice(currentList.currentTaskIndex, 1);
	localStorage.setItem(currentList.name, JSON.stringify(currentList));
	updateLists();

	const currentlyHighlightedTask = document.querySelector(".highlight");
	if (currentlyHighlightedTask) {
		currentlyHighlightedTask.classList.remove("highlight");
	}

	items.removeChild(task);

	if (currentList.currentTaskIndex === currentList.tasks.length) {
		currentList.currentTaskIndex = 0;
	}
	const taskToHighlight = document.querySelector(
		`p[data-id=${getCurrentTaskID(currentList)}]`
	);
	if (taskToHighlight) {
		taskToHighlight.classList.add("highlight");
	}
});

nextButton.addEventListener("click", () => {
	updateCurrentTaskIndex(currentList);
	updateLists();

	textNode.textContent = getCurrentTask(currentList).value;
	highlightCurrentTask(getCurrentTaskID(currentList));
});
