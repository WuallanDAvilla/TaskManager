'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority, FilterStatus } from '../models/Task';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import { TaskManagerHeader } from './TaskManagerHeader';
import { TaskFilters } from './TaskFilters';
import { TaskStats } from './TaskStats';

const STORAGE_KEY = 'task-manager-tasks';

export function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentFilter, setCurrentFilter] = useState<FilterStatus>(FilterStatus.All);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        try {
            const storedTasks = window.localStorage.getItem(STORAGE_KEY);
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            }
        } catch (error) {
            console.error('Falha ao carregar tarefas do localStorage:', error);
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            } catch (error) {
                console.error('Falha ao salvar tarefas no localStorage:', error);
            }
        }
    }, [tasks, isClient]);

    const handleAddTask = useCallback(
        (data: { title: string; description: string | null; priority: TaskPriority; dueDate: string | null }) => {
            const newTask: Task = {
                id: crypto.randomUUID(),
                title: data.title,
                description: data.description || null,
                status: TaskStatus.Pending,
                priority: data.priority,
                dueDate: data.dueDate || null,
                createdAt: new Date().toISOString(),
            };
            setTasks((previousTasks) => [newTask, ...previousTasks]);
        },
        [],
    );

    const handleDeleteTask = useCallback((taskId: string) => {
        setTasks((previousTasks) => previousTasks.filter((task) => task.id !== taskId));
    }, []);

    const handleToggleTaskStatus = useCallback((taskId: string) => {
        setTasks((previousTasks) =>
            previousTasks.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        status: task.status === TaskStatus.Completed ? TaskStatus.Pending : TaskStatus.Completed,
                    }
                    : task,
            ),
        );
    }, []);

    const handleUpdateTask = useCallback((updatedTask: Task) => {
        setTasks((previousTasks) =>
            previousTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
        );
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

    if (!isClient) {
        return null;
    }

    return (
        <div className="flex w-full flex-col gap-8">
            <TaskManagerHeader />
            <TaskForm onAddTask={handleAddTask} />
            <div className="flex flex-col gap-4 rounded-lg border bg-card-background p-4 shadow-card data-[theme=dark]:shadow-card-dark sm:p-6">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <TaskStats stats={taskStats} />
                    <TaskFilters currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
                </div>
                <TaskList
                    tasks={filteredTasks}
                    onToggleTaskStatus={handleToggleTaskStatus}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                />
            </div>
        </div>
    );
}