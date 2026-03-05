import { httpRequest } from "../httpClient";
import type { InteractionDto, CreateInteractionRequest } from "../dto/interactions.dto";

export const interactionsService = {
  async list(customerId: string): Promise<InteractionDto[]> {
    const res = await httpRequest<InteractionDto[]>({
      method: "GET",
      path: `/customers/${customerId}/interactions`,
    });
    return res.data;
  },

  async create(customerId: string, body: CreateInteractionRequest): Promise<InteractionDto> {
    const res = await httpRequest<InteractionDto>({
      method: "POST",
      path: `/customers/${customerId}/interactions`,
      body,
    });
    return res.data;
  },
};