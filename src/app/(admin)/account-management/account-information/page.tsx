"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useProviderWallet } from "@/app/context/WalletContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import WalletStats from "@/components/account-management/WalletStats";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { FaMoneyBillWave, FaWallet } from "react-icons/fa";


interface Transaction {
  _id: string;
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


const columnsWallet = [
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
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">
          Lead Id : {row.leadId || "-"}
        </span>
        {/* <span className="text-xs text-muted-foreground">
          From : {row.commissionFrom || "N/A"}
        </span> */}
      </div>
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

const Page = () => {
  const { providerDetails } = useAuth();
  const { wallet, fetchWalletByProvider, loading, error } = useProviderWallet();
  const [activeTab, setActiveTab] = useState<'all' | 'credit' | 'debit' | 'withdraw'>('all');

  console.log("wallet of provider : ", wallet)

  const providerId = providerDetails?._id;

  useEffect(() => {
    if (providerId) fetchWalletByProvider(providerId);
  }, [providerId]);

  if (loading) return <p>Loading wallet...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!wallet) return <p>No wallet found.</p>;

  const allTransactions = wallet.transactions || [];

  // Add running balance to each transaction (optional enhancement)
  let runningBalance = 0;
  const transactionsWithBalance = allTransactions.map((txn: any) => {
    if (txn.type === "credit") {
      runningBalance += txn.amount;
    } else if (txn.type === "debit") {
      runningBalance -= txn.amount;
    }
    return { ...txn, runningBalance };
  });

  // Filter transactions based on tab
  const filteredTransactions = transactionsWithBalance.filter((txn: any) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'withdraw') return txn.source === 'withdraw';
    return txn.type === activeTab;
  });

  const isWalletAvailable = allTransactions.length > 0;

  return (
    <div>
      <PageBreadcrumb pageTitle="Account Information" />
      <div className="space-y-6">
        {/* Wallet Stats */}
        <WalletStats
          wallet={{
            receivableBalance: wallet.receivableBalance,
            cashInHand: wallet.cashInHand,
            withdrawableBalance: wallet.withdrawableBalance,
            pendingWithdraw: wallet.pendingWithdraw,
            alreadyWithdrawn: wallet.alreadyWithdrawn,
            totalEarning: wallet.totalEarning,
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
                  This wallet doesn't have any transactions yet. Once transactions are made, they will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-4">
                  {['all', 'credit', 'debit', 'withdraw'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`min-w-[120px] px-4 py-2 rounded-md text-sm font-medium border ${
                        activeTab === tab
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-100 hover:bg-blue-50"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {filteredTransactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
                    <FaMoneyBillWave className="text-5xl mb-4 text-blue-400" />
                    <h2 className="text-xl font-semibold mb-2">No Transactions Found</h2>
                    <p className="text-sm max-w-md">
                      This wallet doesn't have any transactions yet. Once transactions are made, they will appear here.
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
