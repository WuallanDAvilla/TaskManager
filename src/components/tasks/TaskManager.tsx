'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    orderBy,
} from 'firebase/firestore';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, TaskStatus, TaskPriority } from '../../models/Task';
import { database } from '../../lib/firebase';
import { useAuth } from '../../providers/AuthProvider';
import { useWorkspace } from '../../providers/WorkspaceProvider';
import { TaskForm } from './TaskForm';
import { TaskManagerHeader } from '../layout/TaskManagerHeader';
import { TaskStats } from './TaskStats';
import { Modal } from '../ui/Modal';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { ViewSwitcher, TaskView } from './ViewSwitcher';
import { TaskDetailModal } from './TaskDetailModal'; // NOVO

export function TaskManager() {
    const { user } = useAuth();
    const { currentWorkspaceId } = useWorkspace();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null); // Para o Modal de *Edição*
    const [detailTaskId, setDetailTaskId] = useState<string | null>(null); // NOVO: Para o Modal de *Detalhe*
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [currentView, setCurrentView] = useState<TaskView>('board');

    // NOVO: Encontra a tarefa para o modal de detalhe em tempo real
    const detailTask = useMemo(() => {
        return tasks.find((t) => t.id === detailTaskId) || null;
    }, [tasks, detailTaskId]);

    useEffect(() => {
        if (!currentWorkspaceId) {
            setTasks([]);
            setIsLoadingTasks(false);
            return;
        }

        setIsLoadingTasks(true);
        const tasksCollection = collection(database, 'tasks');
        const tasksQuery = query(
            tasksCollection,
            where('contextId', '==', currentWorkspaceId),
            orderBy('createdAt', 'desc'),
        );

        const unsubscribe = onSnapshot(
            tasksQuery,
            (snapshot) => {
                const loadedTasks = snapshot.docs.map((document) => {
                    const data = document.data();
                    return {
                        id: document.id,
                        ...data,
                        subtasks: data.subtasks || [],
                    } as Task;
                });
                setTasks(loadedTasks);
                setIsLoadingTasks(false);
            },
            (error) => {
                console.error('Falha ao buscar tarefas:', error);
                setIsLoadingTasks(false);
            },
        );

        return () => unsubscribe();
    }, [currentWorkspaceId]);

    const { backlogTasks, inProgressTasks, inReviewTasks, completedTasks } = useMemo(() => {
        const backlog = tasks.filter((task) => task.status === TaskStatus.Backlog);
        const inProgress = tasks.filter((task) => task.status === TaskStatus.InProgress);
        const inReview = tasks.filter((task) => task.status === TaskStatus.InReview);
        const completed = tasks.filter((task) => task.status === TaskStatus.Completed);
        return { backlogTasks, inProgressTasks, inReviewTasks, completedTasks };
    }, [tasks]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragStart = (event: DragOverEvent) => {
        const task = tasks.find((t) => t.id === event.active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveTask(null);
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const task = tasks.find((t) => t.id === active.id);
        const newStatus = over.id as TaskStatus;
        if (!task || !newStatus || task.status === newStatus) return;
        handleUpdateTaskStatus(task.id, newStatus);
    };

    const handleUpdateTaskStatus = useCallback(async (taskId: string, newStatus: TaskStatus) => {
        try {
            const taskReference = doc(database, 'tasks', taskId);
            await updateDoc(taskReference, { status: newStatus });
        } catch (error) {
            console.error('Falha ao atualizar status da tarefa:', error);
        }
    }, []);

    const handleAddTask = useCallback(
        async (data: {
            title: string;
            description: string | null;
            priority: TaskPriority;
            dueDate: string | null;
            status: TaskStatus;
        }) => {
            if (!user || !currentWorkspaceId) return;
            const taskData = {
                ...data,
                authorId: user.uid,
                contextId: currentWorkspaceId,
                createdAt: new Date().toISOString(),
                subtasks: [],
            };
            try {
                await addDoc(collection(database, 'tasks'), taskData);
            } catch (error) {
                console.error('Falha ao adicionar tarefa:', error);
            }
        },
        [user, currentWorkspaceId],
    );

    const handleDeleteTask = useCallback(async (taskId: string) => {
        try {
            const taskReference = doc(database, 'tasks', taskId);
            await deleteDoc(taskReference);
        } catch (error) {
            console.error('Falha ao deletar tarefa:', error);
        }
    }, []);

    const handleUpdateTask = useCallback(async (updatedTask: Task) => {
        try {
            const taskReference = doc(database, 'tasks', updatedTask.id);
            const { id, ...taskData } = updatedTask; // Remove o ID para não ser reescrito
            await updateDoc(taskReference, taskData);
        } catch (error) {
            console.error('Falha ao atualizar tarefa:', error);
        }
    }, []);

    const handleOpenEditModal = useCallback((task: Task) => {
        setTaskToEdit(task);
    }, []);
    const handleCloseEditModal = useCallback(() => {
        setTaskToEdit(null);
    }, []);

    // NOVOS Handlers para o Modal de Detalhe
    const handleOpenDetailModal = useCallback((task: Task) => {
        setDetailTaskId(task.id);
    }, []);
    const handleCloseDetailModal = useCallback(() => {
        setDetailTaskId(null);
    }, []);

    const taskStats = useMemo(() => {
        return {
            total: tasks.length,
            backlog: backlogTasks.length,
            inProgress: inProgressTasks.length,
            inReview: inReviewTasks.length,
            completed: completedTasks.length,
        };
    }, [tasks, backlogTasks, inProgressTasks, inReviewTasks, completedTasks]);

    return (
        <>
            <div className="flex w-full flex-col gap-8">
                <TaskManagerHeader />
                <TaskForm onAddTask={handleAddTask} />
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <TaskStats stats={taskStats} isLoading={isLoadingTasks} />
                        <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
                    </div>

                    {currentView === 'board' && (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <KanbanColumn
                                    id={TaskStatus.Backlog}
                                    title="Backlog"
                                    tasks={backlogTasks}
                                    onDelete={handleDeleteTask}
                                    onEdit={handleOpenEditModal}
                                    onOpenDetail={handleOpenDetailModal} // NOVO
                                />
                                <KanbanColumn
                                    id={TaskStatus.InProgress}
                                    title="Em Andamento"
                                    tasks={inProgressTasks}
                                    onDelete={handleDeleteTask}
                                    onEdit={handleOpenEditModal}
                                    onOpenDetail={handleOpenDetailModal} // NOVO
                                />
                                <KanbanColumn
                                    id={TaskStatus.InReview}
                                    title="Em Revisão"
                                    tasks={inReviewTasks}
                                    onDelete={handleDeleteTask}
                                    onEdit={handleOpenEditModal}
                                    onOpenDetail={handleOpenDetailModal} // NOVO
                                />
                                <KanbanColumn
                                    id={TaskStatus.Completed}
                                    title="Concluído"
                                    tasks={completedTasks}
                                    onDelete={handleDeleteTask}
                                    onEdit={handleOpenEditModal}
                                    onOpenDetail={handleOpenDetailModal} // NOVO
                                />
                            </div>
                            <DragOverlay>
                                {activeTask ? (
                                    <TaskCard task={activeTask} onDelete={() => { }} onEdit={() => { }} onOpenDetail={() => { }} />
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    )}

                    {currentView === 'list' && (
                        <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-opacity-50 text-center">
                            <h3 className="text-lg font-semibold text-text-primary">Visualização em Lista</h3>
                            <p className="max-w-xs text-sm text-text-secondary">
                                A visualização em lista, com porcentagem de conclusão, será implementada a seguir.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de EDIÇÃO (Formulário) */}
            {taskToEdit && (
                <Modal onClose={handleCloseEditModal}>
                    <TaskForm
                        taskToEdit={taskToEdit}
                        onEditTask={handleUpdateTask}
                        onDone={handleCloseEditModal}
                    />
                </Modal>
            )}

            {/* NOVO: Modal de DETALHE (Sub-tarefas, etc.) */}
            {detailTask && (
                <TaskDetailModal
                    task={detailTask}
                    onClose={handleCloseDetailModal}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                />
            )}
        </>
    );
}