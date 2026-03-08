import { Box, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { DateRangeFields, type DateRangeValue } from "../../../components/common/DateRangeFields";

export type QualityFiltersValue = {
  period: DateRangeValue;
  stage: string;
};

type Props = {
  value: QualityFiltersValue;
  onChange: (next: QualityFiltersValue) => void;
};

export function QualityFilters(props: Props) {
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
          label="Стадия"
          select
          value={props.value.stage}
          onChange={(e) => props.onChange({ ...props.value, stage: e.target.value })}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">Все</MenuItem>
          <MenuItem value="lead">Lead</MenuItem>
          <MenuItem value="in_work">In work</MenuItem>
          <MenuItem value="proposal">Proposal</MenuItem>
          <MenuItem value="won">Won</MenuItem>
          <MenuItem value="lost">Lost</MenuItem>
        </TextField>
      </Box>
    </Paper>
  );
}