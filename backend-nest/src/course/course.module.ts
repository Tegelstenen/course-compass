import { Module, Provider } from "@nestjs/common";
import { DrizzleModule } from "../database/drizzle.module";
import { ElasticSearchModule } from "../search/search.module";
import { SearchService } from "../search/search.service";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";

@Module({
  imports: [DrizzleModule, ElasticSearchModule],
  providers: [CourseService, SearchService],
  controllers: [CourseController],
  exports: [],
})
export class CourseModule {}
