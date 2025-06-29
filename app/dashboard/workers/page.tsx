'use client';

import { useDataStore } from '@/store/dataStore';
import DataTable from '@/components/DataTable';
import { useState, useEffect } from 'react';
import type { Worker } from '@/types/worker';
import { ColumnDef } from '@tanstack/react-table';
import { validateWorkers } from '@/lib/validations';

export default function WorkersPage() {
  const { workers, setWorkers } = useDataStore();
  const [data, setData] = useState<Worker[]>(workers);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorSummary, setErrorSummary] = useState<string[]>([]);

  useEffect(() => {
    runValidation(workers);
  }, [workers]);

  const runValidation = (workerData: Worker[]) => {
    const errorList = validateWorkers(workerData);
    const errorMap: Record<string, string> = {};

    errorList.forEach((err) => {
      const [rowInfo, ...rest] = err.split(':');
      const message = rest.join(':').trim();
      const rowNum = rowInfo.match(/\d+/)?.[0];
      const fieldMatch = message.match(/(WorkerID|Skills|AvailableSlots|MaxLoadPerPhase)/i);
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
    columnId: keyof Worker,
    value: any
  ) => {
    const updated = [...data];

    // Normalize Skills
    if (columnId === 'Skills') {
      if (typeof value === 'string') {
        value = value.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }

    // Normalize AvailableSlots
    if (columnId === 'AvailableSlots') {
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch {
          // Keep invalid to show error
        }
      }
    }

    // Normalize MaxLoadPerPhase
    if (columnId === 'MaxLoadPerPhase') {
      value = Number(value);
    }

    updated[rowIndex] = {
      ...updated[rowIndex],
      [columnId]: value,
    };

    setData(updated);
    setWorkers(updated);
    runValidation(updated);
  };

  const getErrorForCell = (rowIndex: number, columnId: string) => {
    const key = `${rowIndex}-${columnId.toLowerCase()}`;
    return errors[key];
  };

  const columns: ColumnDef<Worker>[] = [
    {
      accessorKey: 'WorkerID',
      header: 'Worker ID',
      meta: {
        getError: (rowIndex: number) => getErrorForCell(rowIndex, 'workerid'),
      },
    },
    {
      accessorKey: 'WorkerName',
      header: 'Worker Name',
    },
    {
      accessorKey: 'Skills',
      header: 'Skills',
      cell: ({ getValue }) => {
        const val = getValue();
        return Array.isArray(val) ? val.join(', ') : String(val ?? '');
      },
      meta: {
        getError: (rowIndex: number) => getErrorForCell(rowIndex, 'skills'),
      },
    },
    {
      accessorKey: 'AvailableSlots',
      header: 'Available Slots',
      cell: ({ getValue }) => {
        const val = getValue();
        try {
          return typeof val === 'object' ? JSON.stringify(val) : String(val);
        } catch {
          return String(val);
        }
      },
      meta: {
        getError: (rowIndex: number) => getErrorForCell(rowIndex, 'availableslots'),
      },
    },
    {
      accessorKey: 'MaxLoadPerPhase',
      header: 'Max Load Per Phase',
      meta: {
        getError: (rowIndex: number) => getErrorForCell(rowIndex, 'maxloadperphase'),
      },
    },
    {
      accessorKey: 'WorkerGroup',
      header: 'Worker Group',
    },
    {
      accessorKey: 'QualificationLevel',
      header: 'Qualification Level',
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Workers</h1>
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

      <DataTable data={data} columns={columns} onUpdate={handleUpdate} />
    </div>
  );
}