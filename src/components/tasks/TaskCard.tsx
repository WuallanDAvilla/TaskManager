'use client';

import React, { memo, useMemo } from 'react';
import { Task, TaskPriority } from '../../models/Task';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
    task: Task;
    onDelete: (taskId: string) => void;
    onEdit: (task: Task) => void;
    onOpenDetail: (task: Task) => void; // NOVO
}

// ... (Ícones permanecem os mesmos)
const CalendarIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" /></svg>;
const EditIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793ZM11.379 5.793l-2.828 2.828-1.768-1.768-2.828 2.828.707.707 1.768 1.768-3.535 3.535a.75.75 0 0 0 0 1.06l.53.53a.75.75 0 0 0 1.06 0l3.535-3.535 1.768 1.768.707.707 2.828-2.828-1.768-1.768 2.828-2.828-2.121-2.121Z" /></svg>;
const TrashIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 0 0-.5.827c.098.501.206.997.325 1.487a.75.75 0 0 0 .7.602h11.58a.75.75 0 0 0 .702-.602c.119-.49.227-.986.325-1.487a.75.75 0 0 0-.501-.827c-.781-.122-1.57-.221-2.365-.298v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.5.66 1.5 1.5v.25h-3V5.5c0-.84.66-1.5 1.5-1.5ZM6.625 13.5a.75.75 0 0 0 .75.75h5.25a.75.75 0 0 0 .75-.75V7.5a.75.75 0 0 0-1.5 0v5.25H7.375V7.5a.75.75 0 0 0-1.5 0v6ZM4.336 6.327l.214 10.203A1.5 1.5 0 0 0 6.046 18h7.908a1.5 1.5 0 0 0 1.496-1.47l.214-10.203H4.336Z" clipRule="evenodd" /></svg>;
const DragHandleIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-1.5 0V3.75A.75.75 0 0 1 10 3ZM5.75 5.75a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Zm0 3a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Zm0 3a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" clipRule="evenodd" /></svg>;
const CheckListIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" clipRule="evenodd" /></svg>;


const priorityClasses: Record<TaskPriority, { border: string }> = {
    [TaskPriority.High]: { border: 'border-l-priority-high' },
    [TaskPriority.Medium]: { border: 'border-l-priority-medium' },
    [TaskPriority.Low]: { border: 'border-l-priority-low' },
};

function TaskCardDisplay({ task, onDelete, onEdit, onOpenDetail }: TaskCardProps) {
    const { id, title, description, priority, dueDate, subtasks } = task;

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const formattedDueDate = useMemo(() => {
        if (!dueDate) return null;
        try {
            const date = new Date(dueDate);
            return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }).format(date);
        } catch {
            return null;
        }
    }, [dueDate]);

    // NOVO: Calcula sub-tarefas
    const subtaskCompletion = useMemo(() => {
        if (!subtasks || subtasks.length === 0) return null;
        const completed = subtasks.filter(st => st.isCompleted).length;
        const total = subtasks.length;
        return `${completed}/${total}`;
    }, [subtasks]);

    const priorityStyle = priorityClasses[priority] || priorityClasses.medium;

    return (
        <li
            ref={setNodeRef}
            style={style}
            onClick={() => onOpenDetail(task)} // NOVO: Click principal
            className={`group relative flex cursor-pointer flex-col gap-2 rounded-lg border bg-card-background p-3 shadow-card transition-shadow data-[theme=dark]:shadow-card-dark ${priorityStyle.border
                } border-l-4 ${isDragging ? 'z-10 opacity-70 shadow-2xl' : ''}`}
        >
            <div className="flex items-start justify-between">
                <span className="flex-1 pr-1 text-base font-medium text-text-primary">{title}</span>
                <button
                    {...attributes}
                    {...listeners}
                    type="button"
                    onClick={(e) => e.stopPropagation()} // NOVO: Impede que o "arrastar" abra o modal
                    className="cursor-grab touch-none rounded-md p-1 text-text-secondary/50 transition-colors hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-accent"
                    aria-label="Arrastar tarefa"
                >
                    {DragHandleIcon}
                </button>
            </div>

            {description && <p className="line-clamp-2 text-sm text-text-secondary">{description}</p>}

            <div className="flex items-center gap-4">
                {formattedDueDate && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                        {CalendarIcon}
                        {formattedDueDate}
                    </span>
                )}
                {subtaskCompletion && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                        {CheckListIcon}
                        {subtaskCompletion}
                    </span>
                )}
            </div>

            <div className="absolute right-2 top-10 flex scale-90 items-center gap-1 rounded-md border bg-background-start p-1 opacity-0 shadow-sm transition-all group-hover:scale-100 group-hover:opacity-100">
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onEdit(task); }} // NOVO: Impede que o "editar" abra o modal
                    className="rounded-md p-1.5 text-text-secondary transition-colors hover:text-text-primary"
                    aria-label="Editar tarefa"
                >
                    {EditIcon}
                </button>
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(id); }} // NOVO: Impede que o "deletar" abra o modal
                    className="rounded-md p-1.5 text-text-secondary transition-colors hover:text-red-500"
                    aria-label="Deletar tarefa"
                >
                    {TrashIcon}
                </button>
            </div>
        </li>
    );
}

export const TaskCard = memo(TaskCardDisplay);