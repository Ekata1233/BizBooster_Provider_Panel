"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { SubscribedService } from "../(admin)/service-management/my-subscription/page";

// ✅ StoreInfo Type
type StoreInfo = {
  storeName?: string;
  storePhone?: string;
  storeEmail?: string;
  module?: string;
  zone?: string;
  logo?: string;
  cover?: string;
  tax?: string;
  location?: { lat: number; lng: number };
  address?: string;
  officeNo?: string;
  city?: string;
  state?: string;
  country?: string;
   tags?: string[];
  totalProjects? : number;
  totalExperience? : number;
};

// ✅ KYC Type
type KYC = {
  aadhaarCard?: string[];
  panCard?: string[];
  storeDocument?: string[];
  GST?: string[];
  other?: string[];
};

// ✅ ProviderDetails Type (matches full response)
type ProviderDetails = {
  _id: string;
  fullName: string;
  phoneNo: string;
  email: string;
  subscribedServices?: SubscribedService[];
  referralCode?: string;
  referredBy?: string;
  companyLogo?: string;
  companyName?: string;
  isRejected?: boolean;
  isApproved?: boolean;
  isVerified?: boolean;
  isDeleted?: boolean;
  step1Completed?: boolean;
  storeInfoCompleted?: boolean;
  kycCompleted?: boolean;
  galleryImages?: string[];
  registrationStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  storeInfo?: StoreInfo;
  kyc?: KYC;
  providerId?: string;
  isStoreOpen?: boolean|null;
  isPromoted?: boolean|null;
};

// ✅ If needed, use same structure for Provider
type Provider = ProviderDetails;

type AuthContextType = {
  provider: Provider | null;
  providerDetails: ProviderDetails | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProviderDetails: () => Promise<void>;
  loading: boolean;
};

// ✅ Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Provider Wrapper
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [providerDetails, setProviderDetails] = useState<ProviderDetails | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("providerToken");
    const savedProvider = localStorage.getItem("providerData");
    const savedDetails = localStorage.getItem("providerDetails");

    if (savedToken) setToken(savedToken);
    if (savedProvider) setProvider(JSON.parse(savedProvider));
    if (savedDetails) setProviderDetails(JSON.parse(savedDetails));
  }, []);

  // ✅ Refresh provider details if not yet loaded
  useEffect(() => {
    if (!providerDetails && provider?._id && token) {
      refreshProviderDetails();
    }
  }, [providerDetails, provider, token]);

  // ✅ Login Function
  const login = async (email: string, password: string) => {
    setProvider(null);
    setProviderDetails(null);
    setToken(null);
    setLoading(true);
    localStorage.clear(); // or remove specific keys

    try {
      const res = await fetch("https://api.fetchtrue.com/api/provider/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ Required for cookies
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      const provider = data.data.provider;
      const token = data.data.token;

      setProvider(provider);
      setToken(token);
      localStorage.setItem("providerData", JSON.stringify(provider));
      // localStorage.setItem("providerDetails", JSON.stringify(provider));
      localStorage.setItem("providerToken", token);
            localStorage.setItem("token", token);


      // Fetch full provider details
      const providerDetailsRes = await fetch(
        `https://api.fetchtrue.com/api/provider/${provider._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const detailsData = await providerDetailsRes.json();

      console.log("details dat : ", detailsData)

      // if (providerDetailsRes.ok && detailsData.success) {
      //   setProviderDetails(detailsData.data);
      //   localStorage.setItem("providerDetails", JSON.stringify(detailsData.data));
      // } 
      if (providerDetailsRes.ok && detailsData._id) {
        setProviderDetails(detailsData);
        localStorage.setItem("providerDetails", JSON.stringify(detailsData));
      }

      else {
        console.warn("⚠️ Provider details fetch failed");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      throw new Error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refresh Function
  const refreshProviderDetails = useCallback(async () => {
    if (!provider?._id || !token) return;

    try {
      const res = await fetch(
        `https://api.fetchtrue.com/api/provider/${provider._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      console.log("data of provider : ", data)

      if (res.ok && data) {
        setProviderDetails(data);
        localStorage.setItem("providerDetails", JSON.stringify(data));
      } else {
        console.warn("⚠️ Failed to refresh provider details:", data.message);
      }
    } catch (error) {
      console.error("🔁 Error refreshing provider details:", error);
    }
  }, [provider?._id, token]);


  // ✅ Logout Function
  const logout = async () => {
    
    // Clear state
    setProvider(null);
    setProviderDetails(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem("providerToken");
    localStorage.removeItem("providerData");
    localStorage.removeItem("providerDetails");
    localStorage.removeItem("token");
    localStorage.removeItem("theme");

    try {
      await fetch("https://api.fetchtrue.com/api/provider/logout", {
        method: "POST",
        credentials: "include", 
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    console.log("🚪 Logged out and cleared all relevant localStorage items");
  };


  return (
    <AuthContext.Provider
      value={{ provider, providerDetails, token, login, logout, refreshProviderDetails, loading, }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
