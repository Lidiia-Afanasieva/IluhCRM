import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

type RequestWithUser = Request & {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "manager" | "admin";
  };
};

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  async me(@Req() req: RequestWithUser) {
    return this.authService.getMe(req.user.id);
  }
}