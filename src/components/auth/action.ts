"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createSupabaseClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      captchaToken: formData.get("captchaToken") as string,
    },
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    throw error;
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createSupabaseClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      captchaToken: formData.get("captchaToken") as string,
      emailRedirectTo: "http://localhost:3000/auth",
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    throw error;
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Logout failed: " + error.message);
  }
}
