import { Box, CircularProgress } from "@mui/material";

export function LoadingState() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
      <CircularProgress />
    </Box>
  );
}