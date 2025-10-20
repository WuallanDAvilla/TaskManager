'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';

type ModalState = null | 'create' | 'join' | 'manage';

interface ModalContextType {
    modalOpen: ModalState;
    openCreateModal: () => void;
    openJoinModal: () => void;
    openManageModal: () => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modalOpen, setModalOpen] = useState<ModalState>(null);

    const openCreateModal = useCallback(() => setModalOpen('create'), []);
    const openJoinModal = useCallback(() => setModalOpen('join'), []);
    const openManageModal = useCallback(() => setModalOpen('manage'), []);
    const closeModal = useCallback(() => setModalOpen(null), []);

    const value = useMemo(
        () => ({
            modalOpen,
            openCreateModal,
            openJoinModal,
            openManageModal,
            closeModal,
        }),
        [modalOpen, openCreateModal, openJoinModal, openManageModal, closeModal],
    );

    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal deve ser usado dentro de um ModalProvider');
    }
    return context;
}
