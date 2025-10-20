"use client";

import { SearchIcon } from "lucide-react";
import { CourseItem } from "@/components/CourseItem";
import { CourseItemSkeleton } from "@/components/CourseItemSkeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import type { Course } from "@/models/CourseModel";

type SearchViewProps = {
  localQuery: string;
  setLocalQuery: (q: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  error: string | undefined;
  results: Course[];
  filters: Record<string, string | string[]>;
  onFiltersChange: (filters: Record<string, string | string[]>) => void;
  onSeeReviews: (courseCode: string) => void;
  onAddFavorite: (courseCode: string) => void;
};

// Necessary for static arrays? Can't we just use the map index?
const skeletonKeys = Array.from({ length: 5 }, () => crypto.randomUUID());

export default function SearchView({
  localQuery,
  setLocalQuery,
  onSubmit,
  isLoading,
  error,
  results,
  filters,
  onFiltersChange,
  onSeeReviews,
  onAddFavorite,
}: SearchViewProps) {
  return (
    <div>
      <p className="flex-1 p-6 ml-12 text-2xl font-bold mb-8"></p>
      <div className="centered flex flex-col items-center gap-12 pb-12">
        <form onSubmit={onSubmit} className="flex items-center gap-4">
          <input
            className="rounded-md outline p-2 w-64 text-center"
            type="text"
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search course..."
          />
          <Button
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={() => console.log(filters)}
          >
            {isLoading ? <Spinner variant="ring" /> : <SearchIcon />}
          </Button>
        </form>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        <div className="w-full max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <Select
              value={(filters.department as string) || ""}
              onValueChange={(value) => {
                const newFilters = { ...filters };
                newFilters.department = value;
                onFiltersChange(newFilters);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="School..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EECS">EECS</SelectItem>
                <SelectItem value="ABE">ABE</SelectItem>
                <SelectItem value="CBH">CBH</SelectItem>
                <SelectItem value="ITM">ITM</SelectItem>
                <SelectItem value="SCI">SCI</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={(filters.minRating as string) || ""}
              onValueChange={(value) => {
                const newFilters = { ...filters };
                newFilters.minRating = value;
                onFiltersChange(newFilters);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Minimum Rating..." />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }).map((_, ratingValue) => {
                  const value = ratingValue + 1;
                  return (
                    <SelectItem
                      key={`selectitem-${value}`}
                      value={value.toString()}
                    >
                      <Rating value={value} readOnly>
                        {(["one", "two", "three", "four", "five"] as const).map(
                          (starId) => (
                            <RatingButton
                              key={`star-${value}-${starId}`}
                              className="text-yellow-600"
                            />
                          ),
                        )}
                      </Rating>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {Object.keys(filters).length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFiltersChange({})}
                className="text-sm"
              >
                Clear Filters
              </Button>
            )}
          </div>
          {isLoading && (
            <ul className="flex flex-col gap-6">
              {skeletonKeys.map((key) => (
                <li key={key}>
                  <CourseItemSkeleton />
                </li>
              ))}
            </ul>
          )}

          <ul className="flex flex-col gap-6">
            {results.map((course) => (
              <li key={course._id}>
                <CourseItem
                  courseName={course.course_name}
                  courseCode={course.course_code}
                  rating={Math.max(0, Math.min(5, Number(course.rating ?? 0)))}
                  // semester={"P1"}
                  ects={7.5}
                  isUserFavorite={false}
                  onSeeReviews={() => onSeeReviews(course.course_code)}
                  onAddFavorite={() => onAddFavorite(course.course_code)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
