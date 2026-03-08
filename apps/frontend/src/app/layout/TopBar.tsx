import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../providers/AuthProvider";

type Props = {
  drawerWidth: number;
};

export function TopBar(props: Props) {
  const auth = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${props.drawerWidth}px)` },
        ml: { sm: `${props.drawerWidth}px` },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Команда Ф5. Поддержка взаимодействия с клиентами
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Button color="inherit" onClick={auth.logout}>
          Выйти
        </Button>
      </Toolbar>
    </AppBar>
  );
}

