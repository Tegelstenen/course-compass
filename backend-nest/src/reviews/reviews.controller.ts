import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ReviewsService } from "./reviews.service";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(
    @Body() body: {
      courseCode: string;
      userId: string;
      easyScore: number;
      usefulScore: number;
      interestingScore: number;
      wouldRecommend: boolean;
      content: string;
    },
  ) {
    const { courseCode, userId, ...reviewData } = body;
    return this.reviewsService.create(courseCode, userId, reviewData);
  }

  @Get()
  findAll(@Query("courseCode") courseCode?: string) {
    return this.reviewsService.findAll(courseCode);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() reviewData: {
      easyScore: number;
      usefulScore: number;
      interestingScore: number;
      wouldRecommend: boolean;
      content: string;
    },
  ) {
    return this.reviewsService.update(id, reviewData);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.reviewsService.remove(id);
  }
}
