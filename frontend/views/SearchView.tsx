"use client";

import { SearchIcon } from "lucide-react";
import { SearchItem } from "@/components/SearchItem";
import { SearchItemSkeleton } from "@/components/SearchItemSkeleton";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import type { Course } from "@/models/CourseModel";

type SearchViewProps = {
  localQuery: string;
  setLocalQuery: (q: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  error: string | undefined;
  results: Course[];
  onSeeReviews: (courseCode: string) => void;
};

const skeletonKeys = Array.from({ length: 5 }, () => crypto.randomUUID());

export default function SearchView({
  localQuery,
  setLocalQuery,
  onSubmit,
  isLoading,
  error,
  results,
  onSeeReviews,
}: SearchViewProps) {
  return (
    <div>
      <p className="flex-1 p-6 ml-12 text-2xl font-bold mb-8">
        Find Your Course
      </p>
      <div className="centered flex flex-col items-center gap-12 pb-12">
        <form onSubmit={onSubmit} className="flex items-center gap-4">
          <input
            className="rounded-md outline p-2 w-64 text-center"
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search course..."
          />
          <Button variant="outline" className="h-10 w-10 p-0">
            {isLoading ? <Spinner variant="ring" /> : <SearchIcon />}
          </Button>
        </form>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {isLoading && (
          <div className="w-full max-w-3xl">
            <ul className="flex flex-col gap-6">
              {skeletonKeys.map((key) => (
                <li key={key}>
                  <SearchItemSkeleton />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="w-full max-w-3xl">
          <ul className="flex flex-col gap-6">
            {results.map((course) => (
              <li key={course._id}>
                <SearchItem
                  courseName={course.course_name}
                  courseCode={course.course_code}
                  rating={5}
                  semester={"P1"}
                  ects={7.5}
                  onSeeReviews={() => onSeeReviews(course.course_code)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
