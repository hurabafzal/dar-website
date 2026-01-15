"use client";

import React, { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUserData } from "@/helpers/jwtHelper";

const formSchema = z.object({
  userName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  userId: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  preferredLanguage: z.enum(["English", "Arabic"]).optional(),
  phone: z.string().min(8, {
    message: "Phone must be at least 8 characters.",
  }),
  groupId: z.number(),
});

interface SignupProps {
  onLoginClick?: () => void;
  onClose?: () => void;
  isNotModal?: boolean;
}

const Signup: React.FC<SignupProps> = ({ onLoginClick, onClose }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      userId: "",
      email: undefined,
      password: "",
      preferredLanguage: undefined,
      groupId: 3,
      phone: "",
    },
  });

  const checkLoggedInUser = async () => {
    const user: any = await getUserData();
    if (user) {
      router.push("/home");
    }
  };

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      values.userId = "cus-" + values.phone;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}users`,
        values,
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.data) {
        toast("User created successfully, login to continue", {
          className: "success-toast",
        });
        if (onClose) {
          onClose();
        }
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Error while user creation");
    }
  }

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-[400px]">
        <h1 className="text-slate-500 text-3xl montserrat-font font-bold text-center">
          Create an Account
        </h1>
        <p className="text-slate-500 mt-4 text-center">
          Please fill in the details below to sign up
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6"
          >
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                      className="w-full h-14"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email of User"
                      {...field}
                      className="w-full h-14"
                      type="email"
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
                      placeholder="Password"
                      {...field}
                      className="w-full h-14"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredLanguage"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full h-14">
                        <SelectValue placeholder="Select preferred language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Arabic">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Phone Number"
                      {...field}
                      className="w-full h-14"
                      type="tel"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-14">
              Sign Up
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-slate-500 text-center">
          Already have an account?{" "}
          {onLoginClick ? (
            <button
              onClick={onLoginClick}
              className="text-blue-500 hover:underline"
            >
              Login
            </button>
          ) : (
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default Signup;
