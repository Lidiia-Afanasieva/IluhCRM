import { Box, MenuItem, TextField } from "@mui/material";

export type CustomersFilters = {
  q: string;
  stage: string;
};

type Props = {
  value: CustomersFilters;
  onChange: (next: CustomersFilters) => void;
};

export function CustomersFiltersBar(props: Props) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
      <TextField
        label="Поиск"
        value={props.value.q}
        onChange={(e) => props.onChange({ ...props.value, q: e.target.value })}
        sx={{ minWidth: 260 }}
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
  );
}