import type { TaskStatus } from "./tasks.dto";

export type TaskListItemDto = {
  id: string;
  customerId: string;
  customerName: string;

  title: string;
  status: TaskStatus;
  dueAt: string; // ISO datetime
  priority: number;
  assignedTo: string;

  isOverdue: boolean;
  daysOverdue: number;
};