import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";

type JwtPayload = {
  sub: string;
  email: string;
  role: "manager" | "admin";
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "dev-secret-change-later",
    });
  }

  async validate(payload: JwtPayload) {
    return this.authService.validateJwtPayload(payload);
  }
}