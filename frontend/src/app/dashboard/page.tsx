"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  CalendarIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  WalletIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const getFormattedDate = (timestamp: number) =>
  new Date(timestamp).toLocaleString();

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

type Transaction = {
  amount: number;
  timestamps: number;
  _id: string;
  type: "Credit" | "Debit";
};

type UserData = {
  firstName: string;
  lastName: string;
  aadharId: string;
  total: number;
  credits: Transaction[];
  debits: Transaction[];
};

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState<Date | undefined>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [amount, setAmount] = useState("");
  const searchParams = useSearchParams();
  const aadharId = searchParams.get("aadharId");

  const fetchUserData = async () => {
    if (!aadharId) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/user`,
        {
          params: { aadharId },
        }
      );
      setUser(res.data);
      const creditTxns = res.data.credits.map((c: Transaction) => ({
        ...c,
        type: "Credit",
      }));
      const debitTxns = res.data.debits.map((d: Transaction) => ({
        ...d,
        type: "Debit",
      }));
      setTransactions(
        [...creditTxns, ...debitTxns].sort(
          (a, b) => b.timestamps - a.timestamps
        )
      );
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = async (date: Date) => {
    if (!aadharId || !date) return;
    try {
      // Convert date to start of day to properly filter transactions after this date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/filter-transactions`,
        {
          params: { aadharId, after: startOfDay.getTime() },
        }
      );

      const creditTxns = res.data.credits.map((c: Transaction) => ({
        ...c,
        type: "Credit",
      }));
      const debitTxns = res.data.debits.map((d: Transaction) => ({
        ...d,
        type: "Debit",
      }));

      setTransactions(
        [...creditTxns, ...debitTxns].sort(
          (a, b) => b.timestamps - a.timestamps
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to filter transactions");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [aadharId]);

  const handleAddMoney = async () => {
    if (!aadharId || !amount) return;
    setIsAdding(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/add-money`,
        {
          aadharId,
          amount: Number(amount),
        }
      );
      toast.success("Money added!");
      fetchUserData();
      setAmount("");
    } catch {
      toast.error("Failed to add money");
    } finally {
      setIsAdding(false);
    }
  };

  const handleWithdrawMoney = async () => {
    if (!aadharId || !amount) return;
    setIsWithdrawing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/deduct-money`,
        {
          aadharId,
          amount: Number(amount),
        }
      );
      toast.success("Money withdrawn!");
      fetchUserData();
      setAmount("");
    } catch {
      toast.error("Failed to withdraw money");
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto" />
          <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded-xl mx-auto" />
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) return <div className="text-center p-6">User not found</div>;

  return (
    <div className="h-screen px-4 py-6 flex justify-center bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="w-full max-w-6xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">
            Welcome, {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground">
            Here is your financial breakdown
          </p>
        </div>

        {/* Updated grid for better mobile layout - all cards at same level */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-100 dark:bg-blue-900 shadow-md rounded-2xl">
            <CardHeader className="flex items-center gap-2">
              <WalletIcon className="text-blue-500" />
              <CardTitle>Total Balance</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {formatCurrency(user.total)}
            </CardContent>
          </Card>

          <Card className="bg-green-100 dark:bg-green-800 shadow-md rounded-2xl">
            <CardHeader className="flex items-center gap-2">
              <ArrowDownIcon className="text-green-500" />
              <CardTitle>Credit</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {formatCurrency(user.credits.reduce((a, b) => a + b.amount, 0))}
            </CardContent>
          </Card>

          <Card className="bg-red-100 dark:bg-red-800 shadow-md rounded-2xl">
            <CardHeader className="flex items-center gap-2">
              <ArrowUpIcon className="text-red-500" />
              <CardTitle>Debit</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {formatCurrency(user.debits.reduce((a, b) => a + b.amount, 0))}
            </CardContent>
          </Card>
        </div>

        {/* Improved mobile layout for the transaction controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-2 border-gray-300 dark:border-gray-600 rounded-md px-4 py-2"
          />
          <Button
            onClick={handleAddMoney}
            disabled={!amount || isAdding}
            className="transition-all duration-200 hover:scale-105"
          >
            {isAdding ? "Adding..." : "Add Money"}
          </Button>
          <Button
            onClick={handleWithdrawMoney}
            disabled={!amount || isWithdrawing}
            variant="destructive"
            className="transition-all duration-200 hover:scale-105"
          >
            {isWithdrawing ? "Withdrawing..." : "Withdraw Money"}
          </Button>
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-700" />

        <div className="mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <h2 className="text-xl font-medium">Transaction History</h2>
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Filter by Date
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filterDate}
                    onSelect={(date) => {
                      setFilterDate(date);
                      if (date) filterTransactions(date);
                    }}
                  />
                </PopoverContent>
              </Popover>

              {filterDate && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFilterDate(undefined);
                    fetchUserData();
                  }}
                >
                  Clear Filter
                </Button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {transactions.length === 0 ? (
              <p className="text-center text-sm text-gray-500 mt-4">
                No transactions found for selected date.
              </p>
            ) : (
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-left text-sm">
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr
                      key={txn._id}
                      className="border-t dark:border-gray-600 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-2 px-4">{txn.type}</td>
                      <td className="py-2 px-4">
                        {formatCurrency(txn.amount)}
                      </td>
                      <td className="py-2 px-4">
                        {getFormattedDate(txn.timestamps)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
