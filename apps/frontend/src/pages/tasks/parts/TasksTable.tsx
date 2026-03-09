import dayjs from "dayjs";
import { useMemo } from "react";
import { IconButton, Paper, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import type { TaskListItemDto } from "../../../api/dto/tasksList.dto";
import { TaskStatusChip } from "../../../components/common/TaskStatusChip";

type Props = {
  rows: TaskListItemDto[];
  onEdit: (row: TaskListItemDto) => void;
};

function fmt(dtIso: string) {
  return dayjs(dtIso).format("YYYY-MM-DD HH:mm");
}

export function TasksTable(props: Props) {
  const nav = useNavigate();

  const columns: GridColDef<TaskListItemDto>[] = useMemo(() => {
    return [
      { field: "customerName", headerName: "Клиент", flex: 1, minWidth: 220 },
      { field: "title", headerName: "Задача", flex: 1, minWidth: 280 },
      {
        field: "status",
        headerName: "Статус",
        width: 140,
        renderCell: (p) => <TaskStatusChip status={p.row.status} />,
        sortable: false,
      },
      {
        field: "dueAt",
        headerName: "Дедлайн",
        width: 180,
        valueFormatter: (p) => fmt(String(p.value)),
      },
      { field: "daysOverdue", headerName: "Просрочено, дней", width: 160 },
      { field: "priority", headerName: "Приоритет", width: 120 },
      { field: "assignedTo", headerName: "Ответственный", width: 180 },
      {
        field: "actions",
        headerName: "",
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (p) => (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              props.onEdit(p.row);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ),
      },
    ];
  }, [props]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
        Список задач
      </Typography>

      <DataGrid
        rows={props.rows}
        columns={columns}
        getRowId={(r) => r.id}
        disableRowSelectionOnClick
        onRowClick={(p) => nav(`/customers/${p.row.customerId}`)}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        sx={{ height: 560 }}
      />
    </Paper>
  );
}