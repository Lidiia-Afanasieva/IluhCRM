import { Navigate, useRoutes } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { AppShell } from "../layout/AppShell";

import { LoginPage } from "../../pages/auth/LoginPage";
import { QualityDashboardPage } from "../../pages/quality/QualityDashboardPage";
import { PersonalizationPage } from "../../pages/personalization/PersonalizationPage";
import { CustomersListPage } from "../../pages/customers/CustomersListPage";
import { CustomerDetailsPage } from "../../pages/customers/CustomerDetailsPage";
import { TasksPage } from "../../pages/tasks/TasksPage";
import { NotFoundPage } from "../../pages/notfound/NotFoundPage";

export function AppRouter() {
  const routes: RouteObject[] = [
    { path: "/", element: <Navigate to="/quality" replace /> },
    { path: "/login", element: <LoginPage /> },

    {
      path: "/",
      element: (
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      ),
      children: [
        { path: "quality", element: <QualityDashboardPage /> },
        { path: "personalization", element: <PersonalizationPage /> },
        { path: "customers", element: <CustomersListPage /> },
        { path: "customers/:id", element: <CustomerDetailsPage /> },
        { path: "tasks", element: <TasksPage /> },
      ],
    },

    { path: "*", element: <NotFoundPage /> },
  ];

  return useRoutes(routes);
}