"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ThirdParty from "supertokens-auth-react/recipe/thirdparty";
import { initST } from "@/lib/supertokens.client";
import type { Dispatch } from "@/state/store";
import { clearUser } from "@/state/user/userSlice";
import { getUser } from "@/state/user/userThunk";
import OAuthCallbackView from "@/views/OAuthCallbackView";

export default function OAuthCallbackController() {
  const router = useRouter();
  const dispatch = useDispatch<Dispatch>();
  useEffect(() => {
    initST();
    (async () => {
      const result = await ThirdParty.signInAndUp();
      if (result.status === "OK") {
        await ThirdParty.getStateAndOtherInfoFromStorage();
        await dispatch(getUser()); // fetch user details and store in Redux
        router.replace("/search");
      } else {
        // Todo add a toaser to show the error to the user
        dispatch(clearUser());
        router.replace("/login?error=oauth");
      }
    })();
  }, [router, dispatch]);

  return <OAuthCallbackView />;
}
