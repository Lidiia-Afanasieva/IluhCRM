import { httpRequest } from "../httpClient";
import type { QualityDashboardDto, QualityDashboardQuery } from "../dto/qualityDashboard.dto";

export const metricsService = {
  async quality(params: QualityDashboardQuery): Promise<QualityDashboardDto> {
    const res = await httpRequest<QualityDashboardDto>({
      method: "GET",
      path: "/metrics/quality",
      query: params,
    });
    return res.data;
  },
};