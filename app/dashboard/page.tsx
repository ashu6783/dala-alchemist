'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, 
  Zap, 
  ClipboardList, 
  Upload, 
  BarChart3, 
  TrendingUp, 
  Settings,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useDataStore } from '@/store/dataStore';

interface StatItem {
  label: string;
  count: number;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  hoverColor: string;
}

interface ActionItem {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  description: string;
  color: string;
}

interface StatusItem {
  label: string;
  status: 'active' | 'warning' | 'error';
  description: string;
}

export default function DashboardHome() {
  const { clients, workers, tasks } = useDataStore();

  const stats: StatItem[] = [
    {
      label: 'Clients',
      count: clients.length,
      href: '/dashboard/clients',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      label: 'Workers',
      count: workers.length,
      href: '/dashboard/workers',
      icon: Zap,
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-emerald-700'
    },
    {
      label: 'Tasks',
      count: tasks.length,
      href: '/dashboard/tasks',
      icon: ClipboardList,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <div className=" max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className=" md:flex flex flex-wrap  md:items-center gap-4 mb-2">
            <motion.div 
              className="w-8 h-8 md:w-14 md:h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Zap size={24} />
            </motion.div>
            <div>
              <h1 className=" text-5xl md:text-3xl font-black bg-gradient-to-r from-slate-400 via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Data Alchemist
              </h1>
              <p className="text-slate-400 text-xl font-medium">Transform your data into insights</p>
            </div>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <StatsCard {...stat} index={index} />
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className=" bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-8 mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="md:flex flex flex-wrap md:items-center gap-3 mb-8">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles className="text-indigo-600" size={28} />
            </motion.div>
            <h2 className="text-3xl font-bold text-slate-800">Quick Actions</h2>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <ActionButton
                href="/dashboard/upload"
                icon={Upload}
                label="Upload Files"
                description="Import new data"
                color="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ActionButton
                href="/dashboard/analytics"
                icon={BarChart3}
                label="Analytics"
                description="View insights"
                color="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ActionButton
                href="/dashboard/reports"
                icon={TrendingUp}
                label="Reports"
                description="Generate reports"
                color="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ActionButton
                href="/dashboard/settings"
                icon={Settings}
                label="Settings"
                description="Configure system"
                color="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* System Status */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-wrap md:items-center gap-3 mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="text-emerald-600" size={28} />
            </motion.div>
            <h2 className="text-3xl font-bold text-slate-800">System Status</h2>
          </div>
          
          <motion.div 
            className="flex md:justify-between flex-wrap  gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <StatusIndicator
                label="Data Processing"
                status="active"
                description="All systems operational"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatusIndicator
                label="API Connections"
                status="active"
                description="All endpoints responding"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function StatsCard({ 
  label, 
  count, 
  href, 
  icon: Icon, 
  color, 
  hoverColor, 
  index 
}: StatItem & { index: number }) {
  return (
    <Link href={href} className="group">
      <motion.div 
        className={`relative overflow-hidden bg-gradient-to-br ${color} ${hoverColor} rounded-3xl p-8 text-white shadow-lg transition-all duration-500 group-hover:shadow-2xl`}
        whileHover={{ 
          scale: 1.05, 
          y: -5,
          transition: { type: "spring", stiffness: 300 }
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <motion.div 
            className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/30"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-white/20"
            animate={{ scale: [1, 1.2, 1], rotate: [360, 180, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              <Icon size={36} className="text-white" />
            </motion.div>
            <div className="text-right">
              <p className="text-white/90 text-sm font-semibold uppercase tracking-wider">{label}</p>
              <motion.p 
                className="text-4xl font-black"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                {count}
              </motion.p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/95 text-sm font-semibold">View Details</span>
            <motion.div
              className="text-white/80 group-hover:text-white transition-colors"
              whileHover={{ x: 5 }}
            >
              <ArrowRight size={20} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function ActionButton({ 
  href, 
  icon: Icon, 
  label, 
  description, 
  color 
}: ActionItem) {
  return (
    <Link href={href}>
      <motion.div 
        className={`${color} text-white rounded-2xl p-6 transition-all duration-300 hover:shadow-xl group relative overflow-hidden`}
        whileHover={{ 
          scale: 1.05, 
          y: -3,
          transition: { type: "spring", stiffness: 300 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <Icon size={28} className="mb-3" />
        </motion.div>
        <h3 className="font-bold text-base mb-2">{label}</h3>
        <p className="text-white/90 text-sm">{description}</p>
      </motion.div>
    </Link>
  );
}

function StatusIndicator({ label, status, description }: StatusItem) {
  const statusConfig = {
    active: {
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
      icon: CheckCircle,
      iconColor: 'text-emerald-600'
    },
    warning: {
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
      iconColor: 'text-amber-600'
    },
    error: {
      color: 'bg-red-50 text-red-800 border-red-200',
      dot: 'bg-red-500',
      icon: XCircle,
      iconColor: 'text-red-600'
    }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <motion.div 
      className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-200/50"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.div 
        className="flex-shrink-0"
        whileHover={{ scale: 1.2, rotate: 5 }}
        transition={{ duration: 0.2 }}
      >
        <StatusIcon size={24} className={config.iconColor} />
      </motion.div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-bold text-slate-800">{label}</h3>
          <motion.div 
            className={`w-3 h-3 rounded-full ${config.dot}`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <p className="text-slate-600 text-sm mb-3">{description}</p>
        <motion.span 
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}
          whileHover={{ scale: 1.05 }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </motion.span>
      </div>
    </motion.div>
  );
}