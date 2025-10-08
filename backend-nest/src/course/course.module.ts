import { Module, Provider } from "@nestjs/common";
import { DrizzleModule } from "../database/drizzle.module";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { ElasticCourseService } from "./elastic-course.service";

import { ElasticSearchModule } from '../search/search.module'; 

@Module({
  imports: [DrizzleModule, ElasticSearchModule],
  providers: [CourseService, ElasticCourseService],
  controllers: [CourseController],
  exports: []
})
export class CourseModule {}
