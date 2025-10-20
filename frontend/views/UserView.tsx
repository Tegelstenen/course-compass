"use client";

import TempCourseObject from "@/components/tempCourseObject";
import type { UserState } from "@/state/user/userSlice";

interface UserViewProps {
  userData: UserState;
  userId: string;
}

export default function UserView(props: UserViewProps) {
  if (!props.userData) {
    return <div> Cannot find userData...</div>;
  }

  const displayFavorites = () => {
    if (
      props.userData.userFavorites &&
      props.userData.userFavorites.length > 0
    ) {
      return (
        <div>
          {props.userData.userFavorites.map((favorite) => (
            <TempCourseObject
              key={favorite.toString()}
              userFavorite={{
                userId: props.userId,
                createdAt: new Date(),
                favoriteCourse: favorite,
              }}
            />
          ))}
        </div>
      );
    }
    return <div> User has not favorite courses</div>;
  };
  return (
    <div>
      <h1 className="text-secondary font-extrabold text-4xl">
        Welcome {props.userData?.name}!
      </h1>
      <div>
        <h2>Your favorite courses</h2>
        {displayFavorites()}
      </div>
    </div>
  );
}
