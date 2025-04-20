"use client";

import RegisterPage from "@/components/register-page";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser ] = useState<{ firstName: string; lastName: string } | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const aadharId = searchParams.get("aadharId");

  useEffect(() => {
    const checkRegistration = async () => {
      if (!aadharId) {
        setUser (null);
        return;
      }

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/user`, {
          params: { aadharId },
        });
        if (res.status === 200) {
          setUser ({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
          });
        }
      } catch (error) {
        console.error("Error: ", error);
        setUser (null);
      }
    };

    checkRegistration();
  }, [aadharId]);

  useEffect(() => {
    if (user) {
      router.push(`dashboard?aadharId=${aadharId}`);
    }
  }, [user, aadharId, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {!user && <RegisterPage />}
    </div>
  );
}