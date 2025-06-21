"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";

// =======================
// Types
// =======================

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
}

// =======================
// Context Setup
// =======================

const LeadContext = createContext<LeadContextType | undefined>(undefined);

interface LeadProviderProps {
  children: ReactNode;
}

export const LeadProvider: React.FC<LeadProviderProps> = ({ children }) => {
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [loadingLeads, setLoadingLeads] = useState<boolean>(false);
  const [errorLeads, setErrorLeads] = useState<string | null>(null);

  // Fetch existing leads - optional, based on GET endpoint (if exists)
  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await axios.get("https://biz-booster.vercel.app/api/leads");
      setLeads(res.data?.data || []);
      setErrorLeads(null);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setErrorLeads("Failed to fetch leads.");
    } finally {
      setLoadingLeads(false);
    }
  };

  // POST a new lead
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
      // Optionally add the new lead to local state
      setLeads((prev) => [...prev, res.data]);
      setErrorLeads(null);
    } catch (err) {
      console.error("Failed to create lead:", err);
      setErrorLeads("Failed to create lead.");
    } finally {
      setLoadingLeads(false);
    }
  };

  // Initial fetch (optional if GET is supported)
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
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

// =======================
// Hook to use LeadContext
// =======================

export const useLead = (): LeadContextType => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error("useLead must be used within a LeadProvider");
  }
  return context;
};
