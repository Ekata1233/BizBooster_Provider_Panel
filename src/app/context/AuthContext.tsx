
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import mongoose from "mongoose";
type KYC = {
  aadhaarCard: string[];
  panCard: string[];
  storeDocument: string[];
  GST: string[];
  other: string[];
}
// Basic login provider info
type StoreInfo = {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  module: mongoose.Types.ObjectId;
  zone: mongoose.Types.ObjectId;
  logo?: string;
  cover?: string;
  tax: string;
  location: Location;
  address: string;
  officeNo: string;
  city: string;
  state: string;
  country: string;
};
type Provider = {
  _id: string;
  fullName: string;
  phoneNo: string;
  email: string;
  password?: string;
  referredBy?: string;
  companyLogo?: string;
  companyName?: string;
  storeInfo?: StoreInfo;
  kyc?: KYC;
};
// 
// Full provider details from API
type ProviderDetails = {
  _id: string;
  fullName: string;
  phoneNo: string;
  email: string;
  password?: string;
  referredBy?: string;
  companyLogo?: string;
  companyName?: string;
  subscribedServices?: string[];
  // Add any other fields returned from API
};

type AuthContextType = {
  provider: Provider | null;
  providerDetails: ProviderDetails | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProviderDetails: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [providerDetails, setProviderDetails] = useState<ProviderDetails | null>(null);
  const [token, setToken] = useState<string | null>(null);

  console.log("provider details from providerDetails : ", provider);
  useEffect(() => {
    const savedToken = localStorage.getItem("providerToken");
    const savedProvider = localStorage.getItem("providerData");
    const savedDetails = localStorage.getItem("providerDetails");

    if (savedToken) setToken(savedToken);
    if (savedProvider) setProvider(JSON.parse(savedProvider));
    if (savedDetails) setProviderDetails(JSON.parse(savedDetails));
  }, []);

  // const login = async (email: string, password: string) => {
  //   try {
  //     const res = await fetch("https://biz-booster.vercel.app/api/provider/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await res.json();

  //     if (data.success) {
  //       const providerId = data.data.provider._id;
  //       const token = data.data.token;

  //       // console.log("provider id : ", providerId);

  //       setToken(token);
  //       setProvider(data.data.provider);
  //       localStorage.setItem("providerToken", token);
  //       localStorage.setItem("providerData", JSON.stringify(data.data.provider));

  //       // Fetch full provider details
  //       const providerRes = await fetch(`https://biz-booster.vercel.app/api/provider/${providerId}`);
  //       const providerDetailsData = await providerRes.json();

  //       // console.log("provider details from providerRes : ", providerRes);

  //       // console.log("provider details from providerDetailsData : ", providerDetailsData);

  //       if (providerRes.ok && providerDetailsData.success) {
  //         setProviderDetails(providerDetailsData.data);
  //         localStorage.setItem("providerDetails", JSON.stringify(providerDetailsData.data));
  //       } else {
  //         throw new Error("Failed to fetch provider details");
  //       }
  //     } else {
  //       throw new Error("Login failed");
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     throw err;
  //   }
  // };


  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("https://biz-booster.vercel.app/api/provider/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ Required for cookies
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login failed response:", data);
        throw new Error(data.message || "Login failed");
      }

      const provider = data.provider; // ✅ Based on your API's response
      const providerId = provider._id;

      setProvider(provider);
      localStorage.setItem("providerData", JSON.stringify(provider));

      // Fetch full provider details
      const providerRes = await fetch(`https://biz-booster.vercel.app/api/provider/${providerId}`, {
        credentials: "include", // ✅ Also include cookies here
      });
      const providerDetailsData = await providerRes.json();

      if (providerRes.ok && providerDetailsData.success) {
        setProviderDetails(providerDetailsData.data);
        localStorage.setItem("providerDetails", JSON.stringify(providerDetailsData.data));
      } else {
        throw new Error("Failed to fetch provider details");
      }
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };


  //  const refreshProviderDetails = useCallback(async () => {
  //     if (!provider?._id) return;

  //     try {
  //       const res = await fetch(`https://biz-booster.vercel.app/api/provider/${provider._id}`, {
  //         headers: {
  //           Authorization: token ? `Bearer ${token}` : "",
  //         },
  //       });
  //       const data = await res.json();

  //       if (res.ok && data.success) {
  //         setProviderDetails(data.data);
  //         localStorage.setItem("providerDetails", JSON.stringify(data.data));
  //       } else {
  //         console.error("Failed to refresh provider details");
  //       }
  //     } catch (error) {
  //       console.error("Error refreshing provider details:", error);
  //     }
  //   }, [provider?._id, token]);



  const refreshProviderDetails = useCallback(async () => {
    if (!provider?._id) return;

    try {
      const res = await fetch(`https://biz-booster.vercel.app/api/provider/${provider._id}`, {
        credentials: "include", // ✅ Required for cookie auth
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setProviderDetails(data.data);
        localStorage.setItem("providerDetails", JSON.stringify(data.data));
      } else {
        console.error("Failed to refresh provider details");
      }
    } catch (error) {
      console.error("Error refreshing provider details:", error);
    }
  }, [provider?._id]);

  const logout = () => {
    setProvider(null);
    setProviderDetails(null);
    setToken(null);
    localStorage.removeItem("providerToken");
    localStorage.removeItem("providerData");
    localStorage.removeItem("providerDetails");
  };

  return (
    <AuthContext.Provider value={{ provider, providerDetails, token, login, logout, refreshProviderDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
