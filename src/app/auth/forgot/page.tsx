"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ChevronLeft, CircleAlert } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import toast from "react-hot-toast";

import { createClient } from "@supabase/supabase-js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | undefined>(undefined);
  const captcha = useRef<HCaptcha | null>(null);

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        captchaToken,
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL!}/reset`,
      });
      if (error) {
        toast.error("Failed to send reset link. Please check the email and try again.");
      } else {
        toast.success("Reset link sent! Check your email.");
      }
    } catch (e) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      captcha.current?.resetCaptcha();
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-screen-xl flex items-center justify-center my-24">
      <Card>
        <CardHeader className="items-center">
          <CircleAlert className="text-red-600 w-12 h-12" />
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>Enter your email and we&apos;ll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2 justify-center items-center">
          {/* Input field with state binding */}
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="default" className="w-full" onClick={() => forgotPassword(email)} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
          <HCaptcha
            ref={captcha}
            sitekey={process.env.NEXT_PUBLIC_SITEKEY!}
            onVerify={(token) => {
              setCaptchaToken(token);
            }}
          />
        </CardContent>
        <CardFooter className="text-xs justify-center">
          <Link href="/login" className="text-blue-600 hover:text-blue-800 flex justify-center items-center gap-x-2">
            <ChevronLeft /> Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
