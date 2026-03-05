import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import { TopBar } from "./TopBar";
import { SideNav } from "./SideNav";

const drawerWidth = 280;

export function AppShell() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <TopBar drawerWidth={drawerWidth} />
      <SideNav drawerWidth={drawerWidth} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}