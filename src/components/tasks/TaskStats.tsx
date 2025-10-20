'use client';

import React, { memo } from 'react';

interface TaskStatsProps {
    stats: {
        total: number;
        backlog: number;
        inProgress: number;
        inReview: number;
        completed: number;
    };
    isLoading: boolean;
}

const StatsSkeleton = () => (
    <div className="flex animate-pulse flex-wrap items-center gap-4 sm:gap-6">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-baseline gap-2">
                <span className="h-4 w-12 rounded-md bg-text-secondary/10"></span>
                <span className="h-6 w-4 rounded-md bg-text-secondary/10"></span>
            </div>
        ))}
    </div>
);

const StatItem = ({ label, value, colorClass }: { label: string; value: number; colorClass?: string }) => (
    <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium text-text-secondary">{label}</span>
        <span className={`text-xl font-bold ${colorClass || 'text-text-primary'}`}>{value}</span>
    </div>
);

export const TaskStats = memo(function TaskStatsDisplay({ stats, isLoading }: TaskStatsProps) {
    if (isLoading) {
        return <StatsSkeleton />;
    }

    const { total, backlog, inProgress, inReview, completed } = stats;

    return (
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <StatItem label="Total" value={total} />
            <StatItem label="Backlog" value={backlog} colorClass="text-text-secondary" />
            <StatItem label="Em Andamento" value={inProgress} colorClass="text-priority-medium" />
            <StatItem label="Em Revisão" value={inReview} colorClass="text-priority-high" />
            <StatItem label="Concluídas" value={completed} colorClass="text-priority-low" />
        </div>
    );
});