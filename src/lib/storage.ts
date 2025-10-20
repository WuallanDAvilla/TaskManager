import { Task } from "@/models/Task";

type TaskJson = ReturnType<Task["toJSON"]>;

export const Storage = {
  STORAGE_KEY: "tasks",

  saveTasks(tasks: TaskJson[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }
  },

  loadTasks(): TaskJson[] {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
    return [];
  },

  clear() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  },
};
