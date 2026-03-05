import { httpRequest } from "../httpClient";
import type {
  PersonalizationDto,
  AddNoteRequest,
  AddNextActionRequest,
} from "../dto/personalization.dto";

export const personalizationService = {
  async get(customerId: string): Promise<PersonalizationDto> {
    const res = await httpRequest<PersonalizationDto>({
      method: "GET",
      path: `/customers/${customerId}/personalization`,
    });
    return res.data;
  },

  async addNote(customerId: string, body: AddNoteRequest): Promise<PersonalizationDto> {
    const res = await httpRequest<PersonalizationDto>({
      method: "POST",
      path: `/customers/${customerId}/personalization/note`,
      body,
    });
    return res.data;
  },

  async setNextAction(customerId: string, body: AddNextActionRequest): Promise<PersonalizationDto> {
    const res = await httpRequest<PersonalizationDto>({
      method: "POST",
      path: `/customers/${customerId}/personalization/next-action`,
      body,
    });
    return res.data;
  },
};