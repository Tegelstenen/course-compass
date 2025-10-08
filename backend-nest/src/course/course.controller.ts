import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { CourseService } from "./course.service";
import { SearchService } from "../search/search.service";

@Controller("course")
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly elasticService: SearchService,
  ) {}

  @Get("/neon/:course_code") // /neon/:course_code for the neon SQL object
  async getNeonCourse(@Param("course_code") courseCode: string) {
    const course = await this.courseService.getCourse(courseCode);

    if (!course) {
      throw new NotFoundException(
        `Course with code ${courseCode} not found in database.`,
      );
    } else {
      // We re-construct the object here to follow standards
      // But technically not needed, we could use schema names directly as well
      return {
        courseCode: course.code,
        department: course.department,
        name: course.name,
        currentStatus: course.state, // renaming here to status to avoid conflicting naming with "state"
        lastExaminationSemester: course.lastExaminationSemester,
        updatedAt: course.updatedAt,
      };
    }
  }

  // Fetching from ElasticSearch, using SearchService
  @Get(":course_code")
  async getElasticCourse(@Param("course_code") courseCode: string) {
    const courseDocument =
      await this.elasticService.getCourseByCode(courseCode);

    if (!courseDocument) {
      throw new NotFoundException(
        `Course with code ${courseCode} not found in database.`,
      );
    } else {
      return {
        courseCode: courseDocument.course_code,
        department: courseDocument.department,
        name: courseDocument.course_name,
        goals: courseDocument.goals,
        content: courseDocument.content,
        //currentStatus: courseDocument.state, // renaming here to status to avoid conflicting naming with "state"
      };
    }
  }
}
