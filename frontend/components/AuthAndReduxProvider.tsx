"use client";

// this component is needed to wrap the SeesionAuth inside a "use client" tag,
// because it uses client side functionality like "useContext". The layout page
// must render server side, which means this has to be refactored into a different component.

import { initST } from "@/lib/supertokens.client";

initST(); // ← runs immediately on module load (before render)

import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Toaster } from "@/components/ui/sonner";
import ReduxProvider from "../state/providers/reduxProvider";

export default function AuthAndReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // SessionAuth and ReduxProvider must be in a client component
  return (
    <SessionAuth requireAuth>
      <ReduxProvider>
        {children}
        <Toaster />
      </ReduxProvider>
    </SessionAuth>
  );
}
