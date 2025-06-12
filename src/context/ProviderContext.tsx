// "use client";

// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import axios from "axios";

// type ProviderDetails = {
//   _id: string;
//   fullName: string;
//   phoneNo: string;
//   email: string;
//   password?: string;
//   referredBy?: string | null;
//   isDeleted?: boolean;
//   isVerified?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
//   kyc?: {
//     GST?: string[];
//     aadhaarCard?: string[];
//     panCard?: string[];
//     storeDocument?: string[];
//     other?: string[];
//   };
//   storeInfo?: {
//     address?: string;
//     city?: string;
//     state?: string;
//     country?: string;
//     cover?: string;
//     logo?: string;
//     location?: { type: string; coordinates: number[] };
//     officeNo?: string;
//     storeEmail?: string;
//     storeName?: string;
//     storePhone?: string;
//     tax?: string;
//     zone?: string;
//   };
//   module?: {
//     _id: string;
//     name: string;
//     image: string;
//     isDeleted?: boolean;
//     createdAt?: string;
//     updatedAt?: string;
//   };
// };

// type ProviderContextType = {
//   providerDetails: ProviderDetails | null;
//   setProviderDetails: React.Dispatch<React.SetStateAction<ProviderDetails | null>>;
// };

// const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

// interface ProviderProviderProps {
//   children: ReactNode;
//   loggedInProviderId: string | null;
// }

// export const ProviderProvider = ({ children, loggedInProviderId }: ProviderProviderProps) => {
//   const [providerDetails, setProviderDetails] = useState<ProviderDetails | null>(null);

//   useEffect(() => {
//     if (!loggedInProviderId) {
//       setProviderDetails(null);
//       return;
//     }

//     const fetchProvider = async () => {
//       try {
//         const response = await axios.get<ProviderDetails>(
//           `https://biz-booster.vercel.app/api/provider/${loggedInProviderId}`
//         );
//         setProviderDetails(response.data);
//       } catch (error) {
//         console.error("Failed to fetch provider details:", error);
//         setProviderDetails(null);
//       }
//     };
// console.log(providerDetails);

//     fetchProvider();
//   }, [loggedInProviderId]);

//   return (
//     <ProviderContext.Provider value={{ providerDetails, setProviderDetails }}>
//       {children}
//     </ProviderContext.Provider>
//   );
// };

// export const useProvider = () => {
//   const context = useContext(ProviderContext);
//   if (!context) throw new Error("useProvider must be used within ProviderProvider");
//   return context;
// };


'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Provider {
  _id: string;
  fullName: string;
  email: string;
  phoneNo: string;
  password?: string;
  storeInfo?: Record<string, any>;
  kyc?: Record<string, any>;
  step1Completed?: boolean;
  storeInfoCompleted?: boolean;
  kycCompleted?: boolean;
  registrationStatus?: 'basic' | 'store' | 'done';
}

type ProviderContextType = {
  provider: Provider | null;
  loading: boolean;
  error: string | null;
  registerProvider: (data: FormData) => Promise<void>;
  updateStoreInfo: (data: FormData) => Promise<void>;
  updateKycInfo: (data: FormData) => Promise<void>;
  getProviderById: (id: string) => Promise<void>;
  updateProvider: (id: string, updates: any) => Promise<void>;
  deleteProvider: (id: string) => Promise<void>;
};

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (!context) throw new Error('useProvider must be used within a ProviderContextProvider');
  return context;
};

const BASE_URL = 'https://biz-booster.vercel.app/api/provider';

export const ProviderContextProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerProvider = async (formData: FormData) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        body: formData,
         credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
       if (data.token) {
      localStorage.setItem('token', data.token);
    }
      setProvider(data.provider);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStoreInfo = async (formData: FormData) => {
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/store-info`, {
        method: 'PUT',
        body: formData,
        headers: {
        Authorization: `Bearer ${token}`,
      },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Store info update failed');
      setProvider(data.provider);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateKycInfo = async (formData: FormData) => {
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/kyc`, {
        method: 'PUT',
        body: formData,
         headers: {
        Authorization: `Bearer ${token}`, // ✅ pass token here
      },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'KYC update failed');
      setProvider(data.provider);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProviderById = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch provider');
      setProvider(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProvider = async (id: string, updates: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update provider');
      setProvider(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProvider = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete provider');
      setProvider(null);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProviderContext.Provider
      value={{
        provider,
        loading,
        error,
        registerProvider,
        updateStoreInfo,
        updateKycInfo,
        getProviderById,
        updateProvider,
        deleteProvider,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
};
