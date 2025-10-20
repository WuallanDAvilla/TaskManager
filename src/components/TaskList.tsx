'use client';

import React, { memo } from 'react';
import { Task } from '../models/Task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
    tasks: Task[];
    onToggleTaskStatus: (taskId: string) => void;
    onDeleteTask: (taskId: string) => void;
    onUpdateTask: (task: Task) => void;
}

function TaskListDisplay({ tasks, onToggleTaskStatus, onDeleteTask, onUpdateTask }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-opacity-50 p-12 text-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-12 w-12 text-text-secondary opacity-50"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 6.75h7.5m-7.5 3h7.5m-7.5 3h7.5m3 3h3.375c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V19.5m-9.75-9.75H4.125M15 12H4.125m10.875 3H4.125"
                    />
                </svg>
                <h3 className="text-lg font-semibold text-text-primary">Nenhuma tarefa encontrada</h3>
                <p className="max-w-xs text-sm text-text-secondary">
                    Tente criar uma nova tarefa ou ajuste os filtros para ver seus itens.
                </p>
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-3 divide-y divide-border">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggleStatus={onToggleTaskStatus}
                    onDelete={onDeleteTask}
                    onUpdate={onUpdateTask}
                />
            ))}
        </ul>
    );
}

export const TaskList = memo(TaskListDisplay);