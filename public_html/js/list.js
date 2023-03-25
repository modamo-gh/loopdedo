class List {
    constructor(name, currentTaskIndex, tasks){
        this.name = name;
        this.currentTaskIndex = currentTaskIndex;
        this.tasks = tasks;
        this.type = "List";
    }

    createH3Element(){
        const h3 = document.createElement("h3");
        h3.textContent = this.name;

        return h3;
    }
}