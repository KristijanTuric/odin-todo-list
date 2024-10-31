import "./style.css";
import { Task } from "./task";
import { displayAllTasks, displayThisWeekTasks, displayTodayTasks } from "./allTasks";

//#region Side Navigation

const openSideNav = document.getElementById("openSideNav");
openSideNav.addEventListener('click', () => {
    document.getElementById("sidenav").style.width = "250px";
})

const closeSideNav = document.getElementById("closeSideNav");
closeSideNav.addEventListener('click', () => {
    document.getElementById("sidenav").style.width = "0px";
})

//#endregion 

//#region Display different tasks

const content = document.getElementById("content");

const todayTasks = document.getElementById("todayButton");
const weekTasks = document.getElementById("weekButton");
const allTasks = document.getElementById("allButton");

todayTasks.addEventListener('click', () => {
    clearAllChildren(content);
    displayTodayTasks();
});

weekTasks.addEventListener('click', () => {
    clearAllChildren(content);
    displayThisWeekTasks();
});

allTasks.addEventListener('click', () => {
    clearAllChildren(content);
    displayAllTasks();
});

//#endregion

//#region Footer

const footerIcon = document.getElementById("footerIcon");
footerIcon.addEventListener('click',() => {
    window.open("https://github.com/KristijanTuric/odin-todo-list", '_blank').focus();
})

//#endregion

//#region Helper Function

// Clears all children of the given element
function clearAllChildren (element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
    }
}

//#endregion