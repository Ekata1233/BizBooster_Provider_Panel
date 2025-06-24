"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";

interface IExtraService {
  serviceName: string;
  price: number;
  discount: number;
  total: number;
}

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
  newAmount?: number;
  extraService?: IExtraService[];
  leads: IStatus[];
}

interface LeadContextType {
  leads: LeadType[];
  loadingLeads: boolean;
  errorLeads: string | null;
  refetchLeads: () => void;
  createLead: (data: FormData) => Promise<void>;
  getLeadByCheckoutId: (checkoutId: string) => Promise<LeadType | null>;
  updateLeadByCheckoutId: (
    checkoutId: string,
    updates: { newAmount?: number; extraService?: IExtraService[] }
  ) => Promise<LeadType | null>;
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
    } catch (err: any) {
    let message = "Failed to create lead.";
    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }
    setErrorLeads(message);

    // ✅ Instead of throwing a new Error, just throw the message directly:
    throw message;
  } finally {
    setLoadingLeads(false);
  }
};

  const updateLeadByCheckoutId = async (
    checkoutId: string,
    updates: { newAmount?: number; extraService?: IExtraService[] }
  ): Promise<LeadType | null> => {
    try {
      const res = await axios.put(
        `https://biz-booster.vercel.app/api/leads/FindByCheckout/${checkoutId}`,
        updates
      );
      const updatedLead = res.data?.data;

      // Optionally update local state if the lead exists in the list
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.checkout === checkoutId ? { ...lead, ...updatedLead } : lead
        )
      );

      return updatedLead || null;
    } catch (err) {
      console.error("Failed to update lead by checkoutId:", err);
      return null;
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
        updateLeadByCheckoutId,
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
