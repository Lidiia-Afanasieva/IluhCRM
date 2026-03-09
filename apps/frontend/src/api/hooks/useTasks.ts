import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { tasksService, type TasksQuery } from "../services/tasks.service";

export function useTasks(params: TasksQuery) {
  return useQuery({
    queryKey: queryKeys.tasks(params),
    queryFn: () => tasksService.list(params),
  });
}