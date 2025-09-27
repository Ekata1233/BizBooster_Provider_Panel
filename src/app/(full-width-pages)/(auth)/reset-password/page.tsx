import ResetPassword from "@/components/auth/ResetPassword";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Provider SignIn Page ",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function SignIn() {
 return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResetPassword />
    </Suspense>
  );
}
