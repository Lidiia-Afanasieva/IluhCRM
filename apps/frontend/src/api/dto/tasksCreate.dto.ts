import type { TaskStatus } from "./tasks.dto";

export type TaskCreateRequest = {
  customerId: string;
  title: string;
  dueAt: string; // ISO datetime
  priority: number;
  status: TaskStatus;
  assignedTo: string;
};