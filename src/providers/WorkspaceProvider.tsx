'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useMemo,
    useCallback,
} from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import { Group } from '../models/Group';
import { database } from '../lib/firebase';

interface WorkspaceContextType {
    groups: Group[];
    currentWorkspaceId: string | null;
    setWorkspace: (workspaceId: string) => void;
    isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setCurrentWorkspaceId(user.uid);
            setIsLoading(true);
        } else {
            setCurrentWorkspaceId(null);
            setGroups([]);
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            return;
        }

        const groupsCollection = collection(database, 'groups');
        const groupsQuery = query(groupsCollection, where('members', 'array-contains', user.uid));

        const unsubscribe = onSnapshot(
            groupsQuery,
            (snapshot) => {
                const loadedGroups = snapshot.docs.map((document) => {
                    const data = document.data();
                    return {
                        id: document.id,
                        name: data.name,
                        ownerId: data.ownerId,
                        members: data.members,
                        createdAt: data.createdAt,
                    };
                }) as Group[];
                setGroups(loadedGroups);
                setIsLoading(false);
            },
            (error) => {
                console.error('Falha ao buscar grupos:', error);
                setIsLoading(false);
            },
        );

        return () => unsubscribe();
    }, [user]);

    const setWorkspace = useCallback((workspaceId: string) => {
        setCurrentWorkspaceId(workspaceId);
    }, []);

    const value = useMemo(
        () => ({
            groups,
            currentWorkspaceId,
            setWorkspace,
            isLoading,
        }),
        [groups, currentWorkspaceId, setWorkspace, isLoading],
    );

    return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error('useWorkspace deve ser usado dentro de um WorkspaceProvider');
    }
    return context;
}