// src/app.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
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
import { success } from "zod/index.cjs";
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
        profilePicture: user.profilePicture || null,
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

  // Add a course to user favorites
  @Post("/toggle-favorite")
  @VerifySession()
  async addFavoriteCourse(
    @Session() session: SessionContainer,
    @Body() body: { courseCode: string },
  ) {
    const userId = session.getUserId();
    const { courseCode } = body;

    const result = await this.userService.toggleUserFavorite(
      userId,
      courseCode,
    );
    return { success: true, action: result.action };
  }

  // Save profile picture URL (uploaded to Vercel Blob from frontend)
  @Post("/profile-picture")
  @VerifySession()
  async updateProfilePicture(
    @Session() session: SessionContainer,
    @Body() body: { url: string },
  ) {
    const userId = session.getUserId();
    const { url } = body;

    // Validate URL format
    if (!url || !url.startsWith("https://")) {
      throw new Error("Invalid URL provided");
    }

    // Save to database
    await this.userService.updateProfilePicture(userId, url);
    return { url };
  }
}
