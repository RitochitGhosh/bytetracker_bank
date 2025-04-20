"use client";

import { CreditCardIcon } from "lucide-react";
import React from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner"; // ✅ Import toast

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." })
    .max(25),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .max(25),
  aadharId: z
    .string()
    .length(12, { message: "Aadhar ID must be exactly 12 digits." })
    .regex(/^\d+$/, { message: "Aadhar ID must only contain digits." }),
});

const RegisterPage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      aadharId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res: AxiosResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/`,
        values
      );

      console.log("Backend host:", process.env.NEXT_PUBLIC_BACKEND_HOST);

      if (res.status === 201) {
        toast.success("User registered successfully!");
        router.push(`?aadharId=${values.aadharId}`);
      }
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-lg transition-all hover:shadow-2xl">
        <div className="bg-emerald-500 dark:bg-emerald-600 p-8 text-white rounded-t-xl">
          <div className="flex items-center justify-center mb-4">
            <CreditCardIcon size={36} className="mr-2" />
            <h1 className="text-3xl font-bold">Byte Bank</h1>
          </div>
          <p className="text-center text-emerald-100 text-sm dark:text-emerald-200">
            Track your finances with ease
          </p>
        </div>

        <div className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Random"
                        {...field}
                        className="bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="User"
                        {...field}
                        className="bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aadharId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      Aadhar ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456789012"
                        maxLength={12}
                        {...field}
                        className="bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white py-3 rounded-md transition duration-200"
              >
                Register
              </Button>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Log in
                </a>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
