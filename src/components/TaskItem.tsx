'use client';

import React, { memo, useMemo } from 'react';
import { Task, TaskStatus, TaskPriority } from '../models/Task';

interface TaskItemProps {
    task: Task;
    onToggleStatus: (taskId: string) => void;
    onDelete: (taskId: string) => void;
    onUpdate: (task: Task) => void;
}

const CheckIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
            clipRule="evenodd"
        />
    </svg>
);

const TrashIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
            fillRule="evenodd"
            d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 0 0-.5.827c.098.501.206.997.325 1.487a.75.75 0 0 0 .7.602h11.58a.75.75 0 0 0 .702-.602c.119-.49.227-.986.325-1.487a.75.75 0 0 0-.501-.827c-.781-.122-1.57-.221-2.365-.298v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.5.66 1.5 1.5v.25h-3V5.5c0-.84.66-1.5 1.5-1.5ZM6.625 13.5a.75.75 0 0 0 .75.75h5.25a.75.75 0 0 0 .75-.75V7.5a.75.75 0 0 0-1.5 0v5.25H7.375V7.5a.75.75 0 0 0-1.5 0v6ZM4.336 6.327l.214 10.203A1.5 1.5 0 0 0 6.046 18h7.908a1.5 1.5 0 0 0 1.496-1.47l.214-10.203H4.336Z"
            clipRule="evenodd"
        />
    </svg>
);

const CalendarIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path
            fillRule="evenodd"
            d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
            clipRule="evenodd"
        />
    </svg>
);

const priorityClasses: Record<TaskPriority, { text: string; bg: string; border: string }> = {
    [TaskPriority.High]: {
        text: 'text-priority-high',
        bg: 'bg-priority-high/10',
        border: 'border-priority-high/50',
    },
    [TaskPriority.Medium]: {
        text: 'text-priority-medium',
        bg: 'bg-priority-medium/10',
        border: 'border-priority-medium/50',
    },
    [TaskPriority.Low]: {
        text: 'text-priority-low',
        bg: 'bg-priority-low/10',
        border: 'border-priority-low/50',
    },
};

const priorityLabels: Record<TaskPriority, string> = {
    [TaskPriority.High]: 'Alta',
    [TaskPriority.Medium]: 'Média',
    [TaskPriority.Low]: 'Baixa',
};

function TaskItemDisplay({ task, onToggleStatus, onDelete }: TaskItemProps) {
    const { id, title, description, status, priority, dueDate } = task;

    const isCompleted = status === TaskStatus.Completed;

    const formattedDueDate = useMemo(() => {
        if (!dueDate) return null;
        try {
            const date = new Date(dueDate);
            return new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                timeZone: 'UTC',
            }).format(date);
        } catch {
            return null;
        }
    }, [dueDate]);

    const priorityStyle = priorityClasses[priority] || priorityClasses.medium;

    return (
        <li className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-start">
            <div className="flex flex-1 items-start gap-3">
                <button
                    type="button"
                    onClick={() => onToggleStatus(id)}
                    className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 ${isCompleted
                            ? 'border-priority-low bg-priority-low text-white'
                            : 'border-text-secondary/50 bg-transparent text-transparent'
                        }`}
                    aria-label={isCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}
                >
                    {CheckIcon}
                </button>

                <div className="flex flex-1 flex-col gap-1">
                    <span
                        className={`text-base font-medium text-text-primary transition-colors ${isCompleted ? 'text-text-secondary line-through' : ''
                            }`}
                    >
                        {title}
                    </span>
                    {description && (
                        <p className={`text-sm text-text-secondary ${isCompleted ? 'line-through' : ''}`}>
                            {description}
                        </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span
                            className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text} border ${priorityStyle.border}`}
                        >
                            Prioridade: {priorityLabels[priority]}
                        </span>
                        {formattedDueDate && (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                                {CalendarIcon}
                                Vence em: {formattedDueDate}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={() => onDelete(id)}
                className="ml-auto flex-shrink-0 rounded-md p-1.5 text-text-secondary opacity-60 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 hover:opacity-100 sm:ml-4"
                aria-label="Deletar tarefa"
            >
                {TrashIcon}
            </button>
        </li>
    );
}

export const TaskItem = memo(TaskItemDisplay);