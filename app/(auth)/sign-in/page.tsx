import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import CredentialsSignInForm from "./credentials-signin-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect(callbackUrl || "/");
  }
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.svg"
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority={true}
            />
          </Link>
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CredentialsSignInForm />
          {/* for Demo User */}
          <div className="rounded-lg border border-[#FFCA28]/50 bg-[#FFCA28]/10 p-4">
            <p className="text-center text-sm font-semibold text-[#B77900]">
              Demo Account
            </p>
            <p className="mt-1 text-center text-xs text-[#B77900]">
              Explore the full purchase flow with this demo account.
            </p>
            <div className="mt-3 space-y-1 text-center text-sm text-muted-foreground">
              <p>
                Email:{" "}
                <span className="font-medium text-foreground">
                  demo@example.com
                </span>
              </p>
              <p>
                Password:{" "}
                <span className="font-medium text-foreground">
                  EcNextDemo2026!
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
