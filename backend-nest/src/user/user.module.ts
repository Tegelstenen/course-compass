import { Module } from "@nestjs/common";
import { DrizzleModule } from "../database/drizzle.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { CourseService } from "src/course/course.service";

@Module({
  imports: [DrizzleModule],
  providers: [UserService, CourseService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
