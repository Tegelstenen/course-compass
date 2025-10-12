"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const MAX_COLLAPSED_CHARS = 280;

type RatingScaleEntry = {
  min: number; // inclusive
  label: string;
  className: string; // background + text fallback if needed
};

const RATING_SCALE: RatingScaleEntry[] = [
  { min: 5, label: "Excellent", className: "bg-emerald-600 text-white" },
  { min: 4, label: "Good", className: "bg-emerald-400 text-black/80" },
  { min: 3, label: "Average", className: "bg-amber-400 text-black/80" },
  { min: 2, label: "Poor", className: "bg-orange-400 text-black/80" },
  { min: 1, label: "Bad", className: "bg-rose-400 text-black/80" },
  { min: 0, label: "Terrible", className: "bg-rose-700 text-white" },
];

function truncateAtWord(str: string, max: number) {
  if (str.length <= max) return str;
  const slice = str.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
}

function normalizeRating(r: number | undefined | null) {
  if (typeof r !== "number" || Number.isNaN(r)) return null;
  return Math.min(5, Math.max(0, Math.round(r)));
}

function ratingToStyle(rating: number | null) {
  if (rating === null)
    return { label: "N/A", className: "bg-neutral-200 text-neutral-700" };
  for (const entry of RATING_SCALE) {
    if (rating >= entry.min)
      return { label: entry.label, className: entry.className };
  }
  return { label: "N/A", className: "bg-neutral-200 text-neutral-700" };
}

type RatingPillProps = {
  name: string;
  rating: number | null;
};

function RatingPill({ name, rating }: Readonly<RatingPillProps>) {
  const style = ratingToStyle(rating);
  const value = rating ?? "–";
  const aria =
    rating === null
      ? `${name}: not available`
      : `${name}: ${value} out of 5 (${style.label})`;

  return (
    <div className="flex items-center gap-2" title={aria}>
      <span className="text-sm text-muted-foreground w-20">{name}</span>
      <div
        className={cn(
          "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium",
          style.className,
        )}
      >
        {value}
      </div>
    </div>
  );
}

type RecommendChipProps = {
  wouldRecommend: boolean;
};

function RecommendChip(props: Readonly<RecommendChipProps>) {
  const label = props.wouldRecommend ? "Yes" : "No";
  const aria = `Would recommend: ${label}`;
  const style = props.wouldRecommend
    ? "bg-sky-600 text-white"
    : "bg-neutral-200 text-neutral-700";
  return (
    <div className="flex items-center gap-2" title={aria}>
      <span className="text-sm text-muted-foreground w-20">Recommend</span>
      <div
        className={cn(
          "inline-flex h-8 items-center justify-center rounded-md px-2 text-sm font-medium",
          style,
        )}
      >
        {label}
      </div>
    </div>
  );
}

export type PostProps = {
  easyScore: number;
  usefulScore: number;
  interestingScore: number;
  wouldRecommend: boolean;
  content: string;
};

export default function Post(props: Readonly<PostProps>) {
  const easy = normalizeRating(props.easyScore);
  const useful = normalizeRating(props.usefulScore);
  const interesting = normalizeRating(props.interestingScore);

  const [expanded, setExpanded] = useState(false);
  const content = props.content ?? "";
  const isLong = content.length > MAX_COLLAPSED_CHARS;
  const displayText =
    expanded || !isLong
      ? content
      : `${truncateAtWord(content, MAX_COLLAPSED_CHARS)}…`;

  return (
    <Card className={cn("w-[48rem] max-w-full")}>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          <RatingPill name="Easy" rating={easy} />
          <RatingPill name="Useful" rating={useful} />
          <RatingPill name="Interesting" rating={interesting} />
          <RecommendChip wouldRecommend={props.wouldRecommend} />
        </div>

        <div className="h-px bg-border/60" />

        <div className="prose prose-sm md:prose-base max-w-none">
          <p>
            {displayText}{" "}
            {isLong ? (
              <Button
                variant="link"
                className="inline text-sm text-primary hover:underline"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
              >
                {expanded ? "Show less" : "Read more"}
              </Button>
            ) : null}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
