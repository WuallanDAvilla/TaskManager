'use client';

import React, { useState, useCallback } from 'react';
import { Group } from '../../models/Group';

interface ManageGroupModalProps {
    group: Group;
}

const CopyIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.121A1.5 1.5 0 0 1 17 6.621V16.5A1.5 1.5 0 0 1 15.5 18H8.5A1.5 1.5 0 0 1 7 16.5v-13Z" />
        <path d="M5 5.5A1.5 1.5 0 0 1 6.5 4h1V3.5A1.5 1.5 0 0 0 6 2H4.5A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h1V16.5A1.5 1.5 0 0 1 4 15V5.5Z" />
    </svg>
);

const CheckIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
            clipRule="evenodd"
        />
    </svg>
);

export function ManageGroupModal({ group }: ManageGroupModalProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard
            .writeText(group.id)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2500);
            })
            .catch((err) => {
                console.error('Falha ao copiar ID do grupo:', err);
            });
    }, [group.id]);

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-text-primary">Gerenciar Grupo</h2>
            <p className="text-sm text-text-secondary">
                Compartilhe este ID com os membros da sua equipe para que eles possam entrar neste grupo.
            </p>

            <div className="flex flex-col">
                <label htmlFor="group-invite-id" className="mb-1 text-sm font-medium text-text-secondary">
                    ID de Convite do Grupo
                </label>
                <div className="flex gap-2">
                    <input
                        id="group-invite-id"
                        type="text"
                        readOnly
                        value={group.id}
                        className="w-full flex-1 rounded-md border bg-background-start p-2 text-text-primary focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={`flex w-28 flex-shrink-0 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${isCopied
                                ? 'border-priority-low bg-priority-low/10 text-priority-low'
                                : 'border-text-secondary/50 bg-transparent text-text-secondary hover:bg-black/5 data-[theme=dark]:hover:bg-white/10'
                            }`}
                    >
                        {isCopied ? CheckIcon : CopyIcon}
                        {isCopied ? 'Copiado!' : 'Copiar'}
                    </button>
                </div>
            </div>
        </div>
    );
}