import {create} from 'zustand';
import { Client } from '@/types/client';
import { Worker } from '@/types/worker';
import { Task } from '@/types/task';
import { Rule } from '@/types/rule';

interface ErrorMap{
  clients: { [id: string]: string[] };
  workers: { [id: string]: string[] };
  tasks: { [id: string]: string[] };
}

interface DataState{
    clients:Client[];
    workers:Worker[];
    tasks:Task[];
    rules:Rule[];
    validationErrors: ErrorMap;
    setClients:(data: Client[])=>void;
    setWorkers:(data: Worker[])=>void;
    setTasks:(data: Task[])=>void;
    setRules:(data:Rule[])=>void;
     setValidationErrors: (errors: ErrorMap) => void;
     addRule:(rule:Rule)=>void;
     removeRule:(index:number)=>void;
    
}

export const useDataStore = create<DataState>((set) => ({
  clients: [],
  workers: [],
  tasks: [],
   rules: [] as Rule[],
  setRules: (rules: Rule[]) => set({ rules }),
   validationErrors: {
    clients: {},
    workers: {},
    tasks: {},
  } as ErrorMap,
  setClients: (data) => set({ clients: data }),
  setWorkers: (data) => set({ workers: data }),
  setTasks: (data) => set({ tasks: data }),
   setValidationErrors: (errors: ErrorMap) => set({ validationErrors: errors }),
   addRule:(rule:Rule)=>
    set((state)=>({rules:[...state.rules,rule]})),

   removeRule:(index:number)=> 
    set((state)=>({rules:state.rules.filter((_,i)=>i!==index)})),
}));