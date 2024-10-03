import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { LoginButton } from "@/components/auth/loginButton";
import { LoginForm } from "@/components/auth/loginForm";

export default function Login() {
  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: "url(/login.png)" }}>
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
          By signing up, you agree to the Terms of Service and acknowledge you’ve read our Privacy Policy.
        </CardFooter>
      </Card>
    </div>
  );
}
