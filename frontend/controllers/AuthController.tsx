// frontend/controllers/AuthController.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import ThirdParty from "supertokens-auth-react/recipe/thirdparty";
import type { OauthProvider } from "../../types/auth/auth.types";
import { initST } from "../lib/supertokens.client";
import AuthView from "../views/AuthView";

function AuthController() {
  const router = useRouter();

  useEffect(() => {
    initST();
  }, []);

  async function handleSubmit(provider: OauthProvider) {
    // Build callback like /auth/callback/google, /auth/callback/github, etc.
    const frontendRedirectURI = `${location.origin}/auth/callback/${provider}`;
    // Fix later, only implement google for now
    if (provider === "google") {
      const url =
        await ThirdParty.getAuthorisationURLWithQueryParamsAndSetState({
          thirdPartyId: provider,
          frontendRedirectURI,
        });
      router.push(url);
    } else {
      toast.error(`${provider} is not supported yet`);
    }
  }

  return <AuthView onSubmit={handleSubmit} />;
}

export default AuthController;
