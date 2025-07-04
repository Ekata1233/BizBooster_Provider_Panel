"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import { ServiceCustomer } from "../(admin)/booking-management/accepted-requests/page";

export interface ServiceType {
  _id: string;
  serviceName: string;
  price: number;
  discount: number;
  discountedPrice: number;
  serviceDiscount: number;
}

export interface CheckoutType {
  _id: string;
  bookingId: string;
  user: string;
  service: ServiceType;
  serviceCustomer: ServiceCustomer;
  provider: string;
  coupon?: string;
  subtotal: number;
  serviceDiscount: number;
  couponDiscount: number;
  champaignDiscount: number;
  vat: number;
  platformFee: number;
  garrentyFee: number;
  tax: number;
  totalAmount: number;
  termsCondition: boolean;
  paymentMethod: ('credit_card' | 'upi' | 'pac' | 'net_banking' | 'wallet')[];
  walletAmount: number;
  paidByOtherMethodAmount: number;
  partialPaymentNow: number;
  partialPaymentLater: number;
  remainingPaymentStatus: 'pending' | 'paid' | 'failed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'processing' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  isVerified: boolean;
  isAccepted: boolean;
  acceptedDate: Date;
  serviceMan?: string;
  isCompleted: boolean;
  isCanceled: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}


interface CheckoutContextType {
  checkouts: CheckoutType[];
  loadingCheckouts: boolean;
  errorCheckouts: string | null;
  fetchCheckoutsByProviderId: (providerId: string) => Promise<void>;

  checkoutDetails: CheckoutType | null;
  loadingCheckoutDetails: boolean;
  errorCheckoutDetails: string | null;
  fetchCheckoutsDetailsById: (providerId: string) => Promise<void>;

  updateCheckoutById: (id: string, data: Partial<CheckoutType>) => Promise<void>;
  loadingUpdate: boolean;
  errorUpdate: string | null;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

interface CheckoutProviderProps {
  children: ReactNode;
}

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({
  children,
}) => {
  const [checkouts, setCheckouts] = useState<CheckoutType[]>([]);
  const [loadingCheckouts, setLoadingCheckouts] = useState<boolean>(false);
  const [errorCheckouts, setErrorCheckouts] = useState<string | null>(null);

  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutType | null>(null);
  const [loadingCheckoutDetails, setLoadingCheckoutDetails] = useState<boolean>(false);
  const [errorCheckoutDetails, setErrorCheckoutDetails] = useState<string | null>(null);

  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [errorUpdate, setErrorUpdate] = useState<string | null>(null);

  const fetchCheckoutsByProviderId = async (providerId: string) => {
    setLoadingCheckouts(true);
    try {
      const res = await axios.get(
        `https://biz-booster.vercel.app/api/checkout/${providerId}`
      );
      setCheckouts(res.data?.data || []);
      setErrorCheckouts(null);
    } catch (err) {
      console.error("Error fetching checkouts:", err);
      setErrorCheckouts("Failed to fetch checkouts.");
    } finally {
      setLoadingCheckouts(false);
    }
  };

  const fetchCheckoutsDetailsById = async (id: string) => {
    setLoadingCheckoutDetails(true);
    try {
      const res = await axios.get(
        `https://biz-booster.vercel.app/api/checkout/details/${id}`
      );
      setCheckoutDetails(res.data?.data || null);
      setErrorCheckoutDetails(null);
    } catch (err) {
      console.error("Error fetching checkouts:", err);
      setErrorCheckoutDetails("Failed to fetch checkouts.");
    } finally {
      setLoadingCheckoutDetails(false);
    }
  };


  const updateCheckoutById = async (id: string, data: Partial<CheckoutType>) => {
    setLoadingUpdate(true);
    setErrorUpdate(null);
    try {
      const res = await axios.put(`https://biz-booster.vercel.app/api/checkout/${id}`, data);
      setCheckoutDetails(res.data?.data || null); // Update local detail if relevant
      
    }catch (err: unknown) {
  const error = err as { response?: { data?: { message?: string } } };
  console.error("Error updating checkout:", error);
  setErrorUpdate(error.response?.data?.message || "Failed to update checkout.");
}

    finally {
      setLoadingUpdate(false);
    }
  };
  return (
    <CheckoutContext.Provider
      value={{
        checkouts,
        loadingCheckouts,
        errorCheckouts,
        fetchCheckoutsByProviderId,

        checkoutDetails,
        loadingCheckoutDetails,
        errorCheckoutDetails,
        fetchCheckoutsDetailsById,

        updateCheckoutById,
        loadingUpdate,
        errorUpdate,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = (): CheckoutContextType => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};
