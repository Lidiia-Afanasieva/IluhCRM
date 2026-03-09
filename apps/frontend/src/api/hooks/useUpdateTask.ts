import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "../services/tasks.service";
import type { TaskUpdateRequest } from "../dto/tasksUpdate.dto";

export function useUpdateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (x: { taskId: string; body: TaskUpdateRequest }) =>
      tasksService.update(x.taskId, x.body),

    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["tasks"] });
      await qc.invalidateQueries({ queryKey: ["metrics", "quality"] });
    },
  });
}