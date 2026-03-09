import type { TaskStatus } from "./tasks.dto";

export type TaskUpdateRequest = {
  status: TaskStatus;
  dueAt?: string; // ISO datetime
  priority?: number;
};