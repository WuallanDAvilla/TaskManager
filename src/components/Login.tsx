'use client';

import React, { useState, useCallback } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';

const GoogleIcon = (
    <svg viewBox="0 0 48 48" className="h-6 w-6">
        <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
        <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        ></path>
        <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.649-3.657-11.303-8H6.306C9.656,35.663,16.318,40,24,40z"
        ></path>
        <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.99,36.31,44,30.608,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
    </svg>
);

const ButtonSpinner = (
    <svg
        className="h-6 w-6 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        ></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
    </svg>
);

export function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (signInError) {
            console.error('Erro ao fazer login com Google:', signInError);
            setError('Falha ao fazer login. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="flex w-full flex-col items-center justify-center gap-6 rounded-lg border bg-card-background p-8 shadow-card data-[theme=dark]:shadow-card-dark sm:p-12">
            <h1 className="text-3xl font-bold text-text-primary">Bem-vindo!</h1>
            <p className="max-w-md text-center text-text-secondary">
                Acesse sua conta para gerenciar suas tarefas pessoais e colaborar com sua equipe.
            </p>

            {error && (
                <div className="rounded-md bg-red-100 p-3 text-sm font-medium text-red-700 data-[theme=dark]:bg-red-900/30 data-[theme=dark]:text-red-300">
                    {error}
                </div>
            )}

            <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex w-full max-w-xs items-center justify-center gap-3 rounded-md border bg-transparent p-3 text-base font-semibold text-text-primary transition-colors duration-200 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-primary-accent/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[theme=dark]:hover:bg-white/10"
            >
                {isLoading ? ButtonSpinner : GoogleIcon}
                {isLoading ? 'Acessando...' : 'Acessar com Google'}
            </button>
        </div>
    );
}