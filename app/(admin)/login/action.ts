'use server'

import { loginSchema } from "@/lib/schemas/auth";
import { redirect } from "next/navigation";

export type LoginState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function loginAdminAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const rawData = Object.fromEntries(formData.entries());

  const result = loginSchema.safeParse(rawData);

  if (!result.success) {
    const { fieldErrors } = result.error.flatten();
    return { errors: fieldErrors };
  }

  console.log("Login Admin Valid:", result.data);

  redirect("/dashboard");
}