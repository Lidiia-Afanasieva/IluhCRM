import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 1,
      },
    },
  },
});