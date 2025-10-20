export enum TaskPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export enum TaskStatus {
  Pending = "pending",
  Completed = "completed",
}

export enum FilterStatus {
  All = "all",
  Pending = "pending",
  Completed = "completed",
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  authorId: string;
  contextId: string;
}
