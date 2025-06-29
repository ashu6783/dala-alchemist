'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { 
  Home, 
  Users, 
  HardHat, 
  ClipboardList, 
  Upload, 
  Package, 
  Compass,
  Folder,
  Zap,
  Ruler
} from 'lucide-react';

const links = [
  {
    section: 'Navigation',
    icon: Compass,
    items: [
      { name: 'Dashboard Home', href: '/dashboard', icon: Home },
      { name: 'Clients', href: '/dashboard/clients', icon: Users },
      { name: 'Workers', href: '/dashboard/workers', icon: HardHat },
      { name: 'Tasks', href: '/dashboard/tasks', icon: ClipboardList },
      { name: 'RuleBuilder', href: '/dashboard/rules', icon: Ruler },

    ],
  },
  {
    section: 'Data Operations',
    icon: Folder,
    items: [
      { name: 'Upload CSVs', href: '/dashboard/upload', icon: Upload },
      { name: 'Export Panel', href: '/dashboard/export', icon: Package },
    ],
  },

];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="h-screen w-72 flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-r border-slate-700/50">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              DataAlchemist
            </h1>
            <p className="text-xs text-slate-400">Transform your data</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {links.map((section, sectionIndex) => (
          <div key={section.section} className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center space-x-2 px-3 py-2">
              <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <section.icon className="w-4 h-4 text-slate-400" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {section.section}
              </p>
            </div>

            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((link) => {
                const isActive = pathname === link.href;
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      'group flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden',
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:translate-x-1'
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
                    )}
                    
                    {/* Icon */}
                    <IconComponent className={clsx(
                      'w-5 h-5 transition-transform duration-200',
                      isActive ? 'scale-110 text-blue-400' : 'group-hover:scale-105'
                    )} />
                    
                    {/* Text */}
                    <span className="flex-1 truncate">
                      {link.name}
                    </span>
                    
                    {/* Hover effect arrow */}
                    <span className={clsx(
                      'opacity-0 transition-opacity duration-200 text-slate-400',
                      !isActive && 'group-hover:opacity-100'
                    )}>
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t  border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>v2.1.0</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}