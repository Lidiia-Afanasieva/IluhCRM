import { Box, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { DateRangeFields, type DateRangeValue } from "../../../components/common/DateRangeFields";

export type TasksFiltersValue = {
  period: DateRangeValue;
  status: "" | "open" | "done" | "canceled";
  overdue: "" | "true" | "false";
};

type Props = {
  value: TasksFiltersValue;
  onChange: (next: TasksFiltersValue) => void;
};

export function TasksFiltersBar(props: Props) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
        Фильтры
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        <DateRangeFields
          value={props.value.period}
          onChange={(p) => props.onChange({ ...props.value, period: p })}
        />

        <TextField
          label="Статус"
          select
          value={props.value.status}
          onChange={(e) => props.onChange({ ...props.value, status: e.target.value as any })}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">Все</MenuItem>
          <MenuItem value="open">Открыта</MenuItem>
          <MenuItem value="done">Выполнена</MenuItem>
          <MenuItem value="canceled">Отменена</MenuItem>
        </TextField>

        <TextField
          label="Просрочка"
          select
          value={props.value.overdue}
          onChange={(e) => props.onChange({ ...props.value, overdue: e.target.value as any })}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">Все</MenuItem>
          <MenuItem value="true">Только просроченные</MenuItem>
          <MenuItem value="false">Только не просроченные</MenuItem>
        </TextField>
      </Box>
    </Paper>
  );
}