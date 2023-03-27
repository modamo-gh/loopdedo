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

	const newTask = new Task(currentList.tasks.length + 1, taskInput.value);
	currentList.tasks.push(newTask);
	localStorage.setItem(currentList.name, JSON.stringify(currentList));

	items.appendChild(newTask.createPElement());

	if (currentList.tasks.length === 1) {
		populateCurrentTaskDiv(taskInput.value);
		highlightCurrentTask();
	}
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
	let cl = currentList;
	const sameList = new List(cl.name, cl.currentTaskIndex, cl.tasks);
	if(sameList.type === "List"){
		debugger;
		return getCurrentTask(sameList.tasks[sameList.currentTaskIndex]);
	}
	else{
		return sameList.tasks[sameList.currentTaskIndex].value;
	}
}

const highlightCurrentTask = () => {
	const currentlyHighlightedTask = document.querySelector(".highlight");
	if (currentlyHighlightedTask) {
		currentlyHighlightedTask.classList.remove("highlight");
	}

	const taskToHighlight = document.querySelector(
		`.items p:nth-child(${currentList.currentTaskIndex + 1})`
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
	listInput.value = "";
	taskInput.disabled = false;
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

const updateLists = () => {
	lists.forEach(listName => {
		const list = JSON.parse(localStorage.getItem(listName));
		
		const numberOfItems = list.tasks.length;

		for(let itemIndex = 0; itemIndex < numberOfItems; itemIndex++){
			if(list.tasks[itemIndex].type === "List"){
				list.tasks[itemIndex] = retrieveList(list.tasks[itemIndex]);
				localStorage.setItem(list.name, JSON.stringify(list));
			}
		}
	})
}

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
		highlightCurrentTask();
		
		if(currentList.tasks.length){
			populateCurrentTaskDiv(currentList.tasks[currentList.currentTaskIndex].value);
		}
		else{
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
		updateLists();
		taskInput.value = "";
	} else if (newSelect.value === "list") {
		const newList = new List(listInput.value, 0, []);
		currentList.tasks.push(newList);
		localStorage.setItem(currentList.name, JSON.stringify(currentList));
		localStorage.setItem(newList.getName(), JSON.stringify(newList));
		lists.push(newList.name);
		localStorage.setItem("lists", JSON.stringify(lists));
		addNewListOption(newList.getName());
		items.append(newList.createH3Element());
		listInput.value = "";
	}

	highlightCurrentTask();
});

deleteButton.addEventListener("click", () => {
	const task = document.querySelector(
		`.sidebar p:nth-child(${currentList.currentTaskIndex + 1})`
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

	const currentlyHighlightedTask = document.querySelector(".highlight");
	if (currentlyHighlightedTask) {
		currentlyHighlightedTask.classList.remove("highlight");
	}

	items.removeChild(task);

	if (currentList.currentTaskIndex === currentList.tasks.length) {
		currentList.currentTaskIndex = 0;
	}
	const taskToHighlight = document.querySelector(
		`.sidebar p:nth-child(${currentList.currentTaskIndex + 1})`
	);
	if (taskToHighlight) {
		taskToHighlight.classList.add("highlight");
	}
});

nextButton.addEventListener("click", () => {
	currentList.currentTaskIndex =
		(currentList.currentTaskIndex + 1) % currentList.tasks.length;
	localStorage.setItem(currentList.name, JSON.stringify(currentList));
	
	console.log(getCurrentTask(currentList))
	textNode.textContent = getCurrentTask(currentList);

	highlightCurrentTask();
});
