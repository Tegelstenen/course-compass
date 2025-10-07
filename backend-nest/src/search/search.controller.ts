import { Controller, Get, Query } from "@nestjs/common";
import { type SearchResult, SearchService } from "./search.service";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  //   Extend with more filters when needed, start simple now
  async search(@Query("q") q?: string, @Query("size") size?: string) {
    const limit = Number.isFinite(Number(size)) ? Number(size) : 10;
    const results: SearchResult[] = await this.searchService.searchCourses(
      q ?? "",
      limit,
    );
    return { results, total: results.length };
  }
}
