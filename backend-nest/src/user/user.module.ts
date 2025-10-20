import { Module } from "@nestjs/common";
import { CourseService } from "src/course/course.service";
import { DrizzleModule } from "../database/drizzle.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [DrizzleModule],
  providers: [UserService, CourseService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
