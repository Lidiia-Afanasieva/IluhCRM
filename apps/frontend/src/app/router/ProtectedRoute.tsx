import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export function ProtectedRoute(props: PropsWithChildren) {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{props.children}</>;
}