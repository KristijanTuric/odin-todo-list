import { Task } from "./task";

const monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var allTasks = [];
var displayMode = 0;

// Get the main content element
const content = document.getElementById("content");
const contentTitle = document.getElementById("contentTitle");

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
    contentTitle.textContent = "Today Tasks";

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
    contentTitle.textContent = "Current Week Tasks";

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
    contentTitle.textContent = "All Tasks";

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

// Sort the current task array by dueDate
function sortTasks() {
    for (var i = 0; i < allTasks.length; i++) {
        for (var j = i+1; j < allTasks.length; j++) {
            var firstDate = new Date(allTasks[i].dueDate);
            var secondDate = new Date(allTasks[j].dueDate);
            if (secondDate < firstDate) {
                var temp = allTasks[i];
                allTasks[i] = allTasks[j];
                allTasks[j] = temp;
            }
        }
    }
}

// Clears the view and displays the tasks accordingly
function refreshDisplay() {
    // Clear the view
    while (content.hasChildNodes()) {
        content.removeChild(content.lastChild);
    }

    sortTasks();

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
        newDial.style.display = "flex";
        newDial.style.flexDirection = "column";
        newDial.style.alignItems = "center";
        newDial.style.padding = "10px";
        newDial.style.border = "none";
        newDial.style.width = "max-content";

        const dialTitle = document.createElement("div");
        dialTitle.textContent = title;
        dialTitle.style.fontSize = "x-large";
        dialTitle.style.marginBottom = "10px";
        newDial.appendChild(dialTitle);

        const buttonsDiv = document.createElement("div");

        const closeBtn = document.createElement("button");
        closeBtn.className = "button-rounded";
        closeBtn.style.backgroundColor = "red";
        closeBtn.textContent = "No";
        closeBtn.style.fontSize = "x-large";
        closeBtn.style.marginRight = "20px";
        buttonsDiv.appendChild(closeBtn);

        const confirmBtn = document.createElement("button");
        confirmBtn.className = "button-rounded";
        confirmBtn.textContent = "Yes"
        confirmBtn.style.fontSize = "x-large";
        buttonsDiv.appendChild(confirmBtn);

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

        newDial.appendChild(buttonsDiv);

        content.appendChild(newDial);
        newDial.showModal();
    });
}

// Display the given task
function displayTask(task) {

    const newDiv = document.createElement("div");
    newDiv.style.borderRadius = "8px";
    newDiv.style.height = "max-content";
    newDiv.style.width = "max-content";
    newDiv.style.maxWidth = "400px";
    newDiv.style.padding = "20px";
    newDiv.style.display = "flex";
    newDiv.style.flexDirection = "column";
    newDiv.style.alignItems = "center";
    newDiv.style.justifyContent = "center";
    newDiv.style.backgroundColor = "#F6EFA6";

    const firstRow = document.createElement("div");
    firstRow.style.display = "flex";
    firstRow.style.width = "100%";
    firstRow.style.justifyContent = "space-between";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.height = "20px";
    checkbox.style.width = "20px";
    checkbox.style.marginRight = "10px";
    firstRow.appendChild(checkbox);

    const titleDiv = document.createElement("div");
    titleDiv.textContent = task.title;
    titleDiv.style.fontWeight = "bold";
    titleDiv.style.marginRight = "10px"
    titleDiv.style.cursor = "pointer";
    titleDiv.style.userSelect = "none";
    firstRow.appendChild(titleDiv);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.style.display = "flex";
    buttonsDiv.style.flexDirection = "row";

    const editDiv = document.createElement("button");
    editDiv.className = "fa fa-pencil-square-o taskButtons";
    buttonsDiv.appendChild(editDiv);

    const deleteDiv = document.createElement("button");
    deleteDiv.className = "fa fa-times taskButtons";
    buttonsDiv.appendChild(deleteDiv);

    firstRow.appendChild(buttonsDiv);

    deleteDiv.addEventListener('click', () => {
        deleteTask(task);
    });

    editDiv.addEventListener('click', () => {
        editTaskDialog(task);
    });

    titleDiv.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
    });

    // Change task style depending on checkbox state
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            titleDiv.style.textDecoration = "line-through";
            newDiv.style.backgroundColor = "lightgreen";
            titleDiv.style.backgroundColor = "inherit";
        }
        else {
            titleDiv.style.textDecoration = "none";
            newDiv.style.backgroundColor = "#F6EFA6";
        }
    });    

    newDiv.appendChild(firstRow);

    const descriptionDiv = document.createElement("div");
    descriptionDiv.style.marginTop = "20px";
    descriptionDiv.textContent = task.description;
    descriptionDiv.style.textWrap = "wrap";
    newDiv.appendChild(descriptionDiv);

    const dueDateDiv = document.createElement("div");
    dueDateDiv.style.border = "1px solid black";
    dueDateDiv.style.padding = "5px";
    dueDateDiv.style.color = "white";
    dueDateDiv.style.backgroundColor = "black";
    dueDateDiv.style.borderRadius = "15px";
    dueDateDiv.style.fontWeight = "bold";
    dueDateDiv.style.userSelect = "none";
    dueDateDiv.style.marginTop = "20px";

    const taskDueDate = new Date(task.dueDate);
    const todayDate = new Date();

    // Set the status of the task
    if (taskDueDate.getDate() === todayDate.getDate() && taskDueDate.getMonth() === todayDate.getMonth() && taskDueDate.getFullYear() === todayDate.getFullYear()) {
        dueDateDiv.textContent = "Today";
    }
    else if (taskDueDate.getDate() === (todayDate.getDate() + 1) && taskDueDate.getMonth() === todayDate.getMonth() && taskDueDate.getFullYear() === todayDate.getFullYear()) {
        dueDateDiv.textContent = "Tomorrow";
    }
    else if (taskDueDate.getFullYear() < todayDate.getFullYear())
    {
        dueDateDiv.textContent = "Expired";
    }
    else if (taskDueDate.getFullYear() == todayDate.getFullYear() && taskDueDate.getMonth() < todayDate.getMonth()) {
        dueDateDiv.textContent = "Expired";
    }
    else if (taskDueDate.getFullYear() == todayDate.getFullYear() && taskDueDate.getMonth() == todayDate.getMonth() && taskDueDate.getDate() < todayDate.getDate()) {
        dueDateDiv.textContent = "Expired";
    }
    else {
        dueDateDiv.textContent = monthsLong[taskDueDate.getMonth()] + " " + taskDueDate.getDate() + ", " + taskDueDate.getFullYear();
    }

    newDiv.appendChild(dueDateDiv);

    content.appendChild(newDiv);
}

//#endregion

export { displayTodayTasks, displayThisWeekTasks, displayAllTasks, newTaskDialog };