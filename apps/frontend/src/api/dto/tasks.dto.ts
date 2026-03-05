export type TaskStatus = "open" | "done" | "canceled";

export type TaskDto = {
  id: string;
  customerId: string;
  title: string;
  status: TaskStatus;
  dueAt: string;
  priority: number;
  assignedTo: string;
};