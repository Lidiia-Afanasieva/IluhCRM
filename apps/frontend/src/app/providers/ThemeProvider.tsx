import type { PropsWithChildren } from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { theme } from "../theme/theme";


export function ThemeProvider(props: PropsWithChildren) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </MuiThemeProvider>
  );
}