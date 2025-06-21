"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";

export interface IStatus {
  statusType: string;
  description?: string;
  zoomLink?: string;
  paymentLink?: string;
  paymentType?: "partial" | "full";
  document?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadType {
  _id?: string;
  checkout: string;
  serviceCustomer: string;
  serviceMan: string;
  service: string;
  amount: number;
  leads: IStatus[];
}

interface LeadContextType {
  leads: LeadType[];
  loadingLeads: boolean;
  errorLeads: string | null;
  refetchLeads: () => void;
  createLead: (data: FormData) => Promise<void>;
   getLeadByCheckoutId: (checkoutId: string) => Promise<LeadType | null>;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

interface LeadProviderProps {
  children: ReactNode;
}

export const LeadProvider: React.FC<LeadProviderProps> = ({ children }) => {
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [loadingLeads, setLoadingLeads] = useState<boolean>(false);
  const [errorLeads, setErrorLeads] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await axios.get("https://biz-booster.vercel.app/api/leads");
      setLeads(res.data || []);
      setErrorLeads(null);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setErrorLeads("Failed to fetch leads.");
    } finally {
      setLoadingLeads(false);
    }
  };

  const getLeadByCheckoutId = async (checkoutId: string): Promise<LeadType | null> => {
  try {
    const res = await axios.get(
      `https://biz-booster.vercel.app/api/leads/FindByCheckout/${checkoutId}`
    );
    return res.data?.data || null;
  } catch (err) {
    console.error("Failed to fetch lead by checkoutId:", err);
    return null;
  }
};


  const createLead = async (formData: FormData) => {
    setLoadingLeads(true);
    try {
      const res = await axios.post(
        "https://biz-booster.vercel.app/api/leads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLeads((prev) => [...prev, res.data]);
      setErrorLeads(null);
    } catch (err) {
      console.error("Failed to create lead:", err);
      setErrorLeads("Failed to create lead.");
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <LeadContext.Provider
      value={{
        leads,
        loadingLeads,
        errorLeads,
        refetchLeads: fetchLeads,
        createLead,
         getLeadByCheckoutId,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLead = (): LeadContextType => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error("useLead must be used within a LeadProvider");
  }
  return context;
};
