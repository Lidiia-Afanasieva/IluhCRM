import { createContext, useContext, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import { clearToken, getToken, setToken } from "../../lib/auth/tokenStorage";
import { authService } from "../../api/services/auth.service";

type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider(props: PropsWithChildren) {
  const [tokenState, setTokenState] = useState<string | null>(() => getToken());

  const value: AuthContextValue = useMemo(() => {
    return {
      isAuthenticated: Boolean(tokenState),
      token: tokenState,

      login: async (email: string, password: string) => {
        const res = await authService.login({ email, password });
        setToken(res.token);
        setTokenState(res.token);
        await authService.me();
      },

      logout: () => {
        clearToken();
        setTokenState(null);
      },
    };
  }, [tokenState]);

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext не инициализирован");
  return ctx;
}