import { Grid, Paper, Typography } from "@mui/material";
import type { QualityDashboardDto } from "../../../api/dto/qualityDashboard.dto";

type Props = {
  data: QualityDashboardDto;
};

function fmtSeconds(sec: number) {
  if (!Number.isFinite(sec) || sec <= 0) return "нет";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h <= 0) return `${m} мин`;
  return `${h} ч ${m} мин`;
}

export function QualityKpiCards(props: Props) {
  const k = props.data.kpi;

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Среднее время первого ответа
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {fmtSeconds(k.firstResponseSecondsAvg)}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Просроченные задачи
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {k.overdueTasksCount}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Взаимодействия за период
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {k.interactionsCount}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Средняя NPS
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {k.npsAvg === null ? "нет" : String(k.npsAvg)}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}