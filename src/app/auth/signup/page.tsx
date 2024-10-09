import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { SignupButton } from "@/components/auth/signupButton";
import { SignupForm } from "@/components/auth/signupForm";

export default function Signup() {
  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: "url(/signup.png)" }}>
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
          By signing up, you agree to the Terms of Service and acknowledge you’ve read our Privacy Policy.
        </CardFooter>
      </Card>
    </div>
  );
}
