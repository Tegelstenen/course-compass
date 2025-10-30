// src/app.controller.ts

import {
  BadRequestException,
  Body,
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
import { put } from "@vercel/blob";
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
    }
    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      userFavorites: user.userFavorites,
      profilePicture: user.profilePicture || null,
    };
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

  // Upload and save a new profile picture
  @Post("/profile-picture")
  @VerifySession()
  @UseInterceptors(FileInterceptor("file"))
  async uploadProfilePicture(
    @Session() session: SessionContainer,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = session.getUserId();
    // Validation: file presence
    if (!file) {
      throw new BadRequestException("No file provided");
    }
    // Validation: type
    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestException("File must be an image");
    }
    // Validation: 2MB size limit
    if (file.size > 2 * 1024 * 1024) {
      throw new BadRequestException("Image must be less than 2MB");
    }

    // Upload to Vercel Blob
    const blob = await put(file.originalname, file.buffer, {
      access: "public",
      addRandomSuffix: true,
    });

    // Save the URL in the database
    await this.userService.updateProfilePicture(userId, blob.url);
    return { url: blob.url };
  }
}
