import { Paper, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
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

export function SlaTable(props: Props) {
  const s = props.data.sla;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
        SLA первого ответа
      </Typography>

      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell sx={{ width: 260 }}>Целевое значение</TableCell>
            <TableCell>{fmtSeconds(s.firstResponseTargetSeconds)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Фактическое среднее</TableCell>
            <TableCell>{fmtSeconds(s.firstResponseActualAvgSeconds)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Доля в SLA</TableCell>
            <TableCell>{`${s.withinSlaPercent}%`}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}