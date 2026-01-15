"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getAuthCookie, setAuthCookie } from "@/lib/cookies/setCookies";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import { getUserData } from "@/helpers/jwtHelper";
import { toast } from "sonner";

export interface LoginProps {
  onSignupClick?: () => void;
  isNotModal?: boolean;
}

const formSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone number is required").refine((value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  }, {
    message: "Please enter a valid email address or phone number.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  })
});

const Login: React.FC<LoginProps> = ({ onSignupClick, isNotModal }) => {
  const router = useRouter();
  const { setUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrPhone: "",
      password: ""
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const loginData = {
        ...(values.emailOrPhone.includes('@') ? { email: values.emailOrPhone } : { phone: values.emailOrPhone }),
        password: values.password,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/login`,
        loginData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && response.data.accessToken) {
        setAuthCookie(response.data.accessToken).then(async (res) => {
          const key = await getAuthCookie("jwt");
          if (key) {
            const userData = (await getUserData()) as any;
            setUser(userData);
            router.push("/home");
          }
        });
      } else {
        console.error("Login failed: No token received");
        toast.error("Login failed: No token received")
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response.data.message)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/google`;
  };

  return (
    <div
      className={`flex items-center justify-center ${
        isNotModal ? "min-h-screen" : ""
      }`}
    >
      <div className="bg-white rounded-lg p-8 w-[400px]">
        <h1 className="text-slate-500 text-3xl montserrat-font font-bold text-center">
          Welcome Back
        </h1>
        <p className="text-slate-500 mt-4 text-center">
          Please enter your credentials to login
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6"
          >
            <FormField
              control={form.control}
              name="emailOrPhone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Email or Phone Number"
                      {...field}
                      className="w-full h-14"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Password"
                      {...field}
                      className="w-full h-14"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-14">
              Login
            </Button>
          </form>
        </Form>
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            type="button"
            className="w-full h-14 mt-4"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
          <div></div>
        </div>
        <p className="mt-4 text-slate-500 text-center">
          Don't have an account?{" "}
          {onSignupClick ? (
            <button
              onClick={onSignupClick}
              className="text-blue-500 hover:underline"
            >
              Sign up
            </button>
          ) : (
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
