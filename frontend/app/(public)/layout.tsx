"use client";

import { ReactNode, useEffect } from "react";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, Dispatch } from "@/state/store";
import { getSession } from "@/state/session/sessionSlice";

export default function PublicLayout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<Dispatch>();
  const { isAuthenticated} = useSelector(
    (state: RootState) => state.session
  );

  useEffect(() => {
    dispatch(getSession());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex">
      {isAuthenticated ? (
        // Authenticated → sidebar layout
        <aside className="xl:w-80 md:w-50 w-50 fixed h-full">
          <Navbar />
        </aside>
      ) : (
        // Not authenticated → topbar layout
        <Topbar />
      )}
      <main
        className={`flex-1 min-h-screen overflow-auto ${
          isAuthenticated ? "ml-50 xl:ml-80 md:ml-50 " : "pt-20"
        }`}
      >
        {children}
      </main>
    </div>
  );
}