'use client';

import React, { useState, useEffect } from 'react';
import { CommandPalette } from '../ui/CommandPalette';

export function GlobalKeyboardHandler() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return <CommandPalette open={open} setOpen={setOpen} />;
}