// This module will contain the todo task object definition

class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    displayTask(content) {
        const newDiv = document.createElement("div");

        newDiv.style.borderRadius = "8px";
        newDiv.style.height = "30px";
        newDiv.style.width = "max-content";
        newDiv.style.border = "solid";
        newDiv.style.padding = "10px";
        newDiv.style.display = "flex";
        newDiv.style.flexDirection = "row";
        newDiv.style.alignItems = "center";
        newDiv.style.justifyContent = "center";
        newDiv.style.backgroundColor = "white";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        newDiv.appendChild(checkbox);

        const titleDiv = document.createElement("div");
        titleDiv.textContent = this.title;
        titleDiv.style.backgroundColor = "white";
        titleDiv.style.padding = "5px";
        titleDiv.style.borderRadius = "8px";
        titleDiv.style.fontWeight = "bold";
        titleDiv.style.marginRight = "5px"
        titleDiv.style.cursor = "pointer";

        newDiv.appendChild(titleDiv);

        const editDiv = document.createElement("button");
        editDiv.className = "fa fa-pencil-square-o taskButtons";

        newDiv.appendChild(editDiv);

        const deleteDiv = document.createElement("button");
        deleteDiv.className = "fa fa-times taskButtons";

        newDiv.appendChild(deleteDiv);

        content.appendChild(newDiv);
    }

}

export { Task };