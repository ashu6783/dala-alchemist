// app/dashboard/layout.tsx

'use client';

import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-100 p-6">
        {children}
      </main>
    </div>
  );
}
