// app/dashboard/layout.tsx

'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen,setIsOpen]=useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {isOpen &&(
        <div className='fixed inset-0 bg-black/50 z-30 md:hidden' onClick={()=>setIsOpen(false)} />
      )}

      <div  className={`
          fixed top-0 left-0 z-40 h-full w-72 transform bg-slate-900 text-white shadow-lg border-r border-slate-700/50 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `} >
        <Sidebar />
      </div>
       <div className="flex-1 flex flex-col overflow-auto w-full">
        {/* Header for Mobile Toggle */}
        <div className="md:hidden bg-white shadow p-4 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-800"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold text-slate-800">Data Alchemist</h1>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-6 min-h-screen">{children}</div>
      </div>
    </div>
  );
}
