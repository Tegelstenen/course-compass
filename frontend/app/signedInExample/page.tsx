"use client";

// This is an example of a protected page that requires a valid session
// This we can wrap over entire layouts to have many protected pages.
// Ignore for now that it doesnt follow MVP architechture, will not be used in the future.

import { initST } from "@/lib/supertokens.client";

initST(); // ← runs immediately on module load (before render)

import { type Dispatch, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { getSession } from "@/state/session/sessionSlice";
import type { RootState } from "@/state/store";

export default function ProtectedPage() {
  const dispatch = useDispatch<Dispatch>();
  const { userId, isLoading } = useSelector((s: RootState) => s.session);
  const user = useSelector((s: RootState) => s.user);

  useEffect(() => {
    // (optional app logic)
    dispatch(getSession());
  }, [dispatch]);

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
