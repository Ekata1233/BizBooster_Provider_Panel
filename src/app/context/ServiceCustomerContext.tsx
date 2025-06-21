"use client";
import React, {
  createContext,
  useContext,
  useState,

  ReactNode,
} from "react";
import axios from "axios";

// Define the TypeScript interface for ServiceCustomer
export interface IServiceCustomer {
  customerId: string;
  fullName: string;
  phone: string;
  email: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Context props
interface ServiceCustomerContextType {
  serviceCustomer: IServiceCustomer | null;
  loading: boolean;
  error: string | null;
  fetchServiceCustomer: (id: string) => void;
}

// Create context
const ServiceCustomerContext = createContext<ServiceCustomerContextType | undefined>(undefined);

// Provider component
export const ServiceCustomerProvider = ({ children }: { children: ReactNode }) => {
  const [serviceCustomer, setServiceCustomer] = useState<IServiceCustomer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceCustomer = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://biz-booster.vercel.app/api/service-customer/${id}`);
      setServiceCustomer(response.data.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || "Something went wrong");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <ServiceCustomerContext.Provider value={{ serviceCustomer, loading, error, fetchServiceCustomer }}>
      {children}
    </ServiceCustomerContext.Provider>
  );
};

// Custom hook
export const useServiceCustomer = () => {
  const context = useContext(ServiceCustomerContext);
  if (!context) {
    throw new Error("useServiceCustomer must be used within a ServiceCustomerProvider");
  }
  return context;
};
