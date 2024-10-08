import "./style.css";
import { Task } from "./task";

// Console testing
const newTask = new Task("The Title", "This will describe your task", "1/1/1996", 1);

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

//#region Footer

const footerIcon = document.getElementById("footerIcon");
footerIcon.addEventListener('click',() => {
    window.open("https://github.com/KristijanTuric/odin-todo-list", '_blank').focus();
})

//#endregion