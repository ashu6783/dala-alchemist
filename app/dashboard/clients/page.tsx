'use client';

import { useDataStore } from '@/store/dataStore';
import DataTable from '@/components/DataTable';
import { useState, useEffect } from 'react';
import type { Client } from '@/types/client';
import { ColumnDef } from '@tanstack/react-table';
import { validateClients } from '@/lib/validations';
import AIQuerySideBar from '@/components/AIQuerySideBar';

export default function ClientPage() {
  const { clients, tasks, setClients } = useDataStore();
  const [data, setData] = useState<Client[]>(clients);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorSummary, setErrorSummary] = useState<string[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>(clients);

  useEffect(() => {
    runValidation(clients);
  }, [clients, tasks]);

  const runValidation = (clientData: Client[]) => {
    const errorList = validateClients(clientData, tasks);
    const errorMap: Record<string, string> = {};

    errorList.forEach((err) => {
      const [rowInfo, ...rest] = err.split(':');
      const message = rest.join(':').trim();
      const rowNum = rowInfo.match(/\d+/)?.[0];
      const fieldMatch = message.match(/(ClientID|PriorityLevel|RequestedTaskIDs|AttributesJSON)/i);
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
    columnId: keyof Client,
    value: any
  ) => {
    const updated = [...data];

    // Normalize RequestedTaskIDs
    if (columnId === 'RequestedTaskIDs') {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) value = parsed;
        } catch {
          value = value.split(',').map((v: string) => v.trim()).filter(Boolean);
        }
      }
    }

    // Normalize AttributesJSON
    if (columnId === 'AttributesJSON') {
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch {
          // Keep invalid to show error
        }
      }
    }

    updated[rowIndex] = {
      ...updated[rowIndex],
      [columnId]: value,
    };

    setData(updated);
    setClients(updated);
    runValidation(updated);
  };

  const getErrorForCell = (rowIndex: number, columnId: string) => {
    const key = `${rowIndex}-${columnId.toLowerCase()}`;
    return errors[key];
  };

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'ClientID',
      header: 'Client ID',
      meta: {
        getError: (rowIndex: number) => getErrorForCell(rowIndex, 'clientid'),
      },
    },
    {
      accessorKey: 'Name',
      header: 'Name',
    },
    {
      accessorKey: 'PriorityLevel',
      header: 'Priority',
      meta: {
        getError: (rowIndex: number) => getErrorForCell(rowIndex, 'prioritylevel'),
      },
    },
    {
      accessorKey: 'RequestedTaskIDs',
      header: 'Task IDs',
      cell: ({ getValue }) => {
        const val = getValue();
        if (Array.isArray(val)) {
          return val.join(', ');
        } else if (typeof val === 'string') {
          return val;
        } else {
          try {
            return JSON.stringify(val);
          } catch {
            return String(val);
          }
        }
      },
      meta: {
        getError: (rowIndex: number) => getErrorForCell(rowIndex, 'requestedtaskids'),
      },
    },
    {
      accessorKey: 'AttributesJSON',
      header: 'Attributes',
      cell: ({ getValue }) => {
        try {
          const val = getValue();
          return typeof val === 'object' ? JSON.stringify(val) : String(val);
        } catch {
          return String(getValue());
        }
      },
      meta: {
        getError: (rowIndex: number) => getErrorForCell(rowIndex, 'attributesjson'),
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Clients</h1>
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
              entity="clients"
              data={tasks}
              setFilteredData={setFilteredClients} 
            />

      <DataTable data={data} columns={columns} onUpdate={handleUpdate} />
    </div>
  );
}