import { Task } from "./task";

var allTasks = [];

const content = document.getElementById("content");

// Testing - temp
allTasks[0] = new Task("Task One", "This is the first desc", "2024-10-27", 3);
allTasks[1] = new Task("Task Two", "This is the second desc", "2024-10-28", 3);
allTasks[2] = new Task("Task Three", "This is the third desc", "2024-11-03", 2);
allTasks[3] = new Task("Task Four", "This is the fourth desc", "2024-10-31", 2);

// Displays all tasks for today
function displayTodayTasks () {

    var todayTasks = [];
    var todayDate = new Date();

    for (let i = 0; i < allTasks.length; i++) {
        var tempDate = new Date(allTasks[i].dueDate)
        if (tempDate.getDate() === todayDate.getDate() && tempDate.getMonth() === todayDate.getMonth() && tempDate.getFullYear() === todayDate.getFullYear()) {
            todayTasks[todayTasks.length] = allTasks[i];
        }
    }

    for (let j = 0; j < todayTasks.length; j++) {
        todayTasks[j].displayTask(content);
    }

}

// Displays all tasks for this week
function displayThisWeekTasks () {
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
        weekTasks[j].displayTask(content);
    }
}

// Displays all tasks
function displayAllTasks () {
    for(let i = 0; i < allTasks.length; i++) {
        allTasks[i].displayTask(content);
    }
}

// Save the current task state to localStorage
function saveAllTasks(task) {

}

// Saves the given task locally
function saveTask(task) {

}

// Delete the given task
function deleteTask(task) {

}

export { displayTodayTasks, displayThisWeekTasks, displayAllTasks };