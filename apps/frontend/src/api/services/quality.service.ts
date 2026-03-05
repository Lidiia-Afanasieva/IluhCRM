import { httpRequest } from "../httpClient";
import type { QualityDto, AddFeedbackRequest } from "../dto/quality.dto";

export const qualityService = {
  async get(customerId: string): Promise<QualityDto> {
    const res = await httpRequest<QualityDto>({
      method: "GET",
      path: `/customers/${customerId}/quality`,
    });
    return res.data;
  },

  async addFeedback(customerId: string, body: AddFeedbackRequest): Promise<QualityDto> {
    const res = await httpRequest<QualityDto>({
      method: "POST",
      path: `/customers/${customerId}/quality/feedback`,
      body,
    });
    return res.data;
  },
};