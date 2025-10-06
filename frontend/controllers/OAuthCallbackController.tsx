"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ThirdParty from "supertokens-auth-react/recipe/thirdparty";
import { initST } from "@/lib/supertokens.client";
import OAuthCallbackView from "@/views/OAuthCallbackView";

export default function OAuthCallbackController() {
  const router = useRouter();
  useEffect(() => {
    initST();
    (async () => {
      const result = await ThirdParty.signInAndUp();
      if (result.status === "OK") {
        await ThirdParty.getStateAndOtherInfoFromStorage();
        router.replace("/search");
      } else {
        // Todo add a toaser to show the error to the user
        router.replace("/login?error=oauth");
      }
    })();
  }, [router]);

  return <OAuthCallbackView />;
}
