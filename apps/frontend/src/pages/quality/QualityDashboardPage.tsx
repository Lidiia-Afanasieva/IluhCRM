import { Paper, Typography } from "@mui/material";
import { PageHeader } from "../../components/common/PageHeader";

export function QualityDashboardPage() {
  return (
    <>
      <PageHeader
        title="Качество обслуживания"
        subtitle="На этом экране далее появятся KPI, просрочки, SLA и фильтры"
      />
      <Paper sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Заглушка страницы. Следующий шаг после каркаса: таблица задач и карточки KPI.
        </Typography>
      </Paper>
    </>
  );
}