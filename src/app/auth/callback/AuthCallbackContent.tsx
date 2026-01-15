"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuthCookie, setAuthCookie } from "@/lib/cookies/setCookies";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getUserData } from "@/helpers/jwtHelper";

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing login...");
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      console.error("No token received in callback");
      setStatus("Login failed. No token received.");
      toast.error("Authentication failed");
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    const handleLogin = async () => {
      try {
        await setAuthCookie(token);
        const key = await getAuthCookie("jwt");
        if (key) {
          const userData = (await getUserData()) as any;
          setUser(userData);
          setStatus("Login successful. Redirecting...");
          toast.success("Login successful");
          router.push("/home");
        }
      
      } catch (error) {
        console.error("Error setting auth cookie:", error);
        setStatus("Login failed. Please try again.");
        toast.error("Authentication failed");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    handleLogin();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">{status}</h2>
        <p className="text-gray-600">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  );
}
