import {
  AppleIcon,
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
  MicrosoftIcon,
} from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OauthProvider } from "../../types/auth/auth.types";

type AuthViewProps = {
  onSubmit: (provider: OauthProvider) => void;
};

export default function AuthView({ onSubmit }: AuthViewProps) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome!</CardTitle>
              <CardDescription>
                Login with your favourite provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => onSubmit("apple")}
                    >
                      <AppleIcon />
                      Login with Apple
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => onSubmit("google")}
                    >
                      <GoogleIcon />
                      Login with Google
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => onSubmit("facebook")}
                    >
                      <FacebookIcon />
                      Login with Facebook
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => onSubmit("github")}
                    >
                      <GithubIcon />
                      Login with Github
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => onSubmit("microsoft")}
                    >
                      <MicrosoftIcon />
                      Login with Microsoft
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
