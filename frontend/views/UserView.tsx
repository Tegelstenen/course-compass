"use client";

import { UserState } from "@/state/user/userSlice";

interface UserViewProps {
  userData: UserState;
}

export default function UserView(props: UserViewProps) {
    return (
      <div>
        <h1 className="text-secondary font-extrabold text-4xl">Welcome {props.userData && props.userData.name}!</h1>
        <div>
          <h2>Your favorite courses</h2>
          
        </div>
      </div>
    );
}
