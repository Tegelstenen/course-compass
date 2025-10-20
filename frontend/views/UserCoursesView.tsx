"use client";

import { CourseItem } from "@/components/CourseItem";
import { CourseItemSkeleton } from "@/components/CourseItemSkeleton";
import type { CourseWithUserInfo } from "@/models/CourseModel";

interface UserCoursesViewProps {
  userFavoriteCourses: CourseWithUserInfo[];
  isLoadingCourse: boolean;
  onSeeReviews: (courseCode: string) => void;
  onToggleFavorite: (courseCode: string) => void;
}

export default function UserCoursesView({
  userFavoriteCourses,
  isLoadingCourse,
  onSeeReviews,
  onToggleFavorite,
}: UserCoursesViewProps) {
  // Necessary for static arrays? Can't we just use the map index?
  const skeletonKeys = Array.from({ length: 5 }, () => crypto.randomUUID());

  return (
    <div className="flex flex-col items-center m-10 w-full max-w-4xl">
      <h1 className="text-secondary font-extrabold text-4xl self-start mb-6">
        Saved Courses
      </h1>
      <div className="flex flex-col w-full gap-6">
        {isLoadingCourse ? ( // skeleton items if loading
          skeletonKeys.map((key) => <CourseItemSkeleton key={key} />)
        ) : userFavoriteCourses.length ? ( // else map userFavorites
          userFavoriteCourses.map((course, i) => (
            <CourseItem
              key={course.course_code}
              // Underlines here are caused by mismatch of types.
              // Larger structural problem, exists a seperate ticket for solving this.
              courseName={course.name}
              courseCode={course.courseCode}
              rating={course.rating ?? 0}
              ects={7.5} // When db configured object will contain ects / credits as well
              isUserFavorite={course.isUserFavorite}
              onSeeReviews={() => onSeeReviews(course.courseCode)}
              onToggleFavorite={() => onToggleFavorite(course.courseCode)}
            />
          ))
        ) : (
          <div>User has not favorite courses</div>
        )}
      </div>
    </div>
  );
}
