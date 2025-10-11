"use client";
import { Review, type ReviewFormData } from "@/components/review";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type CourseHeaderProps = {
  courseCode: string;
  courseName: string;
  courseRating: number;
  credits: number;
  syllabus: string;
  percentageWouldRecommend: number;
  userId: string;
  onAddReview: (
    courseCode: string,
    userId: string,
    reviewForm: ReviewFormData,
  ) => Promise<boolean>;
};

export default function CourseHeader({
  courseCode,
  courseName,
  courseRating,
  credits,
  syllabus,
  percentageWouldRecommend,
  userId,
  onAddReview,
}: Readonly<CourseHeaderProps>) {
  const rating = Math.min(5, Math.max(0, courseRating));
  const ratingLabel = `Avg: ${rating.toFixed(1)}/5.0`;
  const creditsLabel = `${credits} credits`;
  const recommendPct = Math.min(100, Math.max(0, percentageWouldRecommend));
  const recommendLabel = `${recommendPct}% would recommend`;

  return (
    <Card className="w-full p-4 md:p-6 grid gap-4 md:grid-cols-2">
      {/* Left */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h1 className="text-2xl">{courseCode}</h1>
            <h2 className="text-xl truncate">{courseName}</h2>
          </div>
          <div className="text-2xl font-bold shrink-0 w-36 h-24 grid place-items-center rounded-md">
            {ratingLabel}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-lg">
          <div className="grid place-items-center rounded-md text-center p-2">
            <p>{creditsLabel}</p>
          </div>
          <div className="grid place-items-center rounded-md text-center p-2">
            <p>{recommendLabel}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Review
            courseCode={courseCode}
            userId={userId}
            onAddReview={onAddReview}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="flex-1"
                type="button"
                aria-label="Read course syllabus"
              >
                Read course syllabus
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Course Syllabus</DialogTitle>
                <DialogDescription>{syllabus}</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Right */}
      <div className="p-2 md:p-0">
        <Card className="h-full min-h-40 flex items-center justify-center text-center bg-secondary text-secondary-foreground">
          Add a plot for the rating distribution here (use the specified library
          in the grading criteria).
        </Card>
      </div>
    </Card>
  );
}
