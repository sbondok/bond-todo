import {
  AppElement,
  TaskListElement,
  inputElement,
  progressFillElement,
  progressTextElement,
} from "./elements";
import {
  AddTask,
  DeleteTask,
  EditTask,
  FetchData,
  InitDataOnStartup,
  InitTaskList,
  Key,
  RenderEmptyState,
  RenderTaskList,
  SaveToDB,
  ToggleDarkMode,
  ToggleTask,
  UpdateProgress,
} from "./types";

// XSS Sanitizer Helper
export const escapeHTML = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Safe LocalStorage Fetcher with Default Fallbacks
export const fetchData: FetchData = (key: Key): any => {
  const data = localStorage.getItem(key);
  if (!data) {
    return key === "tasks" ? [] : false;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return key === "tasks" ? [] : false;
  }
};

// Save helper
export const saveToDB: SaveToDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Theme Toggle
export const toggleDarkMode: ToggleDarkMode = () => {
  if (!AppElement) return;
  AppElement.classList.toggle("App--isDark");
  saveToDB("darkModeFlag", AppElement.classList.contains("App--isDark"));
};

// Real-time Progress Bar Calculation
export const updateProgress: UpdateProgress = (tasks) => {
  if (!progressFillElement || !progressTextElement) return;
  
  const total = tasks.length;
  const completed = tasks.filter((t) => t.isCompleted).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressFillElement.style.width = `${percentage}%`;
  progressTextElement.textContent = `${completed} من ${total} مهام مكتملة (${percentage}%)`;
};

// HTML Renderer for Task List
export const renderTaskList: RenderTaskList = (tasks) => {
  if (!TaskListElement) return;
  
  let taskListHTML = "";

  tasks.forEach((task, index) => {
    taskListHTML += `
    <li class="TaskList__taskContent${task.isCompleted ? " TaskList__taskContent--isActive" : ""}" data-index="${index}">
      <div class="TaskList__checkbox" tabindex="0" role="button" aria-label="تحديد المهمة كمكتملة" data-index="${index}">
        <svg class="TaskList__checkboxIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div class="TaskList__valueContent">
        <span class="TaskList__value" tabindex="0" title="انقر مزدوجاً للتعديل" data-index="${index}">
          ${escapeHTML(task.value)}
        </span>
      </div>
      <div class="TaskList__actions">
        <button class="TaskList__actionBtn TaskList__actionBtn--edit" data-index="${index}" aria-label="تعديل المهمة">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button class="TaskList__actionBtn TaskList__actionBtn--delete" data-index="${index}" aria-label="حذف المهمة">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>`;
  });

  TaskListElement.innerHTML = taskListHTML;
  if (inputElement) {
    inputElement.value = "";
    inputElement.focus();
  }
};

// Render Empty List View
export const renderEmptyState: RenderEmptyState = () => {
  if (!TaskListElement) return;
  TaskListElement.innerHTML = `
    <li class="EmptyList">
      <svg class="EmptyList__img" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
      <p class="EmptyList__text">قائمة المهام فارغة تماماً</p>
      <p class="EmptyList__subtext">أضف مهمتك الأولى بالأعلى للبدء في التخطيط ليومك!</p>
    </li>`;
};

// Initialize or Render tasks list and calculate progress
export const initTaskList: InitTaskList = (tasks) => {
  if (tasks && tasks.length) {
    renderTaskList(tasks);
  } else {
    renderEmptyState();
  }
  updateProgress(tasks);
};

// Add Task Logic
export const addTask: AddTask = (e) => {
  e.preventDefault();
  if (!inputElement) return;
  
  const taskValue = inputElement.value.trim();
  if (!taskValue) return;

  const task = {
    value: taskValue,
    isCompleted: false,
  };

  const tasks = fetchData("tasks");
  tasks.push(task);
  
  saveToDB("tasks", tasks);
  initTaskList(tasks);
};

// Delete Task Logic with Custom Clean Flow
export const deleteTask: DeleteTask = (index) => {
  const answer = confirm("هل أنت متأكد من رغبتك في حذف هذه المهمة؟");
  if (!answer) return;

  const tasks = fetchData("tasks");
  tasks.splice(index, 1);
  
  saveToDB("tasks", tasks);
  initTaskList(tasks);
};

// Toggle Task Completion State
export const toggleTask: ToggleTask = (index) => {
  const tasks = fetchData("tasks");
  if (!tasks[index]) return;

  tasks[index].isCompleted = !tasks[index].isCompleted;
  
  saveToDB("tasks", tasks);
  initTaskList(tasks);
};

// Edit Task Logic
export const editTask: EditTask = (index, value) => {
  const tasks = fetchData("tasks");
  const trimmedValue = value.trim();
  
  if (!trimmedValue) {
    // If user deleted the text, ask if they want to delete the task entirely
    deleteTask(index);
    return;
  }

  tasks[index].value = trimmedValue;
  saveToDB("tasks", tasks);
  initTaskList(tasks);
};

// Startup Logic Initialization
export const initDataOnStartup: InitDataOnStartup = () => {
  const isDarkMode = fetchData("darkModeFlag");
  if (isDarkMode && AppElement) {
    AppElement.classList.add("App--isDark");
  }
  
  const tasks = fetchData("tasks");
  initTaskList(tasks);
};
