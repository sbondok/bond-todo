import {
  TaskListElement,
  TaskListLink,
  darkThemeToggleElement,
  taskFormElement,
} from "./elements";
import { InitListeners } from "./types";
import {
  addTask,
  deleteTask,
  editTask,
  fetchData,
  initTaskList,
  toggleDarkMode,
  toggleTask,
} from "./utils";

// In-place Editing activator
const enterEditMode = (index: number, spanElement: HTMLElement) => {
  const valueContent = spanElement.parentElement;
  if (!valueContent) return;

  const originalValue = spanElement.textContent?.trim() || "";
  
  const input = document.createElement("input");
  input.type = "text";
  input.className = "TaskList__valueInput";
  input.value = originalValue;
  input.setAttribute("data-index", index.toString());
  
  valueContent.innerHTML = "";
  valueContent.appendChild(input);
  
  // Highlight and focus the input field
  input.focus();
  input.select();
  
  let isDone = false;
  
  const saveChange = () => {
    if (isDone) return;
    isDone = true;
    editTask(index, input.value);
  };
  
  const cancelChange = () => {
    if (isDone) return;
    isDone = true;
    // Restore state from LocalStorage by re-initializing the list
    initTaskList(fetchData("tasks"));
  };
  
  input.addEventListener("blur", saveChange);
  
  input.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveChange();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelChange();
    }
  });
};

// Main Global Event Listeners Binder
export const initListeners: InitListeners = () => {
  // 1. Dark Mode Toggle Click
  darkThemeToggleElement?.addEventListener("click", toggleDarkMode);

  // 2. Submit Task Form (supports both Button Click and Enter Key out-of-the-box!)
  if (taskFormElement) {
    taskFormElement.addEventListener("submit", addTask);
  }

  // 3. Filter Completed Tasks toggle link
  TaskListLink?.addEventListener("click", () => {
    TaskListElement?.classList.toggle("TaskList__list--hideCompleted");
    TaskListLink?.classList.toggle("TaskList__link--isActive");
  });

  // 4. PERFORMANCE UPGRADE: Event Delegation on TaskListElement Clicks
  TaskListElement?.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;

    // Checkbox Click
    const checkbox = target.closest(".TaskList__checkbox") as HTMLElement;
    if (checkbox) {
      const index = parseInt(checkbox.getAttribute("data-index") ?? "", 10);
      if (!isNaN(index)) {
        toggleTask(index);
      }
      return;
    }

    // Delete Button Click
    const deleteBtn = target.closest(".TaskList__actionBtn--delete") as HTMLElement;
    if (deleteBtn) {
      const index = parseInt(deleteBtn.getAttribute("data-index") ?? "", 10);
      if (!isNaN(index)) {
        deleteTask(index);
      }
      return;
    }

    // Edit Button Click
    const editBtn = target.closest(".TaskList__actionBtn--edit") as HTMLElement;
    if (editBtn) {
      const index = parseInt(editBtn.getAttribute("data-index") ?? "", 10);
      const li = editBtn.closest("li");
      const spanValue = li?.querySelector(".TaskList__value") as HTMLElement;
      if (!isNaN(index) && spanValue) {
        enterEditMode(index, spanValue);
      }
      return;
    }
  });

  // 5. UX UPGRADE: Event Delegation for Double Click to Edit Task
  TaskListElement?.addEventListener("dblclick", (e: Event) => {
    const target = e.target as HTMLElement;
    const spanValue = target.closest(".TaskList__value") as HTMLElement;
    if (spanValue) {
      const index = parseInt(spanValue.getAttribute("data-index") ?? "", 10);
      if (!isNaN(index)) {
        enterEditMode(index, spanValue);
      }
    }
  });

  // 6. ACCESSIBILITY (A11y): Toggle Task Completion with focused Keyboard Enter / Space
  TaskListElement?.addEventListener("keydown", (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const checkbox = target.closest(".TaskList__checkbox") as HTMLElement;
    if (checkbox && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      const index = parseInt(checkbox.getAttribute("data-index") ?? "", 10);
      if (!isNaN(index)) {
        toggleTask(index);
      }
    }
  });
};
