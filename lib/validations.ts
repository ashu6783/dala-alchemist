import type { Client } from "@/types/client";
import type { Worker } from "@/types/worker";
import type { Task } from "@/types/task";

export function validateClients(clients: Client[], tasks: Task[]) {
  const errors: string[] = [];
  const seenIDs = new Set();

  clients.forEach((client, ind) => {
    const path = `Client Row ${ind + 1}`;

    if (!client.ClientID?.trim()) {
      errors.push(`${path}: Missing ClientID`);
    }

    if (
      client.PriorityLevel == null ||
      isNaN(client.PriorityLevel) ||
      client.PriorityLevel < 1 ||
      client.PriorityLevel > 5
    ) {
      errors.push(`${path}: Priority level must be between 1 to 5`);
    }

    if (seenIDs.has(client.ClientID)) {
      errors.push(`${path}: Duplicate ClientID`);
    } else {
      seenIDs.add(client.ClientID);
    }

    if (!Array.isArray(client.RequestedTaskIDs)) {
      errors.push(`${path}: RequestedTaskIDs should be an array`);
    } else {
      client.RequestedTaskIDs.forEach((id) => {
        if (!tasks.some((task) => task.TaskId === id)) {
          errors.push(`${path}: Invalid TaskID "${id}" in RequestedTaskIDs`);
        }
      });
    }

    // Ensure it's an object before JSON.stringify
    try {
      if (
        typeof client.AttributesJSON !== 'object' ||
        client.AttributesJSON === null ||
        Array.isArray(client.AttributesJSON)
      ) {
        throw new Error();
      }
      JSON.stringify(client.AttributesJSON);
    } catch (error) {
      errors.push(`${path}: AttributesJSON is invalid`);
    }
  });

  return errors;
}


export function validateTasks(tasks: Task[], workers: Worker[]) {
  const errors: string[] = [];
  const seenIDs = new Set();

  tasks.forEach((task, ind) => {
    const path = `Task Row ${ind + 1}`;

    if (!task.TaskId) errors.push(`${path}: Missing TaskId`);

    if (seenIDs.has(task.TaskId))
      errors.push(`${path}: Duplicate TaskId`);
    else
      seenIDs.add(task.TaskId);

    if (task.Duration == null || task.Duration < 1)
      errors.push(`${path}: Duration must be >= 1`);

    if (!Array.isArray(task.RequiredSkills)) {
      errors.push(`${path}: RequiredSkills should be an array`);
    } else {
      const matched = task.RequiredSkills.some(skill =>
        workers.some(worker => worker.Skills.includes(skill))
      );

      if (!matched) {
        errors.push(`${path}: No worker found with required skills: ${task.RequiredSkills.join(", ")}`);
      }
    }

    if (!Array.isArray(task.PreferredPhases))
      errors.push(`${path}: PreferredPhases should be an array`);

    if (!Number.isInteger(task.MaxConcurrent) || task.MaxConcurrent < 1)
      errors.push(`${path}: Invalid MaxConcurrent value`);
  });

  return errors;
}

export function validateWorkers(workers: Worker[]) {
  const errors: string[] = [];
  const seenIDs = new Set();

  workers.forEach((worker, index) => {
    const path = `Worker Row ${index + 1}`;

    if (!worker.WorkerID)
      errors.push(`${path}: Missing WorkerID`);

    if (seenIDs.has(worker.WorkerID))
      errors.push(`${path}: Duplicate WorkerID`);
    else
      seenIDs.add(worker.WorkerID);

    if (!Array.isArray(worker.Skills) || worker.Skills.length === 0)
      errors.push(`${path}: Skills must be a non-empty array`);

    if (!Array.isArray(worker.AvailableSlots))
      errors.push(`${path}: AvailableSlots must be an array of phases`);

    if (worker.MaxLoadPerPhase == null || worker.MaxLoadPerPhase < 1)
      errors.push(`${path}: MaxLoadPerPhase must be ≥ 1`);
  });

  return errors;
}
