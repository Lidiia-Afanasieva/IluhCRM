import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { metricsService } from "../services/metrics.service";
import type { QualityDashboardQuery } from "../dto/qualityDashboard.dto";

export function useQualityDashboard(params: QualityDashboardQuery) {
  return useQuery({
    queryKey: queryKeys.qualityDashboard(params),
    queryFn: () => metricsService.quality(params),
  });
}