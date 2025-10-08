import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { CourseService } from "./course.service";
import { ElasticCourseService } from "./elastic-course.service";

@Controller("course")
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly elasticCourseService: ElasticCourseService
) {}

  @Get("/neon/:course_code")
  async getNeonCourse(@Param("course_code") courseCode: string) {
    const course = await this.courseService.getCourse(courseCode);

    if (!course) {
      // We throw an exception if the course code cannot be found in database
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

  // Fetching from ElasticSearch
  @Get("/elastic/:course_code")
  async getElasticCourse(@Param("course_code") courseCode: string) {
    const courseDocument = await this.elasticCourseService.getCourseByCode(courseCode);

    if (!courseDocument) {
      // We throw an exception if the course code cannot be found in database
      throw new NotFoundException(
        `Course with code ${courseCode} not found in database.`,
      );
    } else {
      // We re-construct the object here to follow standards
      // But technically not needed, we could use schema names directly as well
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
