import type { SelectUserFavorites } from "../../types/database/schema";

interface TempCourse {
  userFavorite: SelectUserFavorites;
}

export default function TempCourseObject(props: TempCourse) {
  return (
    <div className="flex w-full bg-red-600">
      <p>Course: {props.userFavorite.favoriteCourse}</p>
      <p>Some course informaion...</p>
    </div>
  );
}
