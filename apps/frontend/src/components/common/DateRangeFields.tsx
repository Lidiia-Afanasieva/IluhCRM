import { Box, TextField } from "@mui/material";

export type DateRangeValue = {
  from: string; // ISO date
  to: string; // ISO date
};

type Props = {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
};

export function DateRangeFields(props: Props) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <TextField
        label="С"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={props.value.from}
        onChange={(e) => props.onChange({ ...props.value, from: e.target.value })}
        sx={{ minWidth: 180 }}
      />
      <TextField
        label="По"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={props.value.to}
        onChange={(e) => props.onChange({ ...props.value, to: e.target.value })}
        sx={{ minWidth: 180 }}
      />
    </Box>
  );
}