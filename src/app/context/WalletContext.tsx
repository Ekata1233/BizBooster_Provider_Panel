"use client";

import axios from "axios";
import React, { createContext, useContext, useState } from "react";

export interface WalletTransaction {
  type: "credit" | "debit";
  amount: number;
  description?: string;
  referenceId?: string;
  method?: string;
  source?: string;
  status?: "success" | "failed" | "pending";
  createdAt: string;
}

export interface ProviderWallet {
  _id: string;
  providerId: string;
  balance: number;
  beneficiaryId: string;
  bankAccount: string;
  upiId?: string;
  transactions: WalletTransaction[];
  receivableBalance: number;
  withdrawableBalance: number;
  pendingWithdraw: number;
  alreadyWithdrawn: number;
  totalEarning: number;
  cashInHand: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalCredits: number;

}

interface ProviderWalletContextType {
  wallet: ProviderWallet | null;
  loading: boolean;
  error: string | null;
  fetchWalletByProvider: (providerId: string) => Promise<void>;
}

const WalletContext = createContext<ProviderWalletContextType | undefined>(undefined);

const WALLET_API = "https://api.fetchtrue.com/api/provider/wallet"; // Update this

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [wallet, setWallet] = useState<ProviderWallet | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletByProvider = async (providerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${WALLET_API}/${providerId}`);
      setWallet(response.data.data); // assuming { success: true, data: {...wallet} }
    } catch (err: unknown) {
      let message = "Error fetching wallet";

      if (typeof err === "object" && err !== null) {
        const maybeError = err as { message?: string; response?: { data?: { message?: string } } };
        message =
          maybeError.response?.data?.message ||
          maybeError.message ||
          message;
      }

      setError(message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        loading,
        error,
        fetchWalletByProvider,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useProviderWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useProviderWallet must be used within a WalletProvider");
  }
  return context;
};
