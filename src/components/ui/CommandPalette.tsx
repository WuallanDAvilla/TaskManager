'use client';

import React, { useCallback, useMemo } from 'react';
import { Command } from 'cmdk';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { useWorkspace } from '../../providers/WorkspaceProvider';
import { useModal } from '../../providers/ModalProvider';

// Ícones para a paleta
const PlusIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-2 h-4 w-4"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>;
const JoinIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-2 h-4 w-4"><path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2.25a.75.75 0 0 1-1.5 0V4.25a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2.25a.75.75 0 0 1 1.5 0V15.75A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" /><path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 .75-.75Z" clipRule="evenodd" /><path fillRule="evenodd" d="M16.78 12.53a.75.75 0 0 0 0-1.06l-2.25-2.25a.75.75 0 1 0-1.06 1.06L14.94 11.5l-1.47 1.47a.75.75 0 1 0 1.06 1.06l2.25-2.25Z" clipRule="evenodd" /></svg>;
const ManageIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-2 h-4 w-4"><path fillRule="evenodd" d="M7.83 11.006a1 1 0 0 0-1.66 0A.83.83 0 0 1 5 12.169v.662a1 1 0 0 0 .83 1.163l1.72.488a1.164 1.164 0 0 1 .822.822l.488 1.72a1 1 0 0 0 1.163.83h.662c.45 0 .86-.299.985-.735a1 1 0 0 0 0-1.66l-.488-1.72a1.164 1.164 0 0 1-.822-.822l-1.72-.488A1 1 0 0 0 7.83 12.83v-.662c0-.45-.299-.86-.735-.985ZM12.17 9.006a1 1 0 0 0 1.66 0c.126-.436.435-.745.885-.885a1 1 0 0 0 0-1.66c-.436-.126-.745-.435-.885-.885a1 1 0 0 0-1.66 0c-.126.436-.435-.745-.885.885a1 1 0 0 0 0 1.66c.436.126.745.435.885.885Z" clipRule="evenodd" /><path d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM.9 10a8.1 8.1 0 1 1 16.2 0 8.1 8.1 0 0 1-16.2 0Z" /></svg>;
const UserIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-2 h-4 w-4"><path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.25 1.25 0 0 0-2.43 1.014A5.996 5.996 0 0 0 5 19.5h10a5.996 5.996 0 0 0 3.965-1.493 1.25 1.25 0 0 0-2.43-1.014A3.498 3.498 0 0 1 15 16.5H5c-1.657 0-3.08-.895-3.8-2.144-.324-.52-.465-1.11-.435-1.707Z" /></svg>;
const GroupIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-2 h-4 w-4"><path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6.373 10.42a4.49 4.49 0 0 1 7.254 0 4.49 4.49 0 0 1 7.254 0 .75.75 0 0 0 1.14-.985A5.99 5.99 0 0 0 17.5 8a5.99 5.99 0 0 0-11 0 5.99 5.99 0 0 0-4.507 1.435.75.75 0 0 0 1.14.985ZM12.627 10.42a4.49 4.49 0 0 1-5.254 0A5.99 5.99 0 0 0 2.5 16a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75 5.99 5.99 0 0 0-4.873-5.58Z" /></svg>;
const LogoutIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-2 h-4 w-4"><path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2.25a.75.75 0 0 1-1.5 0V4.25a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2.25a.75.75 0 0 1 1.5 0V15.75A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" /><path fillRule="evenodd" d="M6.22 9.22a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06L7.94 12 6.22 10.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>;
const ThemeIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-2 h-4 w-4"><path d="M10 3.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM10 16.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 10a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM3.5 10a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 5.25a.75.75 0 0 0-1.3.514 8.08 8.08 0 0 1 5.072 5.072.75.75 0 0 0 .514-1.3 6.58 6.58 0 0 0-4.286-4.286ZM5.25 10a.75.75 0 0 0-.514 1.3 6.58 6.58 0 0 0 4.286 4.286.75.75 0 0 0 1.3-.514 8.08 8.08 0 0 1-5.072-5.072Z" /></svg>;

interface CommandPaletteProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const { groups, currentWorkspaceId, setWorkspace } = useWorkspace();
    const { openCreateModal, openJoinModal, openManageModal } = useModal();

    const handleSignOut = useCallback(() => {
        signOut(auth).catch((error) => console.error('Falha ao fazer logout:', error));
    }, []);

    const runCommand = useCallback(
        (command: () => void) => {
            setOpen(false);
            command();
        },
        [setOpen],
    );

    const currentGroup = useMemo(() => {
        if (!currentWorkspaceId || !groups) return null;
        return groups.find((g) => g.id === currentWorkspaceId) || null;
    }, [currentWorkspaceId, groups]);

    const isOwner = useMemo(() => {
        if (!user || !currentGroup) return false;
        return user.uid === currentGroup.ownerId;
    }, [user, currentGroup]);

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Menu de Comandos"
            className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
        >
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                data-cmdk-overlay=""
                onClick={() => setOpen(false)}
            />
            <div
                className="z-10 w-full max-w-lg rounded-lg border bg-card-background shadow-card data-[theme=dark]:shadow-card-dark"
                data-cmdk-dialog=""
            >
                <Command.Input
                    autoFocus
                    placeholder="Escreva um comando ou pesquise..."
                    className="w-full rounded-t-lg border-b bg-transparent p-4 text-text-primary placeholder:text-text-secondary focus:outline-none"
                />
                <Command.List className="max-h-64 overflow-y-auto p-2">
                    <Command.Empty className="p-4 text-center text-sm text-text-secondary">
                        Nenhum resultado encontrado.
                    </Command.Empty>

                    <Command.Group heading="Ações" className="text-xs font-medium text-text-secondary">
                        <Command.Item onSelect={() => runCommand(openCreateModal)} className="cmdk-item">
                            {PlusIcon} Criar Novo Grupo
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(openJoinModal)} className="cmdk-item">
                            {JoinIcon} Entrar em um Grupo
                        </Command.Item>
                        {isOwner && currentGroup && (
                            <Command.Item onSelect={() => runCommand(openManageModal)} className="cmdk-item">
                                {ManageIcon} Gerenciar Grupo Atual
                            </Command.Item>
                        )}
                    </Command.Group>

                    <Command.Group heading="Workspaces" className="text-xs font-medium text-text-secondary">
                        {user && (
                            <Command.Item
                                onSelect={() => runCommand(() => setWorkspace(user.uid))}
                                className="cmdk-item"
                            >
                                {UserIcon} Tarefas Pessoais
                            </Command.Item>
                        )}
                        {groups.map((group) => (
                            <Command.Item
                                key={group.id}
                                onSelect={() => runCommand(() => setWorkspace(group.id))}
                                className="cmdk-item"
                            >
                                {GroupIcon} {group.name}
                            </Command.Item>
                        ))}
                    </Command.Group>

                    <Command.Group heading="Geral" className="text-xs font-medium text-text-secondary">
                        <Command.Item
                            onSelect={() => runCommand(() => setTheme(theme === 'light' ? 'dark' : 'light'))}
                            className="cmdk-item"
                        >
                            {ThemeIcon} Mudar Tema
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(handleSignOut)} className="cmdk-item">
                            {LogoutIcon} Sair da Conta
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </div>
        </Command.Dialog>
    );
}