import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { LoginButton } from "@/components/auth/loginButton";
import { LoginForm } from "@/components/auth/loginForm";

import Link from "next/link";

export default function Login() {
  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: "url(/login.png)" }}
    >
      <Card>
        <CardHeader className="items-center">
          <CardTitle className="text-2xl font-bold">Empower Your Vision</CardTitle>
          <CardDescription>
            Unlock opportunities and connect with a community of passionate investors and innovators.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2 mx-28">
          <p className="self-center font-semibold text-slate-800 dark:text-slate-200">Continue With</p>
          <LoginForm />
          <hr></hr>
          <LoginButton />
        </CardContent>
        <CardFooter className="text-xs justify-center">
          <span>
            By signing in, you agree to the{" "}
            <Link href="/terms" rel="noopener noreferrer" target="_blank" className="text-blue-600 underline">
              Terms of Service
            </Link>{" "}
            and acknowledge you’ve read our{" "}
            <Link href="/privacy" rel="noopener noreferrer" target="_blank" className="text-blue-600 underline">
              Privacy Policy
            </Link>
            .
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
