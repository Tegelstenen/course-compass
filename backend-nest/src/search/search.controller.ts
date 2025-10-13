import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common";
import { CourseMapping } from "../../../types/search/elastic.mappings";
import { type SearchResult, SearchService } from "./search.service";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  //   Extend with more filters when needed, start simple now
  async search(
    @Query("q") q?: string,
    @Query("size") size?: string,
    @Query("department") department?: string,
  ) {
    const limit = Number.isFinite(Number(size)) ? Number(size) : 10;
    const results: SearchResult[] = await this.searchService.searchCourses(
      q ?? "",
      limit,
      { department },
    );
    return { results, total: results.length };
  }

  @Get(":course_code")
  async getCourseInfo(@Param("course_code") courseCode: string) {
    const results: CourseMapping | undefined =
      await this.searchService.getCourseByCode(courseCode);

    if (!results) {
      throw new NotFoundException(`Course with code ${courseCode} not found`);
    }

    return results;
  }
}
