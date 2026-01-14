"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

// Define the Coupon type (adapt based on your schema)
export type Coupon = {
  _id: string;
  couponType: string;
  couponCode: string;
  discountType: string;
  discountTitle: string;
  category?: { _id: string; name: string };
  service?: { _id: string; serviceName: string };
  zone?: { _id: string; name: string };
  discountAmountType: string;
  amount: number;
  startDate: string;
  endDate: string;
  minPurchase: number;
  maxDiscount: number;
  limitPerUser: number;
  discountCostBearer: string;
  couponAppliesTo: string;
  isDeleted?: boolean;
  isActive? : boolean;
  isApprove? : boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
};

type CouponAPIResponse = {
  success: boolean;
  message: string;
 data?: Coupon | Coupon[];
};

// Define the context type
interface CouponContextType {
  coupons: Coupon[];
  getCouponById: (id: string) => Promise<Coupon | null>;
  addCoupon: (formData: FormData) => Promise<CouponAPIResponse>;
  updateCoupon: (id: string, formData: FormData) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
}

// Create context
const CouponContext = createContext<CouponContextType | null>(null);

// Provider
export const CouponProvider = ({ children }: { children: React.ReactNode }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const { providerDetails } = useAuth();

  // Fetch all coupons
  const fetchCoupons = async () => {
     if (!providerDetails?._id) return;
    try {
      const response = await axios.get(`https://api.fetchtrue.com/api/coupon/provider?providerId=${providerDetails._id}`);
      console.log("response : ", response);
      setCoupons(response.data.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  // Initial fetch
useEffect(() => {
  if (providerDetails?._id) {
    fetchCoupons();
  }
}, [providerDetails?._id]);

const getCouponById = async (id: string): Promise<Coupon | null> => {
    try {
      const response = await axios.get<CouponAPIResponse>(
        `https://api.fetchtrue.com/api/coupon/${id}`
      );

      return response.data.success
        ? (response.data.data as Coupon)
        : null;
    } catch (error) {
      console.error("Error fetching coupon by ID:", error);
      return null;
    }
  };

  // Add coupon
  const addCoupon = async (formData: FormData): Promise<CouponAPIResponse> => {
    try {
      const response = await axios.post("https://api.fetchtrue.com/api/coupon", formData);
      fetchCoupons(); 
      return response.data; 
    } catch (error: unknown) {
    console.error("Error adding coupon:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      };
    }

    return {
      success: false,
      message: "Unexpected error occurred",
    };
  }
};


  // Update coupon
  const updateCoupon = async (id: string, formData: FormData) => {
    try {
      await axios.put(`https://api.fetchtrue.com/api/coupon/${id}`, formData);
      fetchCoupons();
    } catch (error) {
      console.error("Error updating coupon:", error);
    }
  };

  // Delete coupon
  const deleteCoupon = async (id: string) => {
    try {
      await axios.delete(`https://api.fetchtrue.com/api/coupon/${id}`);
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  return (
    <CouponContext.Provider
      value={{ coupons, getCouponById, addCoupon, updateCoupon, deleteCoupon }}
    >
      {children}
    </CouponContext.Provider>
  );
};

// Hook
export const useCoupon = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }
  return context;
};
