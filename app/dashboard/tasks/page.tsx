'use client';

import { useDataStore } from '@/store/dataStore';
import DataTable from '@/components/DataTable';
import { useState, useEffect } from 'react';
import type { Task } from '@/types/task';
import { ColumnDef } from '@tanstack/react-table';
import { validateTasks } from '@/lib/validations';
import AIQuerySideBar from '@/components/AIQuerySideBar';

export default function TasksPage() {
  const { tasks, workers, setTasks } = useDataStore();
  const [data, setData] = useState<Task[]>(tasks);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorSummary, setErrorSummary] = useState<string[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setData(tasks);
    setFilteredTasks(tasks); // Initialize filtered tasks
    runValidation(tasks);
  }, [tasks, workers]);

  const runValidation = (taskData: Task[]) => {
    const errorList = validateTasks(taskData, workers);
    const errorMap: Record<string, string> = {};

    errorList.forEach((err) => {
      const [rowInfo, ...rest] = err.split(':');
      const message = rest.join(':').trim();
      const rowNum = rowInfo.match(/\d+/)?.[0];
      const fieldMatch = message.match(/(TaskId|Duration|RequiredSkills|PreferredPhases|MaxConcurrent)/i);
      const field = fieldMatch?.[0]?.toLowerCase();

      if (rowNum && field) {
        errorMap[`${parseInt(rowNum) - 1}-${field}`] = message;
      }
    });

    setErrors(errorMap);
    setErrorSummary(errorList);
  };

  const handleUpdate = (
    rowIndex: number,
    columnId: keyof Task,
    value: any
  ) => {
    const updated = [...data];

    // Normalize Duration
    if (columnId === 'Duration') {
      value = Number(value);
    }


    if (columnId === 'RequiredSkills') {
      if (typeof value === 'string') {
        value = value.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }

 
    if (columnId === 'PreferredPhases') {
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch {
          value = value.split(',').map((s: string) => Number(s.trim())).filter((n: number) => !isNaN(n));
        }
      }
    }

    if (columnId === 'MaxConcurrent') {
      value = Number(value);
    }

    updated[rowIndex] = {
      ...updated[rowIndex],
      [columnId]: value,
    };

    setData(updated);
    setTasks(updated);
    setFilteredTasks(updated); // Update filtered tasks when data changes
    runValidation(updated);
  };

  const getErrorForCell = (rowIndex: number, columnId: string) => {
    const key = `${rowIndex}-${columnId.toLowerCase()}`;
    return errors[key];
  };

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'TaskId',
      header: 'Task ID',
      meta: {
        getError: (rowIndex: number) => getErrorForCell(rowIndex, 'taskid'),
      },
    },
    {
      accessorKey: 'TaskName',
      header: 'Task Name',
    },
    {
      accessorKey: 'Category',
      header: 'Category',
    },
    {
      accessorKey: 'Duration',
      header: 'Duration',
      meta: {
        getError: (rowIndex: number) => getErrorForCell(rowIndex, 'duration'),
      },
    },
    {
      accessorKey: 'RequiredSkills',
      header: 'Required Skills',
      cell: ({ getValue }) => {
        const val = getValue();
        return Array.isArray(val) ? val.join(', ') : String(val ?? '');
      },
      meta: {
        getError: (rowIndex: number) => getErrorForCell(rowIndex, 'requiredskills'),
      },
    },
    {
      accessorKey: 'PreferredPhases',
      header: 'Preferred Phases',
      cell: ({ getValue }) => {
        const val = getValue();
        try {
          return Array.isArray(val) ? val.join(', ') : JSON.stringify(val);
        } catch {
          return String(val);
        }
      },
      meta: {
        getError: (rowIndex: number) => getErrorForCell(rowIndex, 'preferredphases'),
      },
    },
    {
      accessorKey: 'MaxConcurrent',
      header: 'Max Concurrent',
      meta: {
        getError: (rowIndex: number) => getErrorForCell(rowIndex, 'maxconcurrent'),
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Tasks</h1>
        <button
          onClick={() => runValidation(data)}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Revalidate
        </button>
      </div>

      {errorSummary.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-red-800 font-semibold">
              {errorSummary.length} Validation Error{errorSummary.length > 1 ? 's' : ''} Found
            </h3>
          </div>
          <div className="max-h-32 overflow-y-auto">
            <ul className="text-sm text-red-700 space-y-1">
              {errorSummary.map((error, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <AIQuerySideBar
        entity="tasks"
        data={tasks}
        setFilteredData={setFilteredTasks} 
      />

      {/* Use filteredTasks for the DataTable display */}
      <DataTable 
        data={filteredTasks} 
        columns={columns} 
        onUpdate={handleUpdate} 
      />
    </div>
  );
}