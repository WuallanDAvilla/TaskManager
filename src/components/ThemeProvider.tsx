'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useLayoutEffect,
  ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'task-manager-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  useLayoutEffect(() => {
    const storedTheme = window.localStorage.getItem(LOCAL_STORAGE_KEY) as Theme | null;
    const preferredTheme: Theme =
      storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    setThemeState(preferredTheme);
    document.documentElement.setAttribute('data-theme', preferredTheme);
  }, []);

  const setTheme = (newTheme: Theme) => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Falha ao salvar o tema no localStorage:', error);
    }
  };

  const contextValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}