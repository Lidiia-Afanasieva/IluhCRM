import { Box, Typography } from "@mui/material";

type Props = {
  title: string;
  subtitle?: string;
};

export function PageHeader(props: Props) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {props.title}
      </Typography>
      {props.subtitle ? (
        <Typography variant="body2" color="text.secondary">
          {props.subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}