"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import Link from "next/link";

const VerifyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      router.push("/");
    }
  }, [email, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-4">
          <Mail className="text-blue-600 dark:text-blue-400 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-blue-600 dark:text-blue-400 mb-4">Check Your Email</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          We have sent a verification link to <strong>{email}</strong>. Please check your inbox (and spam folder) to
          confirm your email address.
        </p>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          If you did not receive the email, click below to contact support.
        </p>
        <Link href="mailto:b2d.ventures.contact@gmail.com">
          <Button className="w-full mt-4">Contact Support</Button>
        </Link>
      </div>
    </div>
  );
};

export default VerifyPage;
