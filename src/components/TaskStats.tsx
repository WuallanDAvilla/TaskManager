'use client';

import React, { memo } from 'react';

interface TaskStatsProps {
    stats: {
        total: number;
        pending: number;
        completed: number;
    };
    isLoading: boolean;
}

const StatsSkeleton = () => (
    <div className="flex animate-pulse flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-text-secondary">Total</span>
            <span className="h-6 w-4 rounded-md bg-text-secondary/10"></span>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-text-secondary">Pendentes</span>
            <span className="h-6 w-4 rounded-md bg-text-secondary/10"></span>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-text-secondary">Concluídas</span>
            <span className="h-6 w-4 rounded-md bg-text-secondary/10"></span>
        </div>
    </div>
);

export const TaskStats = memo(function TaskStatsDisplay({ stats, isLoading }: TaskStatsProps) {
    if (isLoading) {
        return <StatsSkeleton />;
    }

    const { total, pending, completed } = stats;

    return (
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-text-secondary">Total</span>
                <span className="text-xl font-bold text-text-primary">{total}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-text-secondary">Pendentes</span>
                <span className="text-xl font-bold text-priority-medium">{pending}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-text-secondary">Concluídas</span>
                <span className="text-xl font-bold text-priority-low">{completed}</span>
            </div>
        </div>
    );
});