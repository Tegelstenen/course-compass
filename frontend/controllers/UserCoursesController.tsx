"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSessionData } from "@/hooks/sessionHooks";
import { useUserData } from "@/hooks/userHooks";
import { getCourseInfo } from "@/lib/courses";
import type { Course } from "@/models/CourseModel";
import SuspenseView from "@/views/SuspenseView";
import UserCoursesView from "@/views/UserCoursesView";

export default function UserpageController() {
  const { isLoading } = useSessionData();
  const userData = useUserData();
  const [userFavorites, setUserFavorites] = useState<Course[]>([]);
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);

  const router = useRouter();

  const onSeeReviews = (courseCode: string) => {
    router.push(`/course/${courseCode}`);
  };

  // Handles the fetching of user's favorite courses
  useEffect(() => {
    if (!userData) return;

    async function fetchCourses() {
      setIsLoadingCourse(true);

      async function fetchCourseByCode(code: string) {
        return await getCourseInfo(code);
      }
      const courses = await Promise.all(
        userData.userFavorites.map(async (favCourse) => {
          const course = await fetchCourseByCode(favCourse.favoriteCourse);
          console.log(course);
          return { course };
        }),
      );
      setUserFavorites(courses);
      setIsLoadingCourse(false);
    }
    fetchCourses();
  }, [userData]);

  // Returns suspense view but could be improved to always render skeleton on all updates
  if (!userData || isLoading) {
    return <SuspenseView />;
  } else {
    return (
      <UserCoursesView
        userData={userData}
        userFavorites={userFavorites}
        isLoadingCourse={isLoadingCourse}
        onSeeReviews={onSeeReviews}
      />
    );
  }
}
