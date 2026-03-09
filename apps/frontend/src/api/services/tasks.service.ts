import { httpRequest } from "../httpClient";
import type { TaskStatus } from "../dto/tasks.dto";
import type { TaskListItemDto } from "../dto/tasksList.dto";
import type { TaskUpdateRequest } from "../dto/tasksUpdate.dto";

export type TasksQuery = {
  status?: TaskStatus;
  overdue?: boolean;
  customerId?: string;
  assignedUserId?: string;
  from?: string; // ISO date
  to?: string; // ISO date
};

export const tasksService = {
  async list(params: TasksQuery): Promise<TaskListItemDto[]> {
    const res = await httpRequest<TaskListItemDto[]>({
      method: "GET",
      path: "/tasks",
      query: params,
    });
    return res.data;
  },

  async update(taskId: string, body: TaskUpdateRequest): Promise<TaskListItemDto> {
    const res = await httpRequest<TaskListItemDto>({
      method: "PATCH",
      path: `/tasks/${taskId}`,
      body,
    });
    return res.data;
  },
};