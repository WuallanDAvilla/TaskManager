'use client';

import React, { memo } from 'react';

export type TaskView = 'board' | 'list';

interface ViewSwitcherProps {
    currentView: TaskView;
    onViewChange: (view: TaskView) => void;
}

const BoardIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h13A1.5 1.5 0 0 1 18 3.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 16.5v-13ZM12 4H8v12h4V4Z" />
    </svg>
);

const ListIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
            clipRule="evenodd"
        />
    </svg>
);

function ViewSwitcherDisplay({ currentView, onViewChange }: ViewSwitcherProps) {
    const getButtonClasses = (view: TaskView) => {
        const baseClasses =
            'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-accent/50 focus:ring-offset-1';
        const activeClasses = 'bg-primary-accent text-white shadow-sm';
        const inactiveClasses =
            'bg-transparent text-text-secondary hover:bg-black/5 data-[theme=dark]:hover:bg-white/10';

        return `${baseClasses} ${currentView === view ? activeClasses : inactiveClasses}`;
    };

    return (
        <div className="flex flex-shrink-0 items-center gap-2 rounded-lg border bg-background-start p-1">
            <button
                type="button"
                onClick={() => onViewChange('board')}
                className={getButtonClasses('board')}
                aria-pressed={currentView === 'board'}
            >
                {BoardIcon}
                Quadro
            </button>
            <button
                type="button"
                onClick={() => onViewChange('list')}
                className={getButtonClasses('list')}
                aria-pressed={currentView === 'list'}
            >
                {ListIcon}
                Lista
            </button>
        </div>
    );
}

export const ViewSwitcher = memo(ViewSwitcherDisplay);
