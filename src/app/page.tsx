'use client';

import { TaskManager } from '../components/tasks/TaskManager';
import { useAuth } from '../providers/AuthProvider';
import { useWorkspace } from '../providers/WorkspaceProvider';
import { Login } from '../components/auth/Login';

function FullPageSpinner() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <svg
        className="-ml-1 mr-3 h-8 w-8 animate-spin text-primary-accent"
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
    </div>
  );
}

export default function Home() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { isLoading: isWorkspaceLoading } = useWorkspace();

  if (isAuthLoading || isWorkspaceLoading) {
    return <FullPageSpinner />;
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start p-4 pt-12 sm:p-12 md:p-24">
      <div className="w-full max-w-5xl">
        {user ? <TaskManager /> : <Login />}
      </div>
    </main>
  );
}