'use client';

import { useDataStore } from '@/store/dataStore';
import { exportToCSV } from '@/utils/exportUtils';
import { Download, Users, CheckSquare, Settings, FileText, ArrowDown } from 'lucide-react';

type ColorType = 'blue' | 'green' | 'purple';

export default function ExportPanel() {
  const clients = useDataStore((state) => state.clients);
  const tasks = useDataStore((state) => state.tasks);
  const rules = useDataStore((state) => state.rules);

  const exportItems = [
    {
      title: 'Export Clients',
      description: 'Download all client information and details',
      icon: Users,
      data: clients,
      filename: 'clients.csv',
      color: 'blue' as ColorType,
      count: clients?.length || 0
    },
    {
      title: 'Export Tasks',
      description: 'Download all tasks and their current status',
      icon: CheckSquare,
      data: tasks,
      filename: 'tasks.csv',
      color: 'green' as ColorType,
      count: tasks?.length || 0
    },
    {
      title: 'Export Rules',
      description: 'Download all business rules and configurations',
      icon: Settings,
      data: rules,
      filename: 'rules.csv',
      color: 'purple' as ColorType,
      count: rules?.length || 0
    }
  ];

  const getColorClasses = (color: ColorType) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 hover:bg-blue-100',
        border: 'border-blue-200 hover:border-blue-300',
        button: 'bg-blue-600 hover:bg-blue-700',
        icon: 'text-blue-600',
        accent: 'bg-blue-100 text-blue-800'
      },
      green: {
        bg: 'bg-green-50 hover:bg-green-100',
        border: 'border-green-200 hover:border-green-300',
        button: 'bg-green-600 hover:bg-green-700',
        icon: 'text-green-600',
        accent: 'bg-green-100 text-green-800'
      },
      purple: {
        bg: 'bg-purple-50 hover:bg-purple-100',
        border: 'border-purple-200 hover:border-purple-300',
        button: 'bg-purple-600 hover:bg-purple-700',
        icon: 'text-purple-600',
        accent: 'bg-purple-100 text-purple-800'
      }
    };
    return colors[color];
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-gray-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Export Data</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Download your current data as CSV files for backup, analysis, or integration with other tools.
        </p>
      </div>

      {/* Export Cards Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {exportItems.map((item, index) => {
          const colors = getColorClasses(item.color);
          const IconComponent = item.icon;
          
          return (
            <div
              key={index}
              className={`
                relative overflow-hidden rounded-2xl border-2 transition-all duration-300 
                ${colors.bg} ${colors.border} group cursor-pointer transform hover:scale-105 hover:shadow-lg
              `}
            >
              {/* Card Content */}
              <div className="p-6">
                {/* Icon and Count Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.button}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.accent}`}>
                    {item.count} items
                  </span>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{item.description}</p>

                {/* Export Button */}
                <button
                  onClick={() => exportToCSV(item.data, item.filename)}
                  className={`
                    w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl
                    text-white font-semibold transition-all duration-200
                    ${colors.button} group-hover:shadow-md transform hover:translate-y-[-1px]
                  `}
                >
                  <Download className="w-5 h-5" />
                  <span>Download CSV</span>
                  <ArrowDown className="w-4 h-4 opacity-70" />
                </button>
              </div>

              {/* Decorative Element */}
              <div className={`absolute top-0 right-0 w-20 h-20 transform translate-x-8 -translate-y-8 rounded-full ${colors.button} opacity-10`}></div>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">About CSV Exports</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              CSV files can be opened in spreadsheet applications like Excel, Google Sheets, or imported into other systems. 
              All exports include column headers and are formatted for easy readability and processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}