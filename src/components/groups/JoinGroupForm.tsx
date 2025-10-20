'use client';

import React, { useState, useCallback, FormEvent } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { database } from '../../lib/firebase';
import { useAuth } from '../../providers/AuthProvider';

interface JoinGroupFormProps {
    onClose: () => void;
}

const ButtonSpinner = (
    <svg
        className="h-5 w-5 animate-spin"
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

export function JoinGroupForm({ onClose }: JoinGroupFormProps) {
    const { user } = useAuth();
    const [groupId, setGroupId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!user) {
                setError('Você precisa estar logado para entrar em um grupo.');
                return;
            }
            if (groupId.trim().length === 0) {
                setError('O ID do grupo é obrigatório.');
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const groupReference = doc(database, 'groups', groupId.trim());
                await updateDoc(groupReference, {
                    members: arrayUnion(user.uid),
                });
                onClose();
            } catch (submissionError) {
                console.error('Falha ao entrar no grupo:', submissionError);
                setError('Falha ao entrar no grupo. Verifique o ID e tente novamente.');
            } finally {
                setIsLoading(false);
            }
        },
        [user, groupId, onClose],
    );

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-text-primary">Entrar em um Grupo</h2>
            <p className="text-sm text-text-secondary">
                Cole o ID do grupo fornecido pelo administrador para começar a colaborar.
            </p>

            {error && <div className="rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</div>}

            <div className="flex flex-col">
                <label htmlFor="group-id" className="mb-1 text-sm font-medium text-text-secondary">
                    ID do Grupo
                </label>
                <input
                    id="group-id"
                    type="text"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    placeholder="Cole o ID do grupo aqui"
                    className="rounded-md border bg-transparent p-2 text-text-primary transition-colors focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary-accent p-3 text-lg font-semibold text-white transition-colors duration-200 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-accent/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isLoading && ButtonSpinner}
                {isLoading ? 'Entrando...' : 'Entrar no Grupo'}
            </button>
        </form>
    );
}