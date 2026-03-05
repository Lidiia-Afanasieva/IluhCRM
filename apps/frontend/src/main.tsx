import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./app/providers/ThemeProvider";
import { QueryProvider } from "./app/providers/QueryProvider";
import { AuthProvider } from "./app/providers/AuthProvider";
import { App } from "./app/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  </React.StrictMode>
);

