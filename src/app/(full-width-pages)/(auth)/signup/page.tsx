import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Create Your Account | MyApp",
  description: "Sign up to access all the features of MyApp.",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
