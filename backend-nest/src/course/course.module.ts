import { Module, Provider } from "@nestjs/common";
import { DrizzleModule } from "../database/drizzle.module";
import { ElasticSearchModule } from "../search/search.module";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { ElasticCourseService } from "./elastic-course.service";

@Module({
  imports: [DrizzleModule, ElasticSearchModule],
  providers: [CourseService, ElasticCourseService],
  controllers: [CourseController],
  exports: [],
})
export class CourseModule {}
