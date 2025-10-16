"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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

  const onSeeReviews = useCallback(
    (courseCode: string) => {
      router.push(`/course/${courseCode}`);
    },
    [router],
  );

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
          return { course };
        }),
      );
      setUserFavorites(courses);
      setIsLoadingCourse(false);
    }
    fetchCourses();
  }, [userData]);

  if (!userData || isLoading) {
    return <SuspenseView />;
  } else {
    return (
      <UserCoursesView
        userData={userData}
        userFavorites={userFavorites}
        isLoadingCourse={isLoadingCourse}
      />
    );
  }
}
