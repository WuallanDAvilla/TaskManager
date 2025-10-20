export enum TaskPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

// NOVO: Status mais granulares para o Kanban
export enum TaskStatus {
  Backlog = "backlog",
  InProgress = "in-progress",
  InReview = "in-review",
  Completed = "completed",
}

export enum FilterStatus {
  All = "all",
  Pending = "pending",
  Completed = "completed",
}

// NOVA: Interface para Sub-tarefas
export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus; // Atualizado
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  authorId: string;
  contextId: string;
  subtasks: Subtask[]; // Adicionado
}
