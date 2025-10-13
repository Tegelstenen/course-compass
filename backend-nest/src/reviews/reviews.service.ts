import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq, sql } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { nanoid } from "nanoid"; // for generating unique review ids
import { DRIZZLE } from "src/database/drizzle.module";
import * as schema from "../../../types/database/schema";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  async create(
    courseCode: string,
    userId: string,
    reviewData: {
      easyScore: number;
      usefulScore: number;
      interestingScore: number;
      wouldRecommend: boolean;
      content: string;
    },
  ) {
    const [inserted] = await this.db
      .insert(schema.reviews)
      .values({
        id: nanoid(), // generate a unique review ID
        userId,
        courseCode,
        easyScore: reviewData.easyScore,
        usefulScore: reviewData.usefulScore,
        interestingScore: reviewData.interestingScore,
        wouldRecommend: reviewData.wouldRecommend,
        content: reviewData.content,
      })
      .returning();
    return inserted;
  }

  // either fetch all reviews or all reviews for a specific course
  async findAll(courseCode?: string) {
    const query = this.db.select().from(schema.reviews);
    if (courseCode) query.where(eq(schema.reviews.courseCode, courseCode));
    query.orderBy(sql`created_at DESC`);
    return query;
  }

  // fetch a single review by id
  async findOne(id: string) {
    const [review] = await this.db
      .select()
      .from(schema.reviews)
      .where(eq(schema.reviews.id, id))
      .limit(1);

    if (!review) throw new NotFoundException(`Review with id ${id} not found`);
    return review;
  }

  async update(
    id: string,
    reviewData: {
      easyScore: number;
      usefulScore: number;
      interestingScore: number;
      wouldRecommend: boolean;
      content: string;
    },
  ) {
    const [updated] = await this.db
      .update(schema.reviews)
      .set({
        easyScore: reviewData.easyScore,
        usefulScore: reviewData.usefulScore,
        interestingScore: reviewData.interestingScore,
        wouldRecommend: reviewData.wouldRecommend,
        content: reviewData.content,
        updatedAt: sql`now()`,
      })
      .where(eq(schema.reviews.id, id))
      .returning();

    if (!updated) throw new NotFoundException(`Review with id ${id} not found`);
    return updated;
  }

  // delete a review
  async remove(id: string) {
    const [deleted] = await this.db
      .delete(schema.reviews)
      .where(eq(schema.reviews.id, id))
      .returning();

    if (!deleted) throw new NotFoundException(`Review with id ${id} not found`);
    return deleted;
  }
}
