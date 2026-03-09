import { httpRequest } from "../httpClient";
import type { LoginRequest, LoginResponse, MeResponse } from "../dto/auth.dto";

export const authService = {
  async login(body: LoginRequest): Promise<LoginResponse> {
    const res = await httpRequest<LoginResponse>({
      method: "POST",
      path: "/auth/login",
      body,
    });
    return res.data;
  },

  async me(): Promise<MeResponse> {
    const res = await httpRequest<MeResponse>({
      method: "GET",
      path: "/auth/me",
    });
    return res.data;
  },
};


