'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { useAuth } from './AuthProvider';
import { useWorkspace } from './WorkspaceProvider';

const UserIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.25 1.25 0 0 0-2.43 1.014A5.996 5.996 0 0 0 5 19.5h10a5.996 5.996 0 0 0 3.965-1.493 1.25 1.25 0 0 0-2.43-1.014A3.498 3.498 0 0 1 15 16.5H5c-1.657 0-3.08-.895-3.8-2.144-.324-.52-.465-1.11-.435-1.707Z" />
    </svg>
);

const GroupIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6.373 10.42a4.49 4.49 0 0 1 7.254 0 4.49 4.49 0 0 1 7.254 0 .75.75 0 0 0 1.14-.985A5.99 5.99 0 0 0 17.5 8a5.99 5.99 0 0 0-11 0 5.99 5.99 0 0 0-4.507 1.435.75.75 0 0 0 1.14.985ZM12.627 10.42a4.49 4.49 0 0 1-5.254 0A5.99 5.99 0 0 0 2.5 16a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75 5.99 5.99 0 0 0-4.873-5.58Z" />
    </svg>
);

const ChevronIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
        />
    </svg>
);

function WorkspaceSwitcherDisplay() {
    const { user } = useAuth();
    const { groups, currentWorkspaceId, setWorkspace } = useWorkspace();

    const handleSwitch = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            setWorkspace(event.target.value);
        },
        [setWorkspace],
    );

    const currentSelection = useMemo(() => {
        if (!user || !currentWorkspaceId) return null;

        if (currentWorkspaceId === user.uid) {
            return { id: user.uid, name: 'Tarefas Pessoais', icon: UserIcon };
        }
        const group = groups.find((g) => g.id === currentWorkspaceId);
        if (group) {
            return { id: group.id, name: group.name, icon: GroupIcon };
        }
        return { id: user.uid, name: 'Carregando...', icon: UserIcon };
    }, [currentWorkspaceId, user, groups]);

    if (!user || !currentSelection) {
        return null;
    }

    return (
        <div className="relative w-full max-w-xs">
            <label htmlFor="workspace-switcher" className="sr-only">
                Selecionar Workspace
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-secondary">
                {currentSelection.icon}
            </div>
            <select
                id="workspace-switcher"
                value={currentSelection.id}
                onChange={handleSwitch}
                className="w-full appearance-none rounded-md border bg-background-start py-2.5 pl-10 pr-8 text-sm font-semibold text-text-primary transition-colors focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50"
            >
                <option value={user.uid}>Tarefas Pessoais</option>
                {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                        {group.name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-text-secondary">
                {ChevronIcon}
            </div>
        </div>
    );
}

export const WorkspaceSwitcher = memo(WorkspaceSwitcherDisplay);