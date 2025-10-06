// src/app.controller.ts
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  NotFoundException
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

    console.log("In controller:", user);

    if (!user) {
      // Throw an exception if the user exists in SuperTokens but not in the database
      throw new NotFoundException(`User with ID ${userId} not found in database.`);
    } else {
      return {
        userId: session.getUserId(),
        name: user.name,
        email: user.email,
        userFavorites: user.userFavorites,
        //profilePicture: user.profilePicture || null,
      };
    }
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
