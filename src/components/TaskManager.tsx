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
import { Task, TaskStatus, TaskPriority, FilterStatus } from '../models/Task';
import { database } from '../lib/firebase';
import { useAuth } from './AuthProvider';
import { useWorkspace } from './WorkspaceProvider';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import { TaskManagerHeader } from './TaskManagerHeader';
import { TaskFilters } from './TaskFilters';
import { TaskStats } from './TaskStats';

export function TaskManager() {
    const { user } = useAuth();
    const { currentWorkspaceId } = useWorkspace();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentFilter, setCurrentFilter] = useState<FilterStatus>(FilterStatus.All);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);

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
                        title: data.title,
                        description: data.description,
                        status: data.status,
                        priority: data.priority,
                        dueDate: data.dueDate,
                        createdAt: data.createdAt,
                        authorId: data.authorId,
                        contextId: data.contextId,
                    };
                }) as Task[];
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

    const handleAddTask = useCallback(
        async (data: {
            title: string;
            description: string | null;
            priority: TaskPriority;
            dueDate: string | null;
        }) => {
            if (!user || !currentWorkspaceId) return;

            const taskData = {
                ...data,
                authorId: user.uid,
                contextId: currentWorkspaceId,
                status: TaskStatus.Pending,
                createdAt: new Date().toISOString(),
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

    const handleToggleTaskStatus = useCallback(
        async (taskId: string) => {
            const taskToUpdate = tasks.find((task) => task.id === taskId);
            if (!taskToUpdate) return;

            const newStatus =
                taskToUpdate.status === TaskStatus.Completed ? TaskStatus.Pending : TaskStatus.Completed;

            try {
                const taskReference = doc(database, 'tasks', taskId);
                await updateDoc(taskReference, { status: newStatus });
            } catch (error) {
                console.error('Falha ao atualizar status da tarefa:', error);
            }
        },
        [tasks],
    );

    const handleUpdateTask = useCallback(async (updatedTask: Task) => {
        try {
            const taskReference = doc(database, 'tasks', updatedTask.id);
            const taskData: Partial<Task> = { ...updatedTask };
            delete taskData.id;
            await updateDoc(taskReference, taskData);
        } catch (error) {
            console.error('Falha ao atualizar tarefa:', error);
        }
    }, []);

    const filteredTasks = useMemo(() => {
        if (currentFilter === FilterStatus.Completed) {
            return tasks.filter((task) => task.status === TaskStatus.Completed);
        }
        if (currentFilter === FilterStatus.Pending) {
            return tasks.filter((task) => task.status === TaskStatus.Pending);
        }
        return tasks;
    }, [tasks, currentFilter]);

    const taskStats = useMemo(() => {
        const total = tasks.length;
        const pending = tasks.filter((task) => task.status === TaskStatus.Pending).length;
        const completed = total - pending;
        return { total, pending, completed };
    }, [tasks]);

    return (
        <div className="flex w-full flex-col gap-8">
            <TaskManagerHeader />
            <TaskForm onAddTask={handleAddTask} />
            <div className="flex flex-col gap-4 rounded-lg border bg-card-background p-4 shadow-card data-[theme=dark]:shadow-card-dark sm:p-6">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <TaskStats stats={taskStats} isLoading={isLoadingTasks} />
                    <TaskFilters currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
                </div>
                <TaskList
                    tasks={filteredTasks}
                    isLoading={isLoadingTasks}
                    onToggleTaskStatus={handleToggleTaskStatus}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                />
            </div>
        </div>
    );
}