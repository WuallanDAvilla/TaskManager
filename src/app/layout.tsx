import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../providers/ThemeProvider';
import { AuthProvider } from '../providers/AuthProvider';
import { WorkspaceProvider } from '../providers/WorkspaceProvider';
import { ModalProvider } from '../providers/ModalProvider';
import { GlobalKeyboardHandler } from '../components/layout/GlobalKeyboardHandler';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Manager Pro',
  description:
    'Um super sistema de gerenciamento de tarefas, focado em performance e UI/UX.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <WorkspaceProvider>
              <ModalProvider>
                {children}
                <GlobalKeyboardHandler />
              </ModalProvider>
            </WorkspaceProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}