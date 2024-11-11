const newTaskInput = document.getElementById('new-task');
const dueDateInput = document.getElementById('due-date');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const clearCompletedButton = document.getElementById('clear-completed');
const remainingTasks = document.querySelector('.remaining-tasks');

let tasks = [];

// Load tasks from local storage on page load
function loadTasks() {
  try {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

// Save tasks to local storage
function saveTasks() {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}

function addTask() {
  const taskName = newTaskInput.value.trim();
  const dueDate = new Date(dueDateInput.value);

  if (!taskName) {
    alert('Please enter a task name.');
    return;
  }

  if (dueDate < new Date()) {
    alert('Due date cannot be in the past. Please select a future date.');
    return;
  }

  const task = {
    id: Date.now(),
    name: taskName,
    completed: false,
    creationDate: new Date().toLocaleDateString(),
    dueDate: dueDate.toLocaleDateString(),
  };

  tasks.push(task);

  newTaskInput.value = '';
  dueDateInput.value = '';

  saveTasks();
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const taskElement = document.createElement('li');
    taskElement.setAttribute('data-id', task.id);
    taskElement.textContent = `${task.name} (Created: ${task.creationDate}, Due: ${task.dueDate})`;

    taskElement.classList.add('task');

    if (task.completed) {
      taskElement.classList.add('completed');
    }

    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.classList.add('complete-button');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');

    taskActions.appendChild(completeButton);
    taskActions.appendChild(deleteButton);

    taskElement.appendChild(taskActions);

    taskList.appendChild(taskElement);
  });

  updateRemainingTasks();
}

function updateTaskStatus(taskId, completed) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = completed;
    saveTasks();
    renderTasks();
  } else {
    console.warn('Task with ID', taskId, 'not found.');
  }
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

function updateRemainingTasks() {
  const remainingTasksCount = tasks.filter((task) => !task.completed).length;

  if (remainingTasksCount === 0) {
    remainingTasks.textContent = 'No remaining tasks';
  } else if (remainingTasksCount === 1) {
    remainingTasks.textContent = '1 remaining task';
  } else {
    remainingTasks.textContent = `${remainingTasksCount} remaining tasks`;
  }
}

addTaskButton.addEventListener('click', addTask);

newTaskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

taskList.addEventListener('click', (event) => {
  const target = event.target;

  if (target.classList.contains('complete-button')) {
    const taskId = target.closest('.task').getAttribute('data-id');
    updateTaskStatus(parseInt(taskId), true);
  }

  if (target.classList.contains('delete-button')) {
    const taskId = target.closest('.task').getAttribute('data-id');
    deleteTask(parseInt(taskId));
  }
});

clearCompletedButton.addEventListener('click', clearCompletedTasks);

loadTasks();
renderTasks();

window.addEventListener('beforeunload', () => {
  saveTasks();
});