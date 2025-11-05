"use client";
import { createContext, useContext, useEffect, useState } from "react";

export interface BusinessInformation {
  identityType: string;
  identityNumber: string;
  identityImage?: string;
}

export interface ServiceMan {
  _id: string;
  name: string;
  lastName: string;
  phoneNo: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  generalImage?: string;
  businessInformation: BusinessInformation;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T | null;
}

interface ServiceManContextType {
  serviceMen: ServiceMan[];
  serviceMenByProvider: ServiceMan[];
  fetchServiceMen: () => Promise<void>;
  fetchServiceMenByProvider: (providerId: string) => Promise<void>;
  addServiceMan: (formData: FormData) => Promise<ApiResponse<ServiceMan> | undefined>;
  updateServiceMan: (id: string, formData: FormData) => Promise<ApiResponse<ServiceMan> | undefined>;
  deleteServiceMan: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ServiceManContext = createContext<ServiceManContextType | undefined>(undefined);

const API_BASE = "https://api.fetchtrue.com/api/serviceman";

export const ServiceManProvider = ({ children }: { children: React.ReactNode }) => {
  const [serviceMen, setServiceMen] = useState<ServiceMan[]>([]);
  const [serviceMenByProvider, setServiceMenByProvider] = useState<ServiceMan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceMen = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setServiceMen(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch servicemen");
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceMenByProvider = async (providerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/filterByProvider/${providerId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch by provider");
      setServiceMenByProvider(data.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const addServiceMan = async (
    formData: FormData
  ): Promise<ApiResponse<ServiceMan> | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          status: res.status,
          message: data?.message || "Failed to create serviceman",
          data: null,
        };
      }

      fetchServiceMen();
      return {
        status: res.status,
        message: data?.message || "Serviceman created successfully",
        data,
      };

    } catch (err: any) {
      return {
        status: 500,
        message: err.message || "Add failed",
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateServiceMan = async (
    id: string,
    formData: FormData
  ): Promise<ApiResponse<ServiceMan> | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          status: res.status,
          message: data?.message || "Update failed",
          data: null,
        };
      }

      fetchServiceMen();

      return {
        status: res.status,
        message: data?.message || "ServiceMan updated successfully",
        data: data?.data ?? null,
      };

    } catch (err: any) {
      return {
        status: 500,
        message: err.message || "Update failed",
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteServiceMan = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Delete failed");

      fetchServiceMen();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceMen();
  }, []);

  return (
    <ServiceManContext.Provider
      value={{
        serviceMen,
        serviceMenByProvider,
        fetchServiceMen,
        fetchServiceMenByProvider,
        addServiceMan,
        updateServiceMan,
        deleteServiceMan,
        loading,
        error,
      }}
    >
      {children}
    </ServiceManContext.Provider>
  );
};

export const useServiceMan = () => {
  const context = useContext(ServiceManContext);
  if (!context) {
    throw new Error("useServiceMan must be used within a ServiceManProvider");
  }
  return context;
};
