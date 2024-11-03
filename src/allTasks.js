import { Task } from "./task";

var allTasks = [];
var displayMode = 0;

/* For testing
allTasks[0] = new Task("Test One", "Test one Desc", "2024-11-03", 1);
allTasks[1] = new Task("Test Two", "Test two Desc", "2024-11-13", 1);
allTasks[2] = new Task("Test Three", "Test three Desc", "2024-11-05", 1);
allTasks[3] = new Task("Test Four", "Test four Desc", "2024-11-23", 1);
saveAllTasks();
*/

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

// Save the current task state to localStorage
function saveAllTasks() {
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
}

// Delete the given task
async function deleteTask(task) {

    const userRespnose = await displayDialog("Are you sure?");

    if (userRespnose === "No") return;

    allTasks.splice(allTasks.indexOf(task), 1);

    // Clear the view
    while (content.hasChildNodes()) {
        content.removeChild(content.lastChild);
    }

    // Update the view depending on which tasks were displayed
    if (displayMode === 0) displayAllTasks();
    else if (displayMode === 1) displayThisWeekTasks();
    else if (displayMode === 2) displayTodayTasks();

    saveAllTasks();
}

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
            resolve("No");
        });

        confirmBtn.addEventListener('click', () => {
            newDial.close();
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

    newDiv.appendChild(deleteDiv);

    content.appendChild(newDiv);
}

export { displayTodayTasks, displayThisWeekTasks, displayAllTasks };