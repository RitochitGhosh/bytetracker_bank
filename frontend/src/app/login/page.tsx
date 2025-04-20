"use client";

import { CreditCardIcon } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

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

const loginSchema = z.object({
  aadharId: z
    .string()
    .length(12, { message: "Aadhar ID must be exactly 12 digits." })
    .regex(/^\d+$/, { message: "Aadhar ID must only contain digits." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      aadharId: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/user`,
        {
          params: { aadharId: data.aadharId },
        }
      );
  
      if (res.status === 200) {
        toast.success("Login successful!");
        router.push(`/dashboard/?aadharId=${data.aadharId}`);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md transition-all hover:shadow-2xl">
        <div className="bg-emerald-500 dark:bg-emerald-600 p-8 text-white rounded-t-xl">
          <div className="flex items-center justify-center mb-4">
            <CreditCardIcon size={36} className="mr-2" />
            <h1 className="text-3xl font-bold">Byte Bank</h1>
          </div>
          <p className="text-center text-emerald-100 text-sm dark:text-emerald-200">
            Login to your account
          </p>
        </div>

        <div className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                disabled={form.formState.isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white py-3 rounded-md transition duration-200"
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-300">
            Do not have an account?{" "}
            <span
              onClick={() => router.push(`/`)}
              className="text-blue-600 dark:text-blue-400 underline cursor-pointer"
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;