import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Box } from "@mui/material";

import { PageHeader } from "../../components/common/PageHeader";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";

import { useQualityDashboard } from "../../api/hooks/useQualityDashboard";
import type { QualityFiltersValue } from "./parts/QualityFilters";
import { QualityFilters } from "./parts/QualityFilters";
import { QualityKpiCards } from "./parts/QualityKpiCards";
import { SlaTable } from "./parts/SlaTable";
import { OverdueTasksTable } from "./parts/OverdueTasksTable";

function defaultFilters(): QualityFiltersValue {
  const to = dayjs().format("YYYY-MM-DD");
  const from = dayjs().subtract(6, "day").format("YYYY-MM-DD");
  return {
    period: { from, to },
    stage: "",
  };
}

export function QualityDashboardPage() {
  const [filters, setFilters] = useState<QualityFiltersValue>(() => defaultFilters());

  const params = useMemo(() => {
    return {
      from: filters.period.from,
      to: filters.period.to,
      stage: filters.stage ? filters.stage : undefined,
    };
  }, [filters.period.from, filters.period.to, filters.stage]);

  const query = useQualityDashboard(params);

  const subtitle = useMemo(() => {
    return `Период: ${filters.period.from} .. ${filters.period.to}`;
  }, [filters.period.from, filters.period.to]);

  return (
    <>
      <PageHeader title="Качество обслуживания" subtitle={subtitle} />

      <QualityFilters value={filters} onChange={setFilters} />

      {query.isLoading ? <LoadingState /> : null}
      {query.isError ? (
        <ErrorState title="Ошибка" description="Не удалось загрузить данные качества обслуживания." />
      ) : null}

      {query.isSuccess ? (
        <Box>
          <QualityKpiCards data={query.data} />
          <SlaTable data={query.data} />

          {query.data.overdueTasks.length === 0 ? (
            <EmptyState title="Просрочек нет" description="За выбранный период просроченные задачи не найдены." />
          ) : (
            <OverdueTasksTable data={query.data} />
          )}
        </Box>
      ) : null}
    </>
  );
}