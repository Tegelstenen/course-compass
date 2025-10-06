"use client";

import { useSessionData } from "@/hooks/sessionHooks";
import { useUserData } from "@/hooks/userHooks";

export default function UserView() {
  const userData = useUserData();
  const { isLoading, userId } = useSessionData();

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <h1>The user page!</h1>
        <p>Welcome, {userData && userData.name}</p>
      </div>
    );
  }
}
