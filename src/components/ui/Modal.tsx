'use client';

import React, { ReactNode, useCallback, MouseEvent } from 'react';

interface ModalProps {
    onClose: () => void;
    children: ReactNode;
}

const CloseIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export function Modal({ children, onClose }: ModalProps) {
    const handleBackdropClick = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            if (event.target === event.currentTarget) {
                onClose();
            }
        },
        [onClose],
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="relative w-full max-w-lg rounded-lg border bg-card-background p-6 shadow-card data-[theme=dark]:shadow-card-dark">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-text-secondary transition-colors duration-200 hover:bg-black/5 data-[theme=dark]:hover:bg-white/10"
                    aria-label="Fechar modal"
                >
                    {CloseIcon}
                </button>
                {children}
            </div>
        </div>
    );
}