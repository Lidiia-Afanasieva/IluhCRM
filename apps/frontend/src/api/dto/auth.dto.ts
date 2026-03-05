export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type MeResponse = {
  id: string;
  email: string;
  fullName: string;
  role: "manager" | "admin";
};