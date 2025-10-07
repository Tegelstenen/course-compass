"use client";

// This is an example of a protected page that requires a valid session
// This we can wrap over entire layouts to have many protected pages.
// Ignore for now that it doesnt follow MVP architechture, will not be used in the future.

import { initST } from "@/lib/supertokens.client";

initST(); // ← runs immediately on module load (before render)

import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { useSessionData } from "@/hooks/sessionHooks";
// Import hooks
import { useUserData } from "@/hooks/userHooks";

export default function ProtectedPage() {
  const user = useUserData();
  const { isLoading, userId } = useSessionData();

  return (
    <SessionAuth requireAuth>
      <h1>Welcome</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Your name is {user.name}</p>
          <p>Your email is {user.email}</p>
          <p>Your id is {userId}</p>
        </>
      )}
    </SessionAuth>
  );
}
