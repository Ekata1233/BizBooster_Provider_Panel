"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import axios from "axios";

// Define payout data types
export interface CashfreeResponse {
  beneficiary_id: string;
  beneficiary_name: string;
  beneficiary_instrument_details: {
    bank_account_number: string;
    bank_ifsc: string;
  };
  beneficiary_contact_details: {
    beneficiary_phone: string;
    beneficiary_country_code: string;
    beneficiary_email: string;
    beneficiary_address: string;
    beneficiary_city: string;
    beneficiary_state: string;
    beneficiary_postal_code: string;
  };
  beneficiary_status: string;
  added_on: string;
}

export interface SavedBankDetails {
  _id: string;
  userId: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
  ifsc: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PayoutResponse {
  cashfreeResponse: CashfreeResponse;
  savedBankDetails: SavedBankDetails;
}

// Define context shape
interface PayoutContextType {
  payoutData: PayoutResponse | null;
  loadingPayout: boolean;
  errorPayout: string | null;
  addBeneficiary: (payload: {
    userId: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    branchName: string;
  }) => Promise<void>;
}

// Create context
const PayoutContext = createContext<PayoutContextType | undefined>(undefined);

// Provider
interface PayoutProviderProps {
  children: ReactNode;
}

export const PayoutProvider: React.FC<PayoutProviderProps> = ({ children }) => {
  const [payoutData, setPayoutData] = useState<PayoutResponse | null>(null);
  const [loadingPayout, setLoadingPayout] = useState<boolean>(false);
  const [errorPayout, setErrorPayout] = useState<string | null>(null);

  const addBeneficiary = async (payload: {
    userId: string;
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
    } catch (err) {
      console.error("Failed to add beneficiary:", err);
      setErrorPayout("Something went wrong while adding beneficiary.");
    } finally {
      setLoadingPayout(false);
    }
  };

  return (
    <PayoutContext.Provider
      value={{ payoutData, loadingPayout, errorPayout, addBeneficiary }}
    >
      {children}
    </PayoutContext.Provider>
  );
};

// Custom hook
export const usePayout = (): PayoutContextType => {
  const context = useContext(PayoutContext);
  if (!context) {
    throw new Error("usePayout must be used within a PayoutProvider");
  }
  return context;
};
