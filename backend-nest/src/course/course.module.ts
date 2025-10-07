import { Module } from "@nestjs/common";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { DrizzleModule } from '../database/drizzle.module'; 

@Module({
imports: [DrizzleModule],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
