import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";

type DemoUser = {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: "manager" | "admin";
};

@Injectable()
export class AuthService {
  private readonly demoUser: DemoUser = {
    id: "u1",
    email: "manager@f5.local",
    password: "123456",
    fullName: "Менеджер Ф5",
    role: "manager",
  };

  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto): Promise<{ token: string }> {
    const isValid =
      dto.email === this.demoUser.email && dto.password === this.demoUser.password;

    if (!isValid) {
      throw new UnauthorizedException("Неверный email или пароль");
    }

    const payload = {
      sub: this.demoUser.id,
      email: this.demoUser.email,
      role: this.demoUser.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  async getMe(userId: string): Promise<{
    id: string;
    email: string;
    fullName: string;
    role: "manager" | "admin";
  }> {
    if (userId !== this.demoUser.id) {
      throw new UnauthorizedException("Пользователь не найден");
    }

    return {
      id: this.demoUser.id,
      email: this.demoUser.email,
      fullName: this.demoUser.fullName,
      role: this.demoUser.role,
    };
  }

  async validateJwtPayload(payload: {
    sub: string;
    email: string;
    role: "manager" | "admin";
  }): Promise<{
    id: string;
    email: string;
    fullName: string;
    role: "manager" | "admin";
  }> {
    if (payload.sub !== this.demoUser.id) {
      throw new UnauthorizedException("Неверный токен");
    }

    return {
      id: this.demoUser.id,
      email: this.demoUser.email,
      fullName: this.demoUser.fullName,
      role: this.demoUser.role,
    };
  }
}