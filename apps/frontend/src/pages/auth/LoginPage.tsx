import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "../../app/providers/AuthProvider";

const schema = z.object({
  email: z.string().min(1, "Email обязателен").email("Некорректный email"),
  password: z.string().min(1, "Пароль обязателен"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const auth = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  if (auth.isAuthenticated) {
    return <Navigate to="/quality" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper sx={{ width: 420, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Вход
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Ведите почту и пароль для авторизации в системе
        </Typography>

        <Box
          component="form"
          onSubmit={form.handleSubmit(async (v) => {
            await auth.login(v.email, v.password);
          })}
          sx={{ display: "grid", gap: 2 }}
        >
          <TextField
            label="Email"
            {...form.register("email")}
            error={Boolean(form.formState.errors.email)}
            helperText={form.formState.errors.email?.message}
          />
          <TextField
            label="Пароль"
            type="password"
            {...form.register("password")}
            error={Boolean(form.formState.errors.password)}
            helperText={form.formState.errors.password?.message}
          />

          <Button type="submit" variant="contained" size="large">
            Войти
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}