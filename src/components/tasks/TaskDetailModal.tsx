'use client';

import React, { useState, useMemo, useCallback, FormEvent } from 'react';
import { Task, Subtask, TaskStatus, TaskPriority } from '../../models/Task';

interface TaskDetailModalProps {
    task: Task;
    onClose: () => void;
    onUpdateTask: (task: Task) => Promise<void>;
    onDeleteTask: (taskId: string) => Promise<void>;
}

// Ícones
const CloseIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const TrashIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 0 0-.5.827c.098.501.206.997.325 1.487a.75.75 0 0 0 .7.602h11.58a.75.75 0 0 0 .702-.602c.119-.49.227-.986.325-1.487a.75.75 0 0 0-.501-.827c-.781-.122-1.57-.221-2.365-.298v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.5.66 1.5 1.5v.25h-3V5.5c0-.84.66-1.5 1.5-1.5ZM6.625 13.5a.75.75 0 0 0 .75.75h5.25a.75.75 0 0 0 .75-.75V7.5a.75.75 0 0 0-1.5 0v5.25H7.375V7.5a.75.75 0 0 0-1.5 0v6ZM4.336 6.327l.214 10.203A1.5 1.5 0 0 0 6.046 18h7.908a1.5 1.5 0 0 0 1.496-1.47l.214-10.203H4.336Z" clipRule="evenodd" /></svg>;
const PlusIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>;

export function TaskDetailModal({ task, onClose, onUpdateTask, onDeleteTask }: TaskDetailModalProps) {
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

    // Calcula a porcentagem de conclusão
    const completion = useMemo(() => {
        if (!task.subtasks || task.subtasks.length === 0) {
            return { percent: 0, text: '0/0' };
        }
        const completed = task.subtasks.filter((st) => st.isCompleted).length;
        const total = task.subtasks.length;
        const percent = Math.round((completed / total) * 100);
        return { percent, text: `${completed}/${total}` };
    }, [task.subtasks]);

    // Função para ADICIONAR uma sub-tarefa
    const handleAddSubtask = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (newSubtaskTitle.trim().length === 0) return;

        const newSubtask: Subtask = {
            id: Date.now().toString(), // ID simples é suficiente para um sub-documento
            title: newSubtaskTitle.trim(),
            isCompleted: false,
        };

        const updatedTask: Task = {
            ...task,
            subtasks: [...task.subtasks, newSubtask],
        };

        await onUpdateTask(updatedTask);
        setNewSubtaskTitle('');
    }, [task, newSubtaskTitle, onUpdateTask]);

    // Função para ATUALIZAR (marcar) uma sub-tarefa
    const handleToggleSubtask = useCallback(async (subtaskId: string) => {
        const updatedSubtasks = task.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
        );

        const updatedTask: Task = { ...task, subtasks: updatedSubtasks };
        await onUpdateTask(updatedTask);
    }, [task, onUpdateTask]);

    // Função para DELETAR uma sub-tarefa
    const handleDeleteSubtask = useCallback(async (subtaskId: string) => {
        const updatedSubtasks = task.subtasks.filter((st) => st.id !== subtaskId);
        const updatedTask: Task = { ...task, subtasks: updatedSubtasks };
        await onUpdateTask(updatedTask);
    }, [task, onUpdateTask]);

    // Função para deletar a tarefa inteira
    const handleDeleteTaskConfirm = useCallback(async () => {
        if (window.confirm(`Tem certeza que deseja excluir a tarefa: "${task.title}"?`)) {
            await onDeleteTask(task.id);
            onClose();
        }
    }, [task.id, task.title, onDeleteTask, onClose]);

    // Funções para atualizar status e prioridade em tempo real
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as TaskStatus;
        onUpdateTask({ ...task, status: newStatus });
    };

    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPriority = e.target.value as TaskPriority;
        onUpdateTask({ ...task, priority: newPriority });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-20 backdrop-blur-sm overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl rounded-lg border bg-card-background p-6 shadow-card data-[theme=dark]:shadow-card-dark"
                onClick={(e) => e.stopPropagation()}
            >
                {/* CABEÇALHO DO MODAL */}
                <div className="flex items-start justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-text-primary">{task.title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1 text-text-secondary transition-colors duration-200 hover:bg-black/5 data-[theme=dark]:hover:bg-white/10"
                        aria-label="Fechar modal"
                    >
                        {CloseIcon}
                    </button>
                </div>

                {/* DESCRIÇÃO */}
                {task.description && (
                    <p className="mt-2 text-sm text-text-secondary">{task.description}</p>
                )}

                {/* STATUS E PRIORIDADE */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-text-secondary">Status</label>
                        <select
                            value={task.status}
                            onChange={handleStatusChange}
                            className="mt-1 w-full rounded-md border bg-transparent p-2 text-sm text-text-primary transition-colors focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50"
                        >
                            <option value={TaskStatus.Backlog}>Backlog</option>
                            <option value={TaskStatus.InProgress}>Em Andamento</option>
                            <option value={TaskStatus.InReview}>Em Revisão</option>
                            <option value={TaskStatus.Completed}>Concluído</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-text-secondary">Prioridade</label>
                        <select
                            value={task.priority}
                            onChange={handlePriorityChange}
                            className="mt-1 w-full rounded-md border bg-transparent p-2 text-sm text-text-primary transition-colors focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50"
                        >
                            <option value={TaskPriority.High}>Alta</option>
                            <option value={TaskPriority.Medium}>Média</option>
                            <option value={TaskPriority.Low}>Baixa</option>
                        </select>
                    </div>
                </div>


                {/* SUB-TAREFAS ("Caixas de Seleção") */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-text-primary">Checklist ({completion.text})</h3>

                    {/* Barra de Porcentagem */}
                    <div className="mt-2 h-2 w-full rounded-full bg-black/10 data-[theme=dark]:bg-white/10">
                        <div
                            className="h-2 rounded-full bg-primary-accent transition-all"
                            style={{ width: `${completion.percent}%` }}
                        />
                    </div>

                    {/* Lista de Sub-tarefas */}
                    <ul className="mt-3 flex flex-col gap-2">
                        {task.subtasks.map((subtask) => (
                            <li key={subtask.id} className="group flex items-center gap-3 rounded-md p-1 hover:bg-black/5 data-[theme=dark]:hover:bg-white/10">
                                <input
                                    type="checkbox"
                                    checked={subtask.isCompleted}
                                    onChange={() => handleToggleSubtask(subtask.id)}
                                    className="h-5 w-5 rounded border-gray-300 text-primary-accent focus:ring-primary-accent"
                                />
                                <span className={`flex-1 text-sm ${subtask.isCompleted ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                                    {subtask.title}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteSubtask(subtask.id)}
                                    className="text-text-secondary opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                                    aria-label="Deletar sub-tarefa"
                                >
                                    {TrashIcon}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Formulário de Adicionar Sub-tarefa */}
                    <form onSubmit={handleAddSubtask} className="mt-3 flex gap-2">
                        <input
                            type="text"
                            value={newSubtaskTitle}
                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                            placeholder="Adicionar item ao checklist..."
                            className="flex-1 rounded-md border bg-transparent p-2 text-sm text-text-primary transition-colors focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50"
                        />
                        <button
                            type="submit"
                            className="flex-shrink-0 rounded-md bg-primary-accent/10 p-2 text-primary-accent transition-colors hover:bg-primary-accent/20"
                            aria-label="Adicionar sub-tarefa"
                        >
                            {PlusIcon}
                        </button>
                    </form>
                </div>

                {/* Rodapé com Ações */}
                <div className="mt-6 border-t pt-4">
                    <button
                        type="button"
                        onClick={handleDeleteTaskConfirm}
                        className="text-sm font-medium text-red-500 transition-colors hover:text-red-700"
                    >
                        Excluir esta tarefa
                    </button>
                </div>
            </div>
        </div>
    );
}