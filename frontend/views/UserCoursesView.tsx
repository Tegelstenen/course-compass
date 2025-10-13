"use client";

import { CourseItem } from "@/components/CourseItem";
import TempCourseObject from "@/components/tempCourseObject";
import type { UserState } from "@/state/user/userSlice";
import SuspenseView from "./SuspenseView";

interface UserCoursesViewProps {
  userData: UserState;
  userFavorites: [] | null;
}

export default function UserCoursesView(props: UserCoursesViewProps) {
  console.log(props.userFavorites);

  const displayFavorites = () => {
    if (
      props.userData.userFavorites &&
      props.userData.userFavorites.length < 1
    ) {
      return <div> User has not favorite courses</div>;
    }
    if (props.userFavorites && props.userFavorites.length > 0) {
      return (
        <div>
          {props.userFavorites.map((course) => (
            <CourseItem {...course} />
          ))}
        </div>
      );
    } else {
      return <SuspenseView />;
    }
  };

  return (
    <div className="flex flex-col justify-left m-10">
      <h1 className="text-secondary font-extrabold text-4xl">Saved Courses</h1>
      <div>{displayFavorites()}</div>
    </div>
  );
}
