import { Task } from "./task";

//#region Initilzation stuff

const monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var allTasks = [];
var allProjects = [];
var displayMode = 0;

// Get the main content element
const content = document.getElementById("content");
const contentTitle = document.getElementById("contentTitle");
contentTitle.style.fontSize = "28px";

const projectsNav = document.getElementById("projectsnav");
const addProjectBtn = document.getElementById("addProjectBtn");

// Check if any tasks exist
const storedTasks = localStorage.getItem('allTasks');
allTasks = storedTasks ? JSON.parse(storedTasks).map(task => 
    new Task(task.title, task.description, task.dueDate, task.priority, task.completed, task.expired, task.project)
) : [];

// Check if any projects exist
allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];

// Shows all tasks and projects on website load
window.onload = function() {
    refreshDisplay();
    displayProjects();
}

//#endregion

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
        if (todayTasks[j].project === "General")
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
        if (weekTasks[j].project === "General")
            displayTask(weekTasks[j]);  
    }
}

// Displays all tasks
function displayAllTasks () {
    displayMode = 0;
    contentTitle.textContent = "All Tasks";

    for(let i = 0; i < allTasks.length; i++) {
        if (allTasks[i].project === "General")
            displayTask(allTasks[i]);
    }
}

//#endregion

//#region Task helper functions

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
    allTasksExpiredCheck();

    // Update the view depending on which tasks were displayed
    if (displayMode === 0) displayAllTasks();
    else if (displayMode === 1) displayThisWeekTasks();
    else if (displayMode === 2) displayTodayTasks();
}

function refreshProjectDisplay(project) {
    // Clear the view
    while (content.hasChildNodes()) {
        content.removeChild(content.lastChild);
    }

    sortTasks();
    allTasksExpiredCheck();

    displayProjectTasks(project);
}

// New task dialog
function newTaskDialog() {
    const newTaskDial = document.createElement("dialog");
    newTaskDial.className = "new-task-dialog";

    const dialogTitle = document.createElement("div");
    dialogTitle.textContent = "New Task";
    dialogTitle.style.fontSize = "larger";
    dialogTitle.style.fontWeight = "bold";
    dialogTitle.style.marginBottom = "10px";
    newTaskDial.append(dialogTitle);    

    // Title
    const titleLbl = document.createElement("label");
    titleLbl.textContent = "Title";
    newTaskDial.append(titleLbl);

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.placeholder = "Clean my room";
    titleInput.style.marginBottom = "8px";
    newTaskDial.append(titleInput);

    // Description
    const descLbl = document.createElement("label");
    descLbl.textContent = "Description";
    newTaskDial.append(descLbl);

    const descInput = document.createElement("input");
    descInput.type = "text";
    descInput.placeholder = "Don't forget to open the window";
    descInput.style.marginBottom = "8px";
    newTaskDial.append(descInput);

    // Due Date
    const dueDateLbl = document.createElement("label");
    dueDateLbl.textContent = "Due Date";
    newTaskDial.append(dueDateLbl);

    const dueDateInput = document.createElement("input");
    dueDateInput.type = "date";
    var tempToday = new Date();
    dueDateInput.min = tempToday.getFullYear() + "-" + (tempToday.getMonth() + 1).toString() + "-" + tempToday.getDate();
    dueDateInput.style.marginBottom = "8px";
    newTaskDial.append(dueDateInput);
    
    // Priority
    const priorityLbl = document.createElement("label");
    priorityLbl.textContent = "Priority";
    newTaskDial.append(priorityLbl);

    const priorityInput = document.createElement("input");
    priorityInput.type = "number";
    priorityInput.defaultValue = "3";
    priorityInput.min = "1";
    priorityInput.max = "3";
    priorityInput.style.marginBottom = "8px";
    newTaskDial.append(priorityInput);

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "button-group";


    // Buttons
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Cancel";
    closeBtn.className = "cancel-btn";
    buttonDiv.appendChild(closeBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "Add Task"
    confirmBtn.className = "save-btn";
    buttonDiv.appendChild(confirmBtn);

    newTaskDial.appendChild(buttonDiv);

    closeBtn.addEventListener('click', () => {
        newTaskDial.close();
        newTaskDial.remove();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key == 'Escape') {
            newTaskDial.close();
            newTaskDial.remove();
        }
    })

    confirmBtn.addEventListener('click', () => {

        // Check if all fields are filled
        if (titleInput.value == "" || descInput.value == "" || dueDateInput.value == "" || priorityInput.value == "") {
            alert("Please fill out all the fields with the correct values.");
        }
        else {

            if (allProjects.includes(contentTitle.textContent)) {
                var tempTask = new Task(titleInput.value, descInput.value, dueDateInput.value, priorityInput.value, false, false, contentTitle.textContent);
                saveNewTask(tempTask);
                refreshProjectDisplay(contentTitle.textContent);

            } else {
                var tempTask = new Task(titleInput.value, descInput.value, dueDateInput.value, priorityInput.value, false, false, "General");
                saveNewTask(tempTask);
                refreshDisplay();
            }


            newTaskDial.close();
            newTaskDial.remove();           
        }

    });

    // Make sure the user can't enter a priority outside of the range 1 to 3
    priorityInput.addEventListener('change', () => {
        if (priorityInput.value > 3) priorityInput.value = 3;
        else if (priorityInput.value < 1) priorityInput.value = 1;
    })

    content.appendChild(newTaskDial);
    newTaskDial.showModal();
}

// Edit task dialog
function editTaskDialog(task) {
    const editTaskDial = document.createElement("dialog");
    editTaskDial.className = "new-task-dialog";


    const dialogTitle = document.createElement("div");
    dialogTitle.textContent = "Edit Task";
    editTaskDial.append(dialogTitle);    

    // Title
    const titleLbl = document.createElement("label");
    titleLbl.textContent = "Title";
    editTaskDial.append(titleLbl);

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = task.title;
    editTaskDial.append(titleInput);

    // Description
    const descLbl = document.createElement("label");
    descLbl.textContent = "Description";
    editTaskDial.append(descLbl);

    const descInput = document.createElement("input");
    descInput.type = "text";
    descInput.value = task.description;
    editTaskDial.append(descInput);

    // Due Date
    const dueDateLbl = document.createElement("label");
    dueDateLbl.textContent = "Due Date";
    editTaskDial.append(dueDateLbl);

    const dueDateInput = document.createElement("input");
    dueDateInput.type = "date";
    dueDateInput.value = task.dueDate;
    var tempToday = new Date();
    dueDateInput.min = tempToday.getFullYear() + "-" + (tempToday.getMonth() + 1).toString() + "-" + tempToday.getDate();
    editTaskDial.append(dueDateInput);
    
    // Priority
    const priorityLbl = document.createElement("label");
    priorityLbl.textContent = "Priority";
    editTaskDial.append(priorityLbl);

    const priorityInput = document.createElement("input");
    priorityInput.type = "number";
    priorityInput.min = "1";
    priorityInput.max = "3";
    priorityInput.value = task.priority;
    editTaskDial.append(priorityInput);

    // Buttons
    const buttonDiv = document.createElement("div");
    buttonDiv.className = "button-group";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Cancel";
    closeBtn.className = "cancel-btn";
    buttonDiv.appendChild(closeBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.className = "save-btn";
    confirmBtn.textContent = "Save"
    buttonDiv.appendChild(confirmBtn);

    editTaskDial.appendChild(buttonDiv);

    closeBtn.addEventListener('click', () => {
        editTaskDial.close();
        editTaskDial.remove();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key == 'Escape') {
            editTaskDial.close();
            editTaskDial.remove();
        }
    })

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

            editTaskDial.close();
            editTaskDial.remove();

            refreshDisplay();
        }
    });

    // Make sure the user can't enter a priority outside of the range 1 to 3
    priorityInput.addEventListener('change', () => {
        if (priorityInput.value > 3) priorityInput.value = 3;
        else if (priorityInput.value < 1) priorityInput.value = 1;
    })

    content.appendChild(editTaskDial);
    editTaskDial.showModal();
}

// Save the current task state to localStorage
function saveAllTasks() {
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
}

// Confirmation dialog for deleting tasks
function displayDialog(title) {
    return new Promise((resolve) => {
        const newDial = document.createElement("dialog");
        newDial.className = "confirm-dialog";

        const dialTitle = document.createElement("h2");
        dialTitle.textContent = title;
        newDial.appendChild(dialTitle);

        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "button-group";

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "No";
        closeBtn.className = "no-btn";
        buttonsDiv.appendChild(closeBtn);

        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "Yes"
        confirmBtn.className = "yes-btn";
        buttonsDiv.appendChild(confirmBtn);

        closeBtn.addEventListener('click', () => {
            newDial.close();
            newDial.remove();
            resolve("No");
        });

        document.addEventListener('keydown', (event) => {
            if (event.key == 'Escape') {
                newDial.close();
                newDial.remove();
                resolve("No");
            }
        })

        confirmBtn.addEventListener('click', () => {
            newDial.close();
            newDial.remove();
            resolve("Yes");
        });

        newDial.appendChild(buttonsDiv);

        document.body.appendChild(newDial);
        newDial.showModal();

    });
}

// Delete the given task
async function deleteTask(task) {

    const userRespnose = await displayDialog("Are you sure?");

    if (userRespnose === "No") return;

    allTasks.splice(allTasks.indexOf(task), 1);

    if (task.project != "General") {
        refreshProjectDisplay(task.project);
    } else {
        refreshDisplay();
    }

    saveAllTasks();
}

async function removeExpiredTasks() {
    const userResponse = await displayDialog("Are you sure?");

    if (userResponse === "No") return;

    // Delete expired tasks
    allTasks = allTasks.filter(task => !task.expired || task.completed);

    saveAllTasks();
    refreshDisplay();
}

async function removeCompletedTasks() {
    const userResponse = await displayDialog("Are you sure?");

    if (userResponse === "No") return;

    // Delete completed tasks
    allTasks = allTasks.filter(task => !task.completed);

    saveAllTasks();
    refreshDisplay();
}

// Display the given task
function displayTask(task) {

    const newDiv = document.createElement("div");
    newDiv.className = "task-card";

    const taskHeader = document.createElement("div");
    taskHeader.className = "task-header";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    taskHeader.appendChild(checkbox);

    const titleStatusDiv = document.createElement("div");
    titleStatusDiv.className = "task-title-status";

    const titleDiv = document.createElement("h3");
    titleDiv.textContent = task.title;
    titleDiv.className = "task-title";
    titleStatusDiv.appendChild(titleDiv);

    const statusDiv = document.createElement("span");
    statusDiv.textContent = "In-progress";
    statusDiv.className = "task-status";
    titleStatusDiv.appendChild(statusDiv);

    taskHeader.appendChild(titleStatusDiv);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "task-buttons";

    const editDiv = document.createElement("button");
    editDiv.className = "fa fa-pencil-square-o taskButtons edit-btn";
    buttonsDiv.appendChild(editDiv);

    const deleteDiv = document.createElement("button");
    deleteDiv.className = "fa fa-times taskButtons delete-btn";
    buttonsDiv.appendChild(deleteDiv);

    taskHeader.appendChild(buttonsDiv);

    newDiv.appendChild(taskHeader);

    const descriptionDiv = document.createElement("div");
    descriptionDiv.textContent = task.description;
    descriptionDiv.className = "task-description";
    newDiv.appendChild(descriptionDiv);

    const dueDateDiv = document.createElement("div");
    dueDateDiv.className = "task-due-date";

    const taskDueDate = new Date(task.dueDate);
    const todayDate = new Date();

    // Set the status of the task

    if (task.completed){
        statusDiv.textContent = "Completed";
        dueDateDiv.textContent = monthsLong[taskDueDate.getMonth()] + " " + taskDueDate.getDate() + ", " + taskDueDate.getFullYear();
        checkbox.checked = true;
        titleDiv.style.textDecoration = "line-through";
        titleDiv.style.backgroundColor = "inherit";
        newDiv.classList.add("task-status-completed");

    }
    else {
        if (taskDueDate.getDate() === todayDate.getDate() && taskDueDate.getMonth() === todayDate.getMonth() && taskDueDate.getFullYear() === todayDate.getFullYear()) {
            dueDateDiv.textContent = "Today";
            newDiv.classList.add("task-status-today");
        }
        else if (taskDueDate.getDate() === (todayDate.getDate() + 1) && taskDueDate.getMonth() === todayDate.getMonth() && taskDueDate.getFullYear() === todayDate.getFullYear()) {
            dueDateDiv.textContent = "Tomorrow";
            newDiv.classList.add("task-status-upcoming");
        }
        else if (isExpired(task))
        {
            statusDiv.textContent = "Expired";
            newDiv.classList.add("task-status-expired");
            dueDateDiv.textContent = monthsLong[taskDueDate.getMonth()] + " " + taskDueDate.getDate() + ", " + taskDueDate.getFullYear();
        }
        else {
            dueDateDiv.textContent = monthsLong[taskDueDate.getMonth()] + " " + taskDueDate.getDate() + ", " + taskDueDate.getFullYear();
            newDiv.classList.add("task-status-upcoming");
        }    
    }

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
            task.completed = true;
            saveAllTasks();

            if (allProjects.includes(contentTitle.textContent))
                refreshProjectDisplay(contentTitle.textContent);
            else
                refreshDisplay();
        }
        else {
            titleDiv.style.textDecoration = "none";
            newDiv.style.backgroundColor = "#F6EFA6";
            task.completed = false;
            saveAllTasks();

            if (allProjects.includes(contentTitle.textContent))
                refreshProjectDisplay(contentTitle.textContent);
            else
                refreshDisplay();
        }
    });    
    
    newDiv.appendChild(dueDateDiv);

    content.appendChild(newDiv);
}

//#endregion

//#region Remove Buttons

const removeExpired = document.getElementById("removeExpired");
const removeCompleted = document.getElementById("removeCompleted");

removeExpired.addEventListener('click', () => {
    document.getElementById("sidenav").style.width = "0px";
    removeExpiredTasks();
});

removeCompleted.addEventListener('click', () => {   
    document.getElementById("sidenav").style.width = "0px";
    removeCompletedTasks();
});

//#endregion

//#region Expired Tasks Helper Functions

function isExpired(task) {
    const taskDueDate = new Date(task.dueDate);
    const todayDate = new Date();

    if (taskDueDate.getFullYear() < todayDate.getFullYear())
    {
        return true;
    }
    else if (taskDueDate.getFullYear() == todayDate.getFullYear() && taskDueDate.getMonth() < todayDate.getMonth()) 
    {
        return true;
    }
    else if (taskDueDate.getFullYear() == todayDate.getFullYear() && taskDueDate.getMonth() == todayDate.getMonth() && taskDueDate.getDate() < todayDate.getDate()) 
    {
        return true;
    } else {
        return false;
    }

}

function allTasksExpiredCheck() {
    for (let i = 0; i < allTasks.length; i++) {
        if (isExpired(allTasks[i]))
        {
            allTasks[i].expired = true;
        }
    }
}

//#endregion

//#region Projects

addProjectBtn.addEventListener('click', () => {

    addProjectBtn.remove();

    const newDiv = document.createElement("div");
    newDiv.className = "project-input-container";

    const projectNameInput = document.createElement("input");
    projectNameInput.type = "text";
    projectNameInput.placeholder = "Enter project name...";

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add";
    addBtn.className = "add-btn";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "cancel-btn";

    newDiv.appendChild(projectNameInput);
    buttonGroup.appendChild(addBtn);
    buttonGroup.appendChild(cancelBtn);
    newDiv.appendChild(buttonGroup);

    cancelBtn.addEventListener('click', () => {
        newDiv.remove();
        displayProjects();
    });

    addBtn.addEventListener('click', () => {
        // Validate input, add it to allProjects and refresh the display
        if (projectNameInput.value != "") {
            allProjects[allProjects.length] = projectNameInput.value;

            newDiv.remove();

            displayProjects();

            localStorage.setItem('allProjects', JSON.stringify(allProjects));
        } else {
            alert("Project name is empty!");
        }
    });

    projectsNav.appendChild(newDiv);
    projectNameInput.focus();
    
});

function displayProjects() {

    while (projectsNav.hasChildNodes()) {
        projectsNav.removeChild(projectsNav.lastChild);
    }

    projectsNav.textContent = "Projects";

    for (let i = 0; i < allProjects.length; i++) {
        displayProject(allProjects[i]);
    }

    projectsNav.appendChild(addProjectBtn);
}

function displayProject(project) {
    const projectDiv = document.createElement("div");
    projectDiv.style.display = "flex";

    const newProject = document.createElement("a");
    newProject.href = "#";
    newProject.textContent = project;

    const deleteProjectBtn = document.createElement("a");
    deleteProjectBtn.textContent = "x";

    projectDiv.appendChild(newProject);
    projectDiv.appendChild(deleteProjectBtn);

    projectsNav.appendChild(projectDiv);

    deleteProjectBtn.addEventListener('click', () => {

        deleteProject(project);
        
    });

    newProject.addEventListener('click', () => {
        contentTitle.textContent = newProject.textContent;

        // Refresh the screen with tasks that are associated with only this project
        refreshProjectDisplay(project);

        document.getElementById("sidenav").style.width = "0px";
    });
}

function displayProjectTasks(project) {
    for(let i = 0; i < allTasks.length; i++) {
        if (allTasks[i].project === project)
            displayTask(allTasks[i]);
    }
}

async function deleteProject(project) {
    const userRespnose = await displayDialog("Are you sure?");

    if (userRespnose === "No") return;

    allProjects.splice(allProjects.indexOf(project), 1);

    displayProjects();
    localStorage.setItem('allProjects', JSON.stringify(allProjects));
}

//#endregion

export { displayTodayTasks, displayThisWeekTasks, displayAllTasks, newTaskDialog };