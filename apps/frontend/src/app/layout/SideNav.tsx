import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import TuneIcon from "@mui/icons-material/Tune";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

type Props = {
  drawerWidth: number;
};

// боковая панель, меню
export function SideNav(props: Props) {
  const location = useLocation();

  // список вкладок меню
  const items = [
    { to: "/quality", label: "Качество обслуживания", icon: <DashboardIcon /> },
    { to: "/personalization", label: "Персонализация", icon: <TuneIcon /> },
    { to: "/customers", label: "Клиенты", icon: <PersonSearchIcon /> },
    { to: "/tasks", label: "Задачи", icon: <TaskAltIcon /> },
  ];
 
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: props.drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: props.drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Divider />
      {/* заполнение списка кнопок вкладок меню перебором */}
      <List>
        {items.map((x) => {
          const selected = location.pathname === x.to;
          return (
            <ListItemButton
              key={x.to}
              component={RouterLink}
              to={x.to}
              selected={selected}
            >
              <ListItemIcon>{x.icon}</ListItemIcon>
              <ListItemText primary={x.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}