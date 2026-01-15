"use client";
import Login from "@/components/login/login";
import { useRouter } from "next/navigation";
import React, { Suspense } from "react";

const LoginPage = () => {
  const router = useRouter();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login onSignupClick={() => router.push("/signup")} isNotModal={true} />
    </Suspense>
  );
};

export default LoginPage;
