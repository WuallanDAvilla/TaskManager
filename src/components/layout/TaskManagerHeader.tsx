'use client';

import React, { useCallback, useMemo } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { useAuth } from '../../providers/AuthProvider';
import { useWorkspace } from '../../providers/WorkspaceProvider';
import { useModal } from '../../providers/ModalProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { WorkspaceSwitcher } from '../groups/WorkspaceSwitcher';
import { Modal } from '../ui/Modal';
import { CreateGroupForm } from '../groups/CreateGroupForm';
import { JoinGroupForm } from '../groups/JoinGroupForm';
import { ManageGroupModal } from '../groups/ManageGroupModal';

export function TaskManagerHeader() {
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();
    const { groups, currentWorkspaceId } = useWorkspace();
    const { modalOpen, openCreateModal, openJoinModal, openManageModal, closeModal } = useModal();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleSignOut = useCallback(async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Falha ao fazer logout:', error);
        }
    }, []);

    const currentGroup = useMemo(() => {
        if (!currentWorkspaceId || !groups) return null;
        return groups.find((g) => g.id === currentWorkspaceId) || null;
    }, [currentWorkspaceId, groups]);

    const isOwner = useMemo(() => {
        if (!user || !currentGroup) return false;
        return user.uid === currentGroup.ownerId;
    }, [user, currentGroup]);

    const SunIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a2.25 2.25 0 0 1-2.25-2.25V7.5a2.25 2.25 0 0 1 4.5 0v2.25A2.25 2.25 0 0 1 12 12Z"
            />
        </svg>
    );

    const MoonIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
            />
        </svg>
    );

    const LogoutIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3 0 3-3m0 0-3-3m3 3H9"
            />
        </svg>
    );

    const PlusIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
        </svg>
    );

    const JoinIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path
                fillRule="evenodd"
                d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2.25a.75.75 0 0 1-1.5 0V4.25a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2.25a.75.75 0 0 1 1.5 0V15.75A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                clipRule="evenodd"
            />
            <path
                fillRule="evenodd"
                d="M19 10a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 .75-.75Z"
                clipRule="evenodd"
            />
            <path
                fillRule="evenodd"
                d="M16.78 12.53a.75.75 0 0 0 0-1.06l-2.25-2.25a.75.75 0 1 0-1.06 1.06L14.94 11.5l-1.47 1.47a.75.75 0 1 0 1.06 1.06l2.25-2.25Z"
                clipRule="evenodd"
            />
        </svg>
    );

    const ManageIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path
                fillRule="evenodd"
                d="M7.83 11.006a1 1 0 0 0-1.66 0A.83.83 0 0 1 5 12.169v.662a1 1 0 0 0 .83 1.163l1.72.488a1.164 1.164 0 0 1 .822.822l.488 1.72a1 1 0 0 0 1.163.83h.662c.45 0 .86-.299.985-.735a1 1 0 0 0 0-1.66l-.488-1.72a1.164 1.164 0 0 1-.822-.822l-1.72-.488A1 1 0 0 0 7.83 12.83v-.662c0-.45-.299-.86-.735-.985ZM12.17 9.006a1 1 0 0 0 1.66 0c.126-.436.435-.745.885-.885a1 1 0 0 0 0-1.66c-.436-.126-.745-.435-.885-.885a1 1 0 0 0-1.66 0c-.126.436-.435-.745-.885.885a1 1 0 0 0 0 1.66c.436.126.745.435.885.885Z"
                clipRule="evenodd"
            />
            <path d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM.9 10a8.1 8.1 0 1 1 16.2 0 8.1 8.1 0 0 1-16.2 0Z" />
        </svg>
    );

    const welcomeMessage =
        user?.displayName || user?.email ? `Olá, ${user.displayName || user.email}` : 'Task Manager Pro';

    return (
        <>
            <header className="flex w-full flex-col gap-4">
                <div className="flex w-full items-center justify-between gap-4">
                    <h1
                        className="truncate text-3xl font-bold text-text-primary sm:text-4xl"
                        title={welcomeMessage}
                    >
                        {welcomeMessage}
                    </h1>
                    <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="rounded-full p-2 text-text-secondary transition-colors duration-200 hover:bg-black/5 data-[theme=dark]:hover:bg-white/10"
                            aria-label="Alternar tema claro e escuro"
                        >
                            {theme === 'light' ? MoonIcon : SunIcon}
                        </button>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="rounded-full p-2 text-text-secondary transition-colors duration-200 hover:bg-black/5 data-[theme=dark]:hover:bg-white/10"
                            aria-label="Sair da conta"
                        >
                            {LogoutIcon}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 sm:flex-row">
                    <WorkspaceSwitcher />
                    {isOwner && currentGroup && (
                        <button
                            type="button"
                            onClick={openManageModal}
                            className="flex w-full flex-shrink-0 items-center justify-center gap-2 rounded-md border border-text-secondary/50 bg-transparent px-3 py-2 text-sm font-semibold text-text-secondary transition-colors duration-200 hover:bg-black/5 data-[theme=dark]:hover:bg-white/10 sm:w-auto"
                        >
                            {ManageIcon}
                            Gerenciar
                        </button>
                    )}
                </div>

                <div className="flex flex-col items-center gap-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={openJoinModal}
                        className="flex w-full flex-shrink-0 items-center justify-center gap-2 rounded-md border border-text-secondary/50 px-3 py-2 text-sm font-semibold text-text-secondary transition-colors duration-200 hover:bg-black/5 data-[theme=dark]:hover:bg-white/10 sm:w-auto"
                    >
                        {JoinIcon}
                        Entrar em Grupo
                    </button>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="flex w-full flex-shrink-0 items-center justify-center gap-2 rounded-md border border-primary-accent/50 bg-primary-accent/10 px-3 py-2 text-sm font-semibold text-primary-accent transition-colors duration-200 hover:bg-primary-accent/20 sm:w-auto"
                    >
                        {PlusIcon}
                        Criar Grupo
                    </button>
                </div>
            </header>

            {modalOpen === 'create' && (
                <Modal onClose={closeModal}>
                    <CreateGroupForm onClose={closeModal} />
                </Modal>
            )}

            {modalOpen === 'join' && (
                <Modal onClose={closeModal}>
                    <JoinGroupForm onClose={closeModal} />
                </Modal>
            )}

            {modalOpen === 'manage' && currentGroup && (
                <Modal onClose={closeModal}>
                    <ManageGroupModal group={currentGroup} />
                </Modal>
            )}
        </>
    );
}