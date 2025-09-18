"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useProviderWallet } from "@/app/context/WalletContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import WalletStats from "@/components/account-management/WalletStats";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { FaMoneyBillWave, FaWallet, FaFileDownload } from "react-icons/fa";
import * as XLSX from "xlsx";

interface Transaction {
  _id?: string;
  transactionId?: string;
  referenceId?: string;
  type: "credit" | "debit";
  source?: string;
  description?: string;
  createdAt: string;
  amount: number;
  leadId?: string;
  runningBalance?: number;
}

const tabs: Array<"all" | "credit" | "debit"> = ["all", "credit", "debit"];

const Page = () => {
  const { providerDetails } = useAuth();
  const { wallet, fetchWalletByProvider, loading } = useProviderWallet();
  const [activeTab, setActiveTab] = useState<"all" | "credit" | "debit">("all");

  const providerId = providerDetails?._id;

  useEffect(() => {
    if (providerId) fetchWalletByProvider(providerId);
  }, [providerId]);

  if (loading) return <p>Loading wallet...</p>;

  // Fallback wallet
  const fallbackWallet = {
    receivableBalance: 0,
    cashInHand: 0,
    withdrawableBalance: 0,
    pendingWithdraw: 0,
    alreadyWithdrawn: 0,
    totalEarning: 0,
    totalCredits: 0,
    transactions: [],
  };

  const safeWallet = wallet || fallbackWallet;
  const allTransactions = safeWallet.transactions || [];

  // Add running balance
  let runningBalance = 0;
  const transactionsWithBalance: Transaction[] = allTransactions.map(
    (txn: Transaction) => {
      if (txn.type === "credit") {
        runningBalance += txn.amount;
      } else if (txn.type === "debit") {
        runningBalance -= txn.amount;
      }
      return { ...txn, runningBalance };
    }
  );

  // ✅ reverse so newest at top
  const reversedTransactions = [...transactionsWithBalance].reverse();

  // Filter by tab
  const filteredTransactions = reversedTransactions.filter(
    (txn: Transaction) => {
      if (activeTab === "all") return true;
      return txn.type === activeTab;
    }
  );

  // ✅ counts for badges
  const counts = {
    all: reversedTransactions.length,
    credit: reversedTransactions.filter((t) => t.type === "credit").length,
    debit: reversedTransactions.filter((t) => t.type === "debit").length,
  };

  // ✅ columns with Serial No.
  const columnsWallet = [
    {
      header: "S.No",
      accessor: "serial",
      render: (_: Transaction, index: number) => (
        <span>{filteredTransactions.length - index}</span>
      ),
    },
    {
      header: "Transaction ID",
      accessor: "transactionId",
      render: (row: Transaction) => <span>{row.referenceId || "-"}</span>,
    },
    {
      header: "Transaction Type",
      accessor: "type",
      render: (row: Transaction) => <span>{row.description}</span>,
    },
    {
      header: "Transaction Date",
      accessor: "date",
      render: (row: Transaction) => (
        <span>{new Date(row.createdAt).toLocaleString()}</span>
      ),
    },
    {
      header: "Lead ID",
      accessor: "leadId",
      render: (row: Transaction) => (
        <span className="text-xs text-muted-foreground">
          {row.leadId || "-"}
        </span>
      ),
    },
    {
      header: "Debit",
      accessor: "debit",
      render: (row: Transaction) =>
        row.type === "debit" ? `₹${row.amount}` : "-",
    },
    {
      header: "Credit",
      accessor: "credit",
      render: (row: Transaction) =>
        row.type === "credit" ? `₹${row.amount}` : "-",
    },
    {
      header: "Withdraw",
      accessor: "withdraw",
      render: (row: Transaction) =>
        row.source === "withdraw" ? `₹${row.amount}` : "-",
    },
    {
      header: "Balance",
      accessor: "balance",
      render: (row: Transaction & { runningBalance?: number }) => (
        <span>₹{row.runningBalance ?? "-"}</span>
      ),
    },
  ];

  const isWalletAvailable = reversedTransactions.length > 0;

  // ✅ Excel Download
  const handleDownload = () => {
    if (!filteredTransactions.length) return;

    const exportData = filteredTransactions.map((txn, index) => ({
      "S.No": index + 1,
      "Transaction ID": txn.referenceId || "-",
      Type: txn.type,
      Description: txn.description || "-",
      "Lead ID": txn.leadId || "-",
      Debit: txn.type === "debit" ? txn.amount : "-",
      Credit: txn.type === "credit" ? txn.amount : "-",
      Withdraw: txn.source === "withdraw" ? txn.amount : "-",
      Balance: txn.runningBalance ?? "-",
      Date: new Date(txn.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${activeTab}-wallet`);
    XLSX.writeFile(workbook, `${activeTab}-wallet.xlsx`);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Account Information" />
      <div className="space-y-6">
        {/* Wallet Stats */}
        <WalletStats
          wallet={{
            receivableBalance: safeWallet.receivableBalance,
            cashInHand: safeWallet.cashInHand,
            withdrawableBalance: safeWallet.withdrawableBalance,
            pendingWithdraw: safeWallet.pendingWithdraw,
            alreadyWithdrawn: safeWallet.alreadyWithdrawn,
            totalEarning: safeWallet.totalCredits,
          }}
        />

        {/* Transaction Table */}
        <ComponentCard title="Transaction Summary">
          <div>
            {!isWalletAvailable ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
                <FaWallet className="text-5xl mb-4 text-blue-400" />
                <h2 className="text-xl font-semibold mb-2">No Wallet Found</h2>
                <p className="text-sm max-w-md">
                  This wallet doesn&rsquo;t have any transactions yet. Once
                  transactions are made, they will appear here.
                </p>
              </div>
            ) : (
              <>
                {/* ✅ Tabs + Download Button */}
                <div className="flex justify-between items-center border-b mb-4">
                  <div className="flex gap-4">
                    {tabs.map((tab) => (
                      <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`cursor-pointer px-4 py-2 text-sm font-medium ${
                          activeTab === tab
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        <span className="ml-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          {counts[tab]}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                  >
                    <FaFileDownload className="w-5 h-5" />
                    <span>Download Excel</span>
                  </button>
                </div>

                {filteredTransactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
                    <FaMoneyBillWave className="text-5xl mb-4 text-blue-400" />
                    <h2 className="text-xl font-semibold mb-2">
                      No Transactions Found
                    </h2>
                    <p className="text-sm max-w-md">
                      This wallet doesn&rsquo;t have any transactions yet. Once
                      transactions are made, they will appear here.
                    </p>
                  </div>
                ) : (
                  <BasicTableOne
                    columns={columnsWallet}
                    data={filteredTransactions}
                  />
                )}
              </>
            )}
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default Page;
