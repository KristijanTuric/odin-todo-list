import { Task } from "./task";

var allTasks = [];
var displayMode = 0;

// Get the main content element
const content = document.getElementById("content");

// Check if any tasks exist
if (localStorage.getItem('allTasks') === null) {
    var tempTasks = [];
}
else {
    var tempTasks = JSON.parse(localStorage.getItem('allTasks'));
    for (let i = 0; i < tempTasks.length; i++) {
        allTasks[i] = new Task(tempTasks[i].title, tempTasks[i].description, tempTasks[i].dueDate, tempTasks[i].priority);
    }
}

// Shows all tasks on website load
window.onload = refreshDisplay();

//#region Filtering tasks

// Displays all tasks for today
function displayTodayTasks () {
    displayMode = 2;

    var todayTasks = [];
    var todayDate = new Date();

    for (let i = 0; i < allTasks.length; i++) {
        var tempDate = new Date(allTasks[i].dueDate)
        if (tempDate.getDate() === todayDate.getDate() && tempDate.getMonth() === todayDate.getMonth() && tempDate.getFullYear() === todayDate.getFullYear()) {
            todayTasks[todayTasks.length] = allTasks[i];
        }
    }

    for (let j = 0; j < todayTasks.length; j++) {
        displayTask(todayTasks[j]);
    }

}

// Displays all tasks for this week
function displayThisWeekTasks () {
    displayMode = 1;

    var todayDate = new Date();

    var first = new Date(todayDate);
    first.setDate(todayDate.getDate() - todayDate.getDay() + (todayDate.getDay() === 0 ? -6 : 1));

    var last = new Date(first);
    last.setDate(first.getDate() + 6);

    var weekTasks = [];

    for (let i = 0; i < allTasks.length; i++) {
        var tempDate = new Date(allTasks[i].dueDate)
        if (tempDate.getDate() === first.getDate() && tempDate.getMonth() === first.getMonth() && tempDate.getFullYear() === first.getFullYear() || tempDate.getTime() > first.getTime() && tempDate.getTime() < last.getTime()) {
            weekTasks[weekTasks.length] = allTasks[i];
        }
    }

    for (let j = 0; j < weekTasks.length; j++) {
        displayTask(weekTasks[j]);
    }
}

// Displays all tasks
function displayAllTasks () {
    displayMode = 0;

    for(let i = 0; i < allTasks.length; i++) {
        displayTask(allTasks[i]);
    }
}

//#endregion

//#region Task helper functions

// Create a new task and save it into local storage
function createNewTask(title, description, dueDate, priority) {
    var newTask = new Task(title, description, dueDate, priority);
    allTasks[allTasks.length] = newTask;
    saveAllTasks();
}

// Saves the given task
function saveNewTask(task) {
    allTasks[allTasks.length] = task;
    saveAllTasks();
}

// Clears the view and displays the tasks accordingly
function refreshDisplay() {
    // Clear the view
    while (content.hasChildNodes()) {
        content.removeChild(content.lastChild);
    }
            
    // Update the view depending on which tasks were displayed
    if (displayMode === 0) displayAllTasks();
    else if (displayMode === 1) displayThisWeekTasks();
    else if (displayMode === 2) displayTodayTasks();
}

// New task dialog
function newTaskDialog() {
    const newTaskDial = document.createElement("dialog");

    newTaskDial.style.width = "20vw";
    newTaskDial.style.display = "flex";
    newTaskDial.style.flexDirection = "column";

    const dialogTitle = document.createElement("div");
    dialogTitle.textContent = "New Task";
    newTaskDial.append(dialogTitle);    

    // Title
    const titleLbl = document.createElement("label");
    titleLbl.textContent = "Title";
    newTaskDial.append(titleLbl);

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    newTaskDial.append(titleInput);

    // Description
    const descLbl = document.createElement("label");
    descLbl.textContent = "Description";
    newTaskDial.append(descLbl);

    const descInput = document.createElement("input");
    descInput.type = "text";
    newTaskDial.append(descInput);

    // Due Date
    const dueDateLbl = document.createElement("label");
    dueDateLbl.textContent = "Due Date";
    newTaskDial.append(dueDateLbl);

    const dueDateInput = document.createElement("input");
    dueDateInput.type = "date";
    var tempToday = new Date();
    dueDateInput.min = tempToday.getFullYear() + "-" + (tempToday.getMonth() + 1).toString() + "-" + tempToday.getDate();
    newTaskDial.append(dueDateInput);
    
    // Priority
    const priorityLbl = document.createElement("label");
    priorityLbl.textContent = "Priority";
    newTaskDial.append(priorityLbl);

    const priorityInput = document.createElement("input");
    priorityInput.type = "number";
    newTaskDial.append(priorityInput);

    // Buttons
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Cancel";
    newTaskDial.appendChild(closeBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "Add Task"
    newTaskDial.appendChild(confirmBtn);

    closeBtn.addEventListener('click', () => {
        newTaskDial.close();
        newTaskDial.remove();
    });

    confirmBtn.addEventListener('click', () => {

        // Check if all fields are filled
        if (titleInput.value == "" || descInput.value == "" || dueDateInput.value == "" || priorityInput.value == "") {
            alert("Please fill out all the fields with the correct values.");
        }
        else {
            var tempTask = new Task(titleInput.value, descInput.value, dueDateInput.value, priorityInput.value);

            saveNewTask(tempTask);
            newTaskDial.close();
            newTaskDial.remove();

            refreshDisplay();
        }

    });

    content.appendChild(newTaskDial);
    newTaskDial.showModal();
}

// Edit task dialog
function editTaskDialog(task) {
    const newTaskDial = document.createElement("dialog");

    newTaskDial.style.width = "20vw";
    newTaskDial.style.display = "flex";
    newTaskDial.style.flexDirection = "column";

    const dialogTitle = document.createElement("div");
    dialogTitle.textContent = "Edit Task";
    newTaskDial.append(dialogTitle);    

    // Title
    const titleLbl = document.createElement("label");
    titleLbl.textContent = "Title";
    newTaskDial.append(titleLbl);

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = task.title;
    newTaskDial.append(titleInput);

    // Description
    const descLbl = document.createElement("label");
    descLbl.textContent = "Description";
    newTaskDial.append(descLbl);

    const descInput = document.createElement("input");
    descInput.type = "text";
    descInput.value = task.description;
    newTaskDial.append(descInput);

    // Due Date
    const dueDateLbl = document.createElement("label");
    dueDateLbl.textContent = "Due Date";
    newTaskDial.append(dueDateLbl);

    const dueDateInput = document.createElement("input");
    dueDateInput.type = "date";
    dueDateInput.value = task.dueDate;
    var tempToday = new Date();
    dueDateInput.min = tempToday.getFullYear() + "-" + (tempToday.getMonth() + 1).toString() + "-" + tempToday.getDate();
    newTaskDial.append(dueDateInput);
    
    // Priority
    const priorityLbl = document.createElement("label");
    priorityLbl.textContent = "Priority";
    newTaskDial.append(priorityLbl);

    const priorityInput = document.createElement("input");
    priorityInput.type = "number";
    priorityInput.value = task.priority;
    newTaskDial.append(priorityInput);

    // Buttons
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Cancel";
    newTaskDial.appendChild(closeBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "Save"
    newTaskDial.appendChild(confirmBtn);

    closeBtn.addEventListener('click', () => {
        newTaskDial.close();
        newTaskDial.remove();
    });

    confirmBtn.addEventListener('click', () => {
        // Check if all fields are filled
        if (titleInput.value == "" || descInput.value == "" || dueDateInput.value == "" || priorityInput.value == "") {
            alert("Please fill out all the fields with the correct values.");
        }
        else {
            task.title = titleInput.value;
            task.description = descInput.value;
            task.dueDate = dueDateInput.value;
            task.priority = priorityInput.value;

            saveAllTasks();

            newTaskDial.close();
            newTaskDial.remove();

            refreshDisplay();
        }
    });

    content.appendChild(newTaskDial);
    newTaskDial.showModal();
}

// Save the current task state to localStorage
function saveAllTasks() {
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
}

// Delete the given task
async function deleteTask(task) {

    const userRespnose = await displayDialog("Are you sure?");

    if (userRespnose === "No") return;

    allTasks.splice(allTasks.indexOf(task), 1);

    refreshDisplay();

    saveAllTasks();
}

// Confirmation dialog for deleting tasks
function displayDialog(title) {
    return new Promise((resolve) => {
        const newDial = document.createElement("dialog");

        const dialTitle = document.createElement("div");
        dialTitle.textContent = title;
        newDial.appendChild(dialTitle);

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "No";
        newDial.appendChild(closeBtn);

        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "Yes"
        newDial.appendChild(confirmBtn);

        closeBtn.addEventListener('click', () => {
            newDial.close();
            newDial.remove();
            resolve("No");
        });

        confirmBtn.addEventListener('click', () => {
            newDial.close();
            newDial.remove();
            resolve("Yes");
        });

        content.appendChild(newDial);
        newDial.showModal();
    });
}

// Display the given task
function displayTask(task) {
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
    titleDiv.textContent = task.title;
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

    deleteDiv.addEventListener('click', () => {
        deleteTask(task);
    });

    editDiv.addEventListener('click', () => {
        editTaskDialog(task);
    });

    newDiv.appendChild(deleteDiv);

    content.appendChild(newDiv);
}

//#endregion

export { displayTodayTasks, displayThisWeekTasks, displayAllTasks, newTaskDialog };