"use client";
import Signup from "@/components/signup/signup";
import { useRouter } from "next/navigation";
import React from "react";

const SignupPage = () => {
  const router = useRouter();

  return (
    <Signup
      onLoginClick={() => router.push("/login")}
    />
  );
};

export default SignupPage;
