import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qualityService } from "../services/quality.service";
import { queryKeys } from "../queryKeys";
import type { AddFeedbackRequest } from "../dto/quality.dto";

export function useQuality(customerId: string) {
  return useQuery({
    queryKey: queryKeys.quality(customerId),
    queryFn: () => qualityService.get(customerId),
    enabled: Boolean(customerId),
  });
}

export function useAddFeedback(customerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AddFeedbackRequest) => qualityService.addFeedback(customerId, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.quality(customerId) });
    },
  });
}