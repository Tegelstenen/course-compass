"use client";
import RatingDistributionChart from "@/components/RatingDistributionChart";
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
  courseRating: number | null;
  ratingDistribution: number[];
  credits: number;
  syllabus: string;
  percentageWouldRecommend: number | null;
  userId: string;
  onAddReview: (
    courseCode: string,
    userId: string,
    reviewForm: ReviewFormData,
  ) => Promise<void>;
};

export default function CourseHeader(props: Readonly<CourseHeaderProps>) {
  const rating = props.courseRating
    ? Math.min(5, Math.max(0, props.courseRating))
    : null;
  const ratingLabel = `Avg: ${rating ? rating.toFixed(1) : "__ "}/5.0`;
  const creditsLabel = `${props.credits} credits`;
  const recommendPct = props.percentageWouldRecommend
    ? Math.min(100, Math.max(0, props.percentageWouldRecommend))
    : null;
  const recommendLabel = `${recommendPct ? `${recommendPct.toFixed(0)}%` : "__"} would recommend`;

  return (
    <Card className="w-full p-4 md:p-6 grid gap-4 md:grid-cols-2">
      {/* Left */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h1 className="text-2xl">{props.courseCode}</h1>
            <h2 className="text-xl truncate">{props.courseName}</h2>
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
            courseCode={props.courseCode}
            userId={props.userId}
            onAddReview={props.onAddReview}
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
                <DialogDescription>{props.syllabus}</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Right */}
      <div className="p-2 md:p-0">
        <Card className="h-full min-h-40 flex items-center justify-center text-center text-secondary-foreground">
          <RatingDistributionChart
            distribution={props.ratingDistribution || [0, 0, 0, 0, 0]}
          />
        </Card>
      </div>
    </Card>
  );
}
