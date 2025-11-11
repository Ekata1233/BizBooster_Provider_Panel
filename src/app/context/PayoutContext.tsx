"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

// --------------------
// Types
// --------------------
export interface SavedBankDetails {
  _id: string;
  providerId: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
  ifsc: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PayoutResponse {
  success: boolean;
  message: string;
  savedBankDetails: SavedBankDetails;
}

// --------------------
// Context Shape
// --------------------
interface PayoutContextType {
  payoutData: PayoutResponse | null;
  bankDetailsList: SavedBankDetails[];
  loadingPayout: boolean;
  errorPayout: string | null;

  addBeneficiary: (payload: {
    providerId: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    branchName: string;
  }) => Promise<void>;

  fetchBankDetails: (providerId: string) => Promise<void>;
}

// --------------------
// Create Context
// --------------------
const PayoutContext = createContext<PayoutContextType | undefined>(undefined);

// --------------------
// Provider Component
// --------------------
interface PayoutProviderProps {
  children: ReactNode;
}

export const PayoutProvider: React.FC<PayoutProviderProps> = ({ children }) => {
  const [payoutData, setPayoutData] = useState<PayoutResponse | null>(null);
  const [bankDetailsList, setBankDetailsList] = useState<SavedBankDetails[]>([]);
  const [loadingPayout, setLoadingPayout] = useState<boolean>(false);
  const [errorPayout, setErrorPayout] = useState<string | null>(null);

  // --------------------
  // Fetch Bank Details (GET)
  // --------------------
  const fetchBankDetails = async (providerId: string) => {
    setLoadingPayout(true);
    try {
      const res = await axios.get(
        `https://api.fetchtrue.com/api/provider/bank-details/${providerId}`
      );

      if (res.data.success) {
        // The API returns a single object in `data`
        const bankDetail: SavedBankDetails = res.data.data;
        setBankDetailsList([bankDetail]); // wrap in array for UI consistency
        setErrorPayout(null);
      } else {
        setErrorPayout(res.data.message || "Failed to fetch bank details.");
      }
    } catch (err: any) {
      console.error("Failed to fetch bank details:", err);
      setErrorPayout(
        err.response?.data?.message ||
          "Something went wrong while fetching bank details."
      );
    } finally {
      setLoadingPayout(false);
    }
  };

  // --------------------
  // Add Beneficiary (POST)
  // --------------------
  const addBeneficiary = async (payload: {
    providerId: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    branchName: string;
  }) => {
    setLoadingPayout(true);
    try {
      const res = await axios.post(
        "https://api.fetchtrue.com/api/provider/payout/add-beneficiary",
        payload
      );
      setPayoutData(res.data);
      setErrorPayout(null);

      // Refresh list after adding
      await fetchBankDetails(payload.providerId);
    } catch (err: any) {
      console.error("Failed to add beneficiary:", err);
      setErrorPayout(
        err.response?.data?.message ||
          "Something went wrong while adding beneficiary."
      );
    } finally {
      setLoadingPayout(false);
    }
  };

  return (
    <PayoutContext.Provider
      value={{
        payoutData,
        bankDetailsList,
        loadingPayout,
        errorPayout,
        addBeneficiary,
        fetchBankDetails,
      }}
    >
      {children}
    </PayoutContext.Provider>
  );
};

// --------------------
// Custom Hook
// --------------------
export const usePayout = (): PayoutContextType => {
  const context = useContext(PayoutContext);
  if (!context) {
    throw new Error("usePayout must be used within a PayoutProvider");
  }
  return context;
};
