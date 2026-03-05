import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { personalizationService } from "../services/personalization.service";
import { queryKeys } from "../queryKeys";
import type { AddNoteRequest, AddNextActionRequest } from "../dto/personalization.dto";

export function usePersonalization(customerId: string) {
  return useQuery({
    queryKey: queryKeys.personalization(customerId),
    queryFn: () => personalizationService.get(customerId),
    enabled: Boolean(customerId),
  });
}

export function useAddNote(customerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AddNoteRequest) => personalizationService.addNote(customerId, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.personalization(customerId) });
    },
  });
}

export function useSetNextAction(customerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AddNextActionRequest) => personalizationService.setNextAction(customerId, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.personalization(customerId) });
      await qc.invalidateQueries({ queryKey: queryKeys.customerById(customerId) });
    },
  });
}