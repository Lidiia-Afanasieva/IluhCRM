import { Box, Typography } from "@mui/material";

type Props = {
  title: string;
  description?: string;
};

export function EmptyState(props: Props) {
  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {props.title}
      </Typography>
      {props.description ? (
        <Typography variant="body2" color="text.secondary">
          {props.description}
        </Typography>
      ) : null}
    </Box>
  );
}