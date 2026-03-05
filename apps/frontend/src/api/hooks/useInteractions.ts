import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { interactionsService } from "../services/interactions.service";
import { queryKeys } from "../queryKeys";
import type { CreateInteractionRequest } from "../dto/interactions.dto";

export function useInteractions(customerId: string) {
  return useQuery({
    queryKey: queryKeys.interactions(customerId),
    queryFn: () => interactionsService.list(customerId),
    enabled: Boolean(customerId),
  });
}

export function useAddInteraction(customerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateInteractionRequest) => interactionsService.create(customerId, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.interactions(customerId) });
      await qc.invalidateQueries({ queryKey: queryKeys.customerById(customerId) });
    },
  });
}