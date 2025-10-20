'use client';

import React, { memo } from 'react';
import { FilterStatus } from '../models/Task';

interface TaskFiltersProps {
    currentFilter: FilterStatus;
    onFilterChange: (filter: FilterStatus) => void;
}

const filterOptions = [
    { label: 'Todas', value: FilterStatus.All },
    { label: 'Pendentes', value: FilterStatus.Pending },
    { label: 'Concluídas', value: FilterStatus.Completed },
];

function TaskFiltersDisplay({ currentFilter, onFilterChange }: TaskFiltersProps) {
    const getButtonClasses = (filterValue: FilterStatus) => {
        const baseClasses =
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-accent/50 focus:ring-offset-1';
        const activeClasses = 'bg-primary-accent text-white shadow-sm';
        const inactiveClasses =
            'bg-transparent text-text-secondary hover:bg-black/5 data-[theme=dark]:hover:bg-white/10';

        return `${baseClasses} ${currentFilter === filterValue ? activeClasses : inactiveClasses}`;
    };

    return (
        <div className="flex flex-shrink-0 items-center gap-2 rounded-lg border bg-background-start p-1">
            {filterOptions.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onFilterChange(option.value)}
                    className={getButtonClasses(option.value)}
                    aria-pressed={currentFilter === option.value}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

export const TaskFilters = memo(TaskFiltersDisplay);