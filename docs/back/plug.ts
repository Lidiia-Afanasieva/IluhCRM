// @ts-nocheck

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { db } from "../../common/inmemory.db";

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  login(email: string, password: string) {
    const user = db.users.find((u) => u.email === email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException("Неверные учётные данные");
    }

    const payload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    const token = this.jwt.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  me(userId: string) {
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      throw new UnauthorizedException("Пользователь не найден");
    }
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  }
}


