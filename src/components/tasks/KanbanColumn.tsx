'use client';

import React, { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../../models/Task';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
    id: string;
    title: string;
    tasks: Task[];
    onDelete: (taskId: string) => void;
    onEdit: (task: Task) => void;
    onOpenDetail: (task: Task) => void; // NOVO
}

const EmptyState = () => (
    <div className="flex flex-1 items-center justify-center rounded-md border-2 border-dashed border-opacity-50 p-4 text-center">
        <p className="text-sm text-text-secondary">Arraste tarefas aqui</p>
    </div>
);

function KanbanColumnDisplay({ id, title, tasks, onDelete, onEdit, onOpenDetail }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`flex h-full min-h-[400px] w-full flex-col gap-4 rounded-lg border bg-background-start p-4 transition-colors ${isOver ? 'bg-primary-accent/5' : ''
                }`}
        >
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-sm font-medium text-text-secondary data-[theme=dark]:bg-white/10">
                    {tasks.length}
                </span>
            </div>

            <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <ul className="flex flex-1 flex-col gap-3">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onOpenDetail={onOpenDetail} // NOVO
                        />
                    ))}
                    {tasks.length === 0 && !isOver && <EmptyState />}
                </ul>
            </SortableContext>
        </div>
    );
}

export const KanbanColumn = memo(KanbanColumnDisplay);