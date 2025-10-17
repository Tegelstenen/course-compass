"use client";

import { CourseItem } from "@/components/CourseItem";
import { CourseItemSkeleton } from "@/components/CourseItemSkeleton";
import type { Course } from "@/models/CourseModel";
import type { UserState } from "@/state/user/userSlice";

interface UserCoursesViewProps {
  userData: UserState;
  userFavorites: Course[];
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
        {props.isLoadingCourse ? ( // skeleton items if loading
          skeletonKeys.map((key) => <CourseItemSkeleton key={key} />)
        ) : props.userFavorites.length ? ( // else map userFavorites
          props.userFavorites.map((course, i) => (
            <CourseItem
              key={`${course.course_code}${i}`}
              // Underlines here are caused by mismatch of types.
              // Larger structural problem, exists a seperate ticket for solving this.
              courseName={course.name}
              courseCode={course.courseCode}
              rating={course.rating ?? 0}
              ects={7.5} // When db configured object will contain ects / credits as well
              onSeeReviews={() => onSeeReviews(course.courseCode)}
            />
          ))
        ) : (
          <div>User has not favorite courses</div>
        )}
      </div>
    </div>
  );
}
