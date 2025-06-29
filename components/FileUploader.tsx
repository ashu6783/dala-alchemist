'use client';
import { useState } from "react";
import Papa from 'papaparse';
import { useDataStore } from "@/store/dataStore";
import { useRouter } from "next/navigation";

export default function FileUploader() {
  const { setClients, setWorkers, setTasks } = useDataStore();
  const router = useRouter();
  const [uploaded, setUploaded] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const errors: string[] = [];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    if (files.length !== 3) {
      alert("Please upload exactly 3 files: clients, workers, tasks");
      return;
    }

    setIsProcessing(true);
    let uploadedCount = 0;

    files.forEach((file) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const raw = results.data;
          const clean = raw.map((row: any) => {
            if (file.name.toLowerCase().includes('clients')) {
              return {
                ...row,
                PriorityLevel: Number(row.PriorityLevel),
                RequestedTaskIDs: row.RequestedTaskIDs?.split(',').map((id: string) => id.trim()),
                AttributesJSON: row.AttributesJSON ? JSON.parse(row.AttributesJSON) : {},
              };
            }
            if (file.name.toLowerCase().includes('tasks')) {
              return {
                ...row,
                Duration: Number(row.Duration),
                RequiredSkills: row.RequiredSkills?.split(',').map((s: string) => s.trim()),
                PreferredPhases: parsePreferredPhases(row.PreferredPhases),
                MaxConcurrent: Number(row.MaxConcurrent),
              };
            }
            if (file.name.toLowerCase().includes('workers')) {
              return {
                ...row,
                Skills: row.Skills?.split(',').map((s: string) => s.trim()),
                AvailableSlots: JSON.parse(row.AvailableSlots || '[]'),
                MaxLoadPerPhase: Number(row.MaxLoadPerPhase),
              };
            }
            return row;
          });

          if (file.name.toLowerCase().includes('clients')) setClients(clean);
          if (file.name.toLowerCase().includes('workers')) setWorkers(clean);
          if (file.name.toLowerCase().includes('tasks')) setTasks(clean);

          uploadedCount++;
          if (uploadedCount === 3) {
            setUploaded(true);
            setIsProcessing(false);
            router.push('/dashboard'); // ✅ Navigate only when all 3 files are parsed
          }
        },
        error: (err) => {
          setIsProcessing(false);
          alert(`Error parsing ${file.name}: ${err.message}`);
        },
      });
    });
  };

  const parsePreferredPhases = (val: string): number[] => {
    if (!val) return [];
    if (val.includes('-')) {
      const [start, end] = val.split('-').map(Number);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    if (val.startsWith('[')) return JSON.parse(val);
    return val.split(',').map(Number);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Data</h2>
        <p className="text-gray-600">Upload your CSV files to get started with task management</p>
      </div>

      <div
        className={`relative p-12 border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 scale-105'
            : uploaded
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
        } ${isProcessing ? 'pointer-events-none' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessing && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Processing files...</p>
            </div>
          </div>
        )}

        <div className="text-center">
          {uploaded ? (
            <div className="text-green-600">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Files Uploaded Successfully!</h3>
              <p className="text-green-700">Redirecting to dashboard...</p>
            </div>
          ) : (
            <>
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isDragOver ? 'Drop your files here' : 'Drag & drop your CSV files'}
              </h3>
              <p className="text-gray-600 mb-6">or click to browse</p>
              
              <input
                type="file"
                multiple
                accept=".csv"
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isProcessing}
              />
              
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 pointer-events-none"
                disabled={isProcessing}
              >
                Choose Files
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Required Files:</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <code className="bg-black px-2 py-1 rounded text-sm font-mono">clients.csv</code>
            <span className="text-sm text-gray-600">Client information and task requests</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <code className="bg-black px-2 py-1 rounded text-sm font-mono">workers.csv</code>
            <span className="text-sm text-gray-600">Worker profiles and availability</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <code className="bg-black px-2 py-1 rounded text-sm font-mono">tasks.csv</code>
            <span className="text-sm text-gray-600">Task definitions and requirements</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> All three files must be uploaded together for the system to work properly.
          </p>
        </div>
      </div>
    </div>
  );
}