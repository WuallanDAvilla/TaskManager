'use client';

import { TaskManager } from '../components/TaskManager';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start p-4 pt-12 sm:p-12 md:p-24">
      <div className="w-full max-w-5xl">
        <TaskManager />
      </div>
    </main>
  );
}