"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useProviderWallet } from "@/app/context/WalletContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import WalletStats from "@/components/account-management/WalletStats";

const Page = () => {
  const { providerDetails } = useAuth();
  const { wallet, fetchWalletByProvider, loading, error } = useProviderWallet();
  const providerId = providerDetails?._id;

  useEffect(() => {
    if (providerId) fetchWalletByProvider(providerId);
  }, [providerId]);

  if (loading) return <p>Loading wallet...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!wallet) return <p>No wallet found.</p>;

  return (
    <div>
      <PageBreadcrumb pageTitle="Account Information" />
      <div className="space-y-6">
        {/* Stat cards section */}
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

        {/* Extra details sections */}
        <ComponentCard title="Account Summary">
          <div>
            {/* You can display wallet.bankAccount, wallet.upiId, etc. here */}
            <p>Bank Account: {wallet.bankAccount}</p>
            <p>UPI ID: {wallet.upiId}</p>
            <p>Beneficiary ID: {wallet.beneficiaryId}</p>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default Page;
