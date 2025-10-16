"use client";

import { CourseItem } from "@/components/CourseItem";
import { CourseItemSkeleton } from "@/components/CourseItemSkeleton";
import type { Course } from "@/models/CourseModel";
import type { UserState } from "@/state/user/userSlice";

interface UserCoursesViewProps {
  userData: UserState;
  userFavorites: Course[] | null;
  isLoadingCourse: boolean;
  onSeeReviews: (courseCode: string) => void;
}

export default function UserCoursesView(props: UserCoursesViewProps) {
  // Necessary for static arrays? Can't we just use the map index?
  const skeletonKeys = Array.from({ length: 5 }, () => crypto.randomUUID());

  const onSeeReviews = (code: string) => {
    props.onSeeReviews(code); // handle navigation logic in controller
  };

  return (
    <div className="flex flex-col items-center m-10 w-full max-w-4xl">
      <h1 className="text-secondary font-extrabold text-4xl self-start mb-6">
        Saved Courses
      </h1>
      <div className="flex flex-col w-full gap-6">
        {props.isLoadingCourse ? (
          skeletonKeys.map((key) => <CourseItemSkeleton key={key} />)
        ) : props.userFavorites?.length ? (
          props.userFavorites.map((course, i) => (
            <CourseItem
              key={`${course.course_code}${i}`}
              courseName={course.course_name}
              courseCode={course.course_code}
              rating={3}
              ects={7.5}
              onSeeReviews={() => onSeeReviews(course.course_code)}
            />
          ))
        ) : (
          <div>User has not favorite courses</div>
        )}
      </div>
    </div>
  );
}
