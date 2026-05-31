export type InitListeners = () => void;

export type Task = {
  value: string;
  isCompleted: boolean;
};

export type Key = "tasks" | "darkModeFlag";

export interface FetchData {
  (key: "tasks"): Task[];
  (key: "darkModeFlag"): boolean;
}

export type ToggleDarkMode = () => void;
export type RenderTaskList = (tasks: Task[]) => void;
export type DeleteTask = (index: number) => void;
export type AddTask = (e: Event) => void;
export type EditTask = (index: number, value: string) => void;
export type SaveToDB = (key: Key, data: boolean | Task[]) => void;
export type InitDataOnStartup = () => void;
export type RenderEmptyState = () => void;
export type InitTaskList = (tasks: Task[]) => void;
export type ToggleTask = (index: number) => void;
export type UpdateProgress = (tasks: Task[]) => void;
