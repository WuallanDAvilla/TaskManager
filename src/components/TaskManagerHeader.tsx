'use client';

import React, { useCallback } from 'react';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

export function TaskManagerHeader() {
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();

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

    const welcomeMessage =
        user?.displayName || user?.email ? `Olá, ${user.displayName || user.email}` : 'Task Manager Pro';

    return (
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
            <WorkspaceSwitcher />
        </header>
    );
}
