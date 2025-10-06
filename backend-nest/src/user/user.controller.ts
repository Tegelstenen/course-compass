// src/app.controller.ts
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { profile } from "console";
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
      //profilePicture: user.profilePicture || null,
    };
  }

  // Upload profile picture
  @Post("/profile-picture")
  @VerifySession()
  @UseInterceptors(FileInterceptor("file"))
  async uploadProfilePicture(
    @Session() session: SessionContainer,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // For now, just logging file info:
    console.log("Uploaded file:", file);

    // TODO: Save the file to storage

    // Returning a fake URL for testing
    return {
      url: `http://localhost:8080/uploads/${file.originalname}`,
    };
  }
}
