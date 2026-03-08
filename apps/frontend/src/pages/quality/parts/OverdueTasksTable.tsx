import dayjs from "dayjs";
import { Paper, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { QualityDashboardDto } from "../../../api/dto/qualityDashboard.dto";

type Props = {
  data: QualityDashboardDto;
};

function fmt(dtIso: string) {
  return dayjs(dtIso).format("YYYY-MM-DD HH:mm");
}

export function OverdueTasksTable(props: Props) {
  const nav = useNavigate();

  const rows = props.data.overdueTasks;

  const columns: GridColDef<(typeof rows)[number]>[] = useMemo(() => {
    return [
      { field: "customerName", headerName: "Клиент", flex: 1, minWidth: 220 },
      { field: "title", headerName: "Задача", flex: 1, minWidth: 260 },
      { field: "priority", headerName: "Приоритет", width: 120 },
      {
        field: "dueAt",
        headerName: "Дедлайн",
        width: 180,
        valueFormatter: (p) => fmt(String(p.value)),
      },
      { field: "daysOverdue", headerName: "Просрочено, дней", width: 160 },
      { field: "assignedTo", headerName: "Ответственный", width: 180 },
      { field: "status", headerName: "Статус", width: 120 },
    ];
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
        Просроченные задачи
      </Typography>

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        disableRowSelectionOnClick
        onRowClick={(p) => nav(`/customers/${p.row.customerId}`)}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        sx={{ height: 520 }}
      />
    </Paper>
  );
}