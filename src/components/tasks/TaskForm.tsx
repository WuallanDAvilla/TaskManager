'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { Task, TaskPriority, TaskStatus } from '../../models/Task';

interface TaskFormProps {
    taskToEdit?: Task;
    onAddTask?: (data: {
        title: string;
        description: string | null;
        priority: TaskPriority;
        dueDate: string | null;
        status: TaskStatus; // Adicionado
    }) => void;
    onEditTask?: (task: Task) => void;
    onDone?: () => void;
}

export function TaskForm({ taskToEdit, onAddTask, onEditTask, onDone }: TaskFormProps) {
    const isEditMode = !!taskToEdit;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.Backlog); // Atualizado
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditMode) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description || '');
            setPriority(taskToEdit.priority);
            setDueDate(taskToEdit.dueDate || '');
            setStatus(taskToEdit.status); // Atualizado
        }
    }, [isEditMode, taskToEdit]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (title.trim().length === 0) {
            setError('O título é obrigatório.');
            return;
        }

        if (isEditMode && onEditTask && taskToEdit) {
            const updatedTask: Task = {
                ...taskToEdit,
                title: title.trim(),
                description: description.trim().length > 0 ? description.trim() : null,
                priority: priority,
                dueDate: dueDate.length > 0 ? dueDate : null,
                status: status, // Atualizado
            };
            onEditTask(updatedTask);
        } else if (onAddTask) {
            onAddTask({
                title: title.trim(),
                description: description.trim().length > 0 ? description.trim() : null,
                priority: priority,
                dueDate: dueDate.length > 0 ? dueDate : null,
                status: status, // Atualizado
            });

            setTitle('');
            setDescription('');
            setPriority(TaskPriority.Medium);
            setDueDate('');
            setStatus(TaskStatus.Backlog); // Atualizado
        }

        setError(null);
        if (onDone) {
            onDone();
        }
    };

    const priorityClasses: Record<TaskPriority, string> = {
        [TaskPriority.High]: 'border-priority-high focus:border-priority-high focus:ring-priority-high',
        [TaskPriority.Medium]:
            'border-priority-medium focus:border-priority-medium focus:ring-priority-medium',
        [TaskPriority.Low]: 'border-priority-low focus:border-priority-low focus:ring-priority-low',
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex w-full flex-col gap-4 ${!isEditMode
                    ? 'rounded-lg border bg-card-background p-4 shadow-card data-[theme=dark]:shadow-card-dark sm:p-6'
                    : ''
                }`}
        >
            <h2 className="text-xl font-semibold text-text-primary">
                {isEditMode ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
            </h2>

            {error && <div className="rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</div>}

            <div className="flex flex-col">
                <label htmlFor="task-title" className="mb-1 text-sm font-medium text-text-secondary">
                    Título
                </label>
                <input
                    id="task-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="O que precisa ser feito?"
                    className="rounded-md border bg-transparent p-2 text-text-primary transition-colors focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="task-description" className="mb-1 text-sm font-medium text-text-secondary">
                    Descrição (Opcional)
                </label>
                <textarea
                    id="task-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Adicione mais detalhes..."
                    rows={3}
                    className="rounded-md border bg-transparent p-2 text-text-primary transition-colors focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50"
                />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 flex-col">
                    <label htmlFor="task-priority" className="mb-1 text-sm font-medium text-text-secondary">
                        Prioridade
                    </label>
                    <select
                        id="task-priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as TaskPriority)}
                        className={`rounded-md border-2 bg-transparent p-2 text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${priorityClasses[priority]}`}
                    >
                        <option value={TaskPriority.High} className="text-text-primary">
                            Alta
                        </option>
                        <option value={TaskPriority.Medium} className="text-text-primary">
                            Média
                        </option>
                        <option value={TaskPriority.Low} className="text-text-primary">
                            Baixa
                        </option>
                    </select>
                </div>

                <div className="flex flex-1 flex-col">
                    <label htmlFor="task-due-date" className="mb-1 text-sm font-medium text-text-secondary">
                        Data de Vencimento (Opcional)
                    </label>
                    <input
                        id="task-due-date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="rounded-md border bg-transparent p-2 text-text-primary transition-colors focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50"
                    />
                </div>
            </div>

            {/* NOVA Seção de Status */}
            <div className="flex flex-col">
                <label htmlFor="task-status" className="mb-1 text-sm font-medium text-text-secondary">
                    Status Inicial
                </label>
                <select
                    id="task-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="rounded-md border bg-transparent p-2 text-text-primary transition-colors focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50"
                >
                    <option value={TaskStatus.Backlog} className="text-text-primary">
                        Backlog (A Fazer)
                    </option>
                    <option value={TaskStatus.InProgress} className="text-text-primary">
                        Em Andamento
                    </option>
                    <option value={TaskStatus.InReview} className="text-text-primary">
                        Em Revisão
                    </option>
                    <option value={TaskStatus.Completed} className="text-text-primary">
                        Concluído
                    </option>
                </select>
            </div>

            <button
                type="submit"
                className="mt-2 rounded-md bg-primary-accent p-3 text-lg font-semibold text-white transition-colors duration-200 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-accent/50 focus:ring-offset-2"
            >
                {isEditMode ? 'Salvar Alterações' : 'Adicionar Tarefa'}
            </button>
        </form>
    );
}