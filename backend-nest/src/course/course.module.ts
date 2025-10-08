import { Module } from "@nestjs/common";
import { DrizzleModule } from "../database/drizzle.module";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";

@Module({
  imports: [DrizzleModule],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
