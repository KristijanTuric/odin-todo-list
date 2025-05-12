// This module will contain the todo task object definition
class Task {
    constructor(title, description, dueDate, priority, completed, expired, project, repeat="never") {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        this.expired = expired;
        this.project = project;
        this.repeat = repeat;
    }
}

export { Task };