import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "../services/tasks.service";
import type { TaskCreateRequest } from "../dto/tasksCreate.dto";

export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: TaskCreateRequest) => tasksService.create(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["tasks"] });
      await qc.invalidateQueries({ queryKey: ["metrics", "quality"] });
      await qc.invalidateQueries({ queryKey: ["customer"] });
    },
  });
}