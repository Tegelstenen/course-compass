"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSessionData } from "@/hooks/sessionHooks";
import { useUser } from "@/hooks/userHooks";
import { getFullCourseInfo } from "@/lib/courses";
import type { Course, CourseWithUserInfo } from "@/models/CourseModel";
import SuspenseView from "@/views/SuspenseView";
import UserCoursesView from "@/views/UserCoursesView";

export default function UserpageController() {
  const { isLoading } = useSessionData();
  const userData = useUser(); // userData instead of userFavorites to check user state as well
  const [userFavoriteCourses, setUserFavoriteCourses] = useState<
    CourseWithUserInfo[]
  >([]); // the full course objects sent down to the view
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);

  const router = useRouter();

  const onSeeReviews = (courseCode: string) => {
    router.push(`/course/${courseCode}`);
  };

  const onAddFavorite = (courseCode: string) => {
    //TODO: Add hook to post updates to database
    console.log("In usercoursescontroller and adding to favorites");
    return;
  };

  // Maps the course codes in to full Course objects
  useEffect(() => {
    if (!userData) return;
    async function fetchCourses() {
      setIsLoadingCourse(true);
      const courses = await Promise.all(
        userData.userFavorites.map(
          async (courseCode) => {
            const course: Course = await getFullCourseInfo(courseCode);
            return { ...course, isUserFavorite: true };
          }, // perhaps rename this property to be ID instead of favoriteCourse?
        ),
      );
      setUserFavoriteCourses(courses);
      setIsLoadingCourse(false);
    }
    fetchCourses();
  }, [userData]);

  // Returns suspense view but could be improved to always render skeleton on all updates
  if (!userData || isLoading || !userFavoriteCourses) {
    return <SuspenseView />;
  } else {
    return (
      <UserCoursesView
        userFavoriteCourses={userFavoriteCourses} // array of CourseWithUserInfo object
        isLoadingCourse={isLoadingCourse}
        onSeeReviews={onSeeReviews}
        onAddFavorite={onAddFavorite}
      />
    );
  }
}
