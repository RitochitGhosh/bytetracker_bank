"use client";

import axios from "axios";
import { CreditCardIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const Header = () => {
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const aadharId = searchParams.get("aadharId");

  useEffect(() => {
    const checkRegistration = async () => {
      if (!aadharId) {
        setUser(null);
        return;
      }

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/user`, {
          params: { aadharId },
        });
        if (res.status === 200) {
          setUser({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
          });
        }
      } catch (error) {
        console.error("Error_ : ", error);
        setUser(null);
      }
    };

    checkRegistration();
  }, [aadharId]);

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-2">
          <CreditCardIcon className="h-6 w-6 text-emerald-500" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Byte Bank</h1>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {user ? (
            <>
              <p className="text-gray-800 dark:text-gray-200 font-medium text-sm sm:text-base">
                Hello, {user.firstName} {user.lastName}
              </p>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Logout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will log you out of your Byte Bank session.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Confirm Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Not logged in</p>
          )}

          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
