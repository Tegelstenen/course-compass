// src/app.controller.ts

import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
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
    const userId = session.getUserId();
    const user = await this.userService.getUser(userId);

    if (!user) {
      // Throw an exception if the user exists in SuperTokens but not in the database
      throw new NotFoundException(
        `User with ID ${userId} not found in database.`,
      );
    } else {
      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        userFavorites: user.userFavorites,
        //profilePicture: user.profilePicture || null,
      };
    }
  }

  // Get user favorite courses
  @Get("/favorites")
  async getFavorites(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    // Can be empty but we accept an empty array of favorite courses
    const userFavorites = await this.userService.getUserFavorites(userId);
    return userFavorites;
  }

  // Delete account
  @Delete("/")
  @VerifySession()
  async deleteAccount(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    await this.userService.deleteUser(userId);
    return { success: true };
  }

  // Upload profile picture
  @Post("/profile-picture")
  @VerifySession()
  @UseInterceptors(FileInterceptor("file"))
  async uploadProfilePicture(
    @Session() _session: SessionContainer,
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
