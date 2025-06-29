'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import React, { useState, useRef, useEffect } from 'react';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onUpdate: (rowIndex: number, columnId: keyof T, value: any) => void;
}

export default function DataTable<T>({
  data,
  columns,
  onUpdate,
}: DataTableProps<T>) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, columnId: string) => {
    if (e.key === 'Enter') {
      onUpdate(rowIndex, columnId as keyof T, e.currentTarget.value);
      setEditingCell(null);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const startEditing = (rowIndex: number, columnId: string) => {
    setEditingCell({ row: rowIndex, col: columnId });
    setHoveredCell(null);
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                {headerGroup.headers.map((header) => (
                  <th 
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map((row, index) => (
              <tr 
                key={row.id} 
                className={`
                  transition-all duration-200 ease-in-out
                  ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                  hover:bg-blue-50 hover:shadow-sm
                  group
                `}
              >
                {row.getVisibleCells().map((cell) => {
                  const isEditing =
                    editingCell?.row === row.index && editingCell?.col === cell.column.id;
                  const isHovered =
                    hoveredCell?.row === row.index && hoveredCell?.col === cell.column.id;
                  
                  // Get error from column meta if available
                  const columnMeta = cell.column.columnDef.meta as any;
                  const hasError = columnMeta?.getError?.(row.index);

                  return (
                    <td
                      key={cell.id}
                      className={`
                        px-6 py-4 text-sm text-slate-900 cursor-pointer
                        transition-all duration-150
                        ${isEditing ? 'bg-blue-100 ring-2 ring-blue-400 ring-inset' : ''}
                        ${hasError ? 'bg-red-50 border-2 border-red-300' : ''}
                        hover:bg-slate-100 group-hover:bg-transparent
                        relative
                      `}
                      onMouseEnter={() => 
                        !isEditing && setHoveredCell({ row: row.index, col: cell.column.id })
                      }
                      onMouseLeave={() => 
                        !isEditing && setHoveredCell(null)
                      }
                      title={hasError ? hasError : "Click pencil icon to edit"}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          className="
                            w-full px-3 py-2 text-sm
                            border border-blue-300 rounded-md
                            bg-white shadow-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            transition-all duration-200
                          "
                          defaultValue={String(cell.getValue() ?? '')}
                          onBlur={(e) => {
                            onUpdate(row.index, cell.column.id as keyof T, e.target.value);
                            setEditingCell(null);
                          }}
                          onKeyDown={(e) => handleKeyDown(e, row.index, cell.column.id)}
                        />
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className={hasError ? 'text-red-800' : ''}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                            {hasError && (
                              <div className="text-xs text-red-600 mt-1 font-medium">
                                {hasError}
                              </div>
                            )}
                          </div>
                          
                          {(isHovered || isEditing) && (
                            <button
                              onClick={() => startEditing(row.index, cell.column.id)}
                              className="ml-2 p-1 rounded hover:bg-blue-100 transition-colors duration-200"
                              title="Edit cell"
                            >
                              <svg 
                                className="w-4 h-4 text-blue-600" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
        <p className="text-xs text-slate-500 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Hover over cells and click the pencil icon to edit • Press Enter to save • Press Escape to cancel
        </p>
      </div>
    </div>
  );
}