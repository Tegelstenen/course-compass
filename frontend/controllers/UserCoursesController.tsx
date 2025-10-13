"use client";

import { useEffect, useState } from "react";
import type { CourseItemProps } from "@/components/CourseItem";
import { useSessionData } from "@/hooks/sessionHooks";
import { useUserData } from "@/hooks/userHooks";
import { checkIfCourseCodeExists, getCourseInfo } from "@/lib/courses";
import SuspenseView from "@/views/SuspenseView";
import UserCoursesView from "@/views/UserCoursesView";

export default function UserpageController() {
  const userData = useUserData();
  const { isLoading, userId } = useSessionData();
  const [userFavorites, setUserFavorites] = useState([]);

  const onSeeReviews = () => {
    return;
  };

  const fetchCourseByCode = async (code: string) => {
    const courseObj = await getCourseInfo(code);
    return courseObj;
  };

  // Fetches the course objects from the user's stored favorite course ID's individually using Promise.all
  const fetchUserFavorites = async (): Promise<CourseItemProps[]> => {
    const courseObjects = await Promise.all(
      userData.userFavorites.map(async (favCourse) => {
        const course = await fetchCourseByCode(favCourse.favoriteCourse);
        return {
          // Re-constructs object to be of type "CourseObjectProps"
          courseName: course.course_name,
          courseCode: course.course_code,
          rating: course.rating ?? 0,
          ects: course.department,
          semester: "P1",
          onSeeReviews: () => {},
        };
      }),
    );
    return courseObjects;
  };

  // Might be a bit redundant, want to check only when necessary
  useEffect(() => {
    if (!userData) {
      return;
    }
    const courses = fetchUserFavorites();
    setUserFavorites(courses);
  }, [userData, userId]);

  if (isLoading || !userData) {
    return <SuspenseView />;
  } else {
    return (
      <UserCoursesView userData={userData} userFavorites={userFavorites} />
    );
  }
}
