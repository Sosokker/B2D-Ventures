import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { SignupButton } from "@/components/auth/signupButton";
import { SignupForm } from "@/components/auth/signupForm";

import Link from "next/link";

export default function Signup() {
  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: "url(/login.png)" }}
    >
      <Card>
        <CardHeader className="items-center">
          <CardTitle className="text-2xl font-bold">Join Our Community</CardTitle>
          <CardDescription>
            Create an account and be a part of a thriving community of investors and innovators.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2 mx-28">
          <p className="self-center font-semibold text-slate-800 dark:text-slate-200">Sign Up With</p>
          <SignupForm />
          <hr></hr>
          <SignupButton />
        </CardContent>
        <CardFooter className="text-xs justify-center">
          <span>
            By signing up, you agree to the{" "}
            <Link href="/terms" rel="noopener noreferrer" target="_blank" className="text-blue-600 underline">
              Terms of Service
            </Link>{" "}
            and acknowledge you’ve read our{" "}
            <Link href="/privacy" rel="noopener noreferrer" target="_blank" className="text-blue-600 underline">
              Privacy Policy
            </Link>
            .
          </span>{" "}
        </CardFooter>
      </Card>
    </div>
  );
}
