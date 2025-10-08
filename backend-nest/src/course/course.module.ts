import { Module } from "@nestjs/common";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { DrizzleModule } from '../database/drizzle.module'; 
import { ElasticCourseService } from './elastic-course.service';

@Module({
imports: [DrizzleModule],
  providers: [CourseService, ElasticCourseService],
  controllers: [CourseController],
})
export class CourseModule {}
