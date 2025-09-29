// src/app.controller.ts
import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  Session,
  SuperTokensAuthGuard,
  VerifySession,
} from "supertokens-nestjs";
import type { SessionContainer } from "supertokens-node/recipe/session";
import { UserService } from "./user.service";

@Controller("user")
@UseGuards(SuperTokensAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get("/me")
  @VerifySession()
  async getMe(@Session() session: SessionContainer) {
    const user = await this.userService.getUser(session.getUserId());
    return {
      userId: session.getUserId(),
      name: user.name,
      email: user.email,
    };
  }
}
