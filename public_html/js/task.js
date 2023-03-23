class Task {
    constructor(value){
        this.id = 0;
        this.value = value;
    }

    getID(){
        return this.id;
    }

    getValue(){
        return this.value;
    }

    setID(newID){
        this.id = newID;
    }

    setValue(newValue){
        this.value = newValue;
    }
}