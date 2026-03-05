import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function NotFoundPage() {
  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        Страница не найдена
      </Typography>
      <Button component={RouterLink} to="/quality" variant="contained">
        На главную
      </Button>
    </Box>
  );
}