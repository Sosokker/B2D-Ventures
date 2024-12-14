"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListRestart } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function ResetPasswordPage() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  useEffect(() => {
    if (resetSuccess) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        toast.success("Password recovery successful! Please enter your new password.");
        setResetSuccess(true);
        setFailedAttempts(0);
        return;
      } else {
        setFailedAttempts((prev) => prev + 1);
      }
    });

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [resetSuccess, supabase.auth, router]);

  useEffect(() => {
    if (failedAttempts >= 3) {
      router.push("/");
    }
  }, [failedAttempts, router]);

  const updatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill out both fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        console.error("Error updating password:", error);
        toast.error(error.message || "There was an error updating your password.");
      } else {
        toast.success("Password updated successfully!");
        router.push("/");
      }
    } catch (e) {
      console.error("Unexpected error:", e);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-screen-xl flex items-center justify-center my-24">
      <Card>
        <CardHeader className="items-center">
          <ListRestart className="text-blue-600 w-12 h-12" />
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Enter your new password below to reset it.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4 justify-center items-center">
          <Input
            id="new-password"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={failedAttempts >= 3 && !resetSuccess}
          />
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={failedAttempts >= 3 && !resetSuccess}
          />
          <Button
            variant="default"
            className="w-full"
            onClick={updatePassword}
            disabled={loading || (failedAttempts >= 3 && !resetSuccess)}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
        <CardFooter className="text-xs justify-center">
          <p>If you encounter issues, please contact support.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
