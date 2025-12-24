"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";


export interface IExtraService {
  serviceName: string;
  price: number;
  discount: number;
  total: number;
  commission: string;
  isLeadApproved: boolean | null;
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
  newDiscountAmount?: number;
  afterDicountAmount?: number;
  extraService?: IExtraService[];
  leads: IStatus[];
  isAdminApproved?: boolean;
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
    updates: { newAmount?: number; newDiscountAmount?: number; afterDicountAmount?: number; extraService?: IExtraService[] }
  ) => Promise<{ data: LeadType | null; errorMessage?: string }>;
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
      const res = await axios.get("https://api.fetchtrue.com/api/leads");
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
        `https://api.fetchtrue.com/api/leads/FindByCheckout/${checkoutId}`
      );
      return res.data?.data || null;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { status?: number } }).response?.status === 'number'
      ) {
        const typedError = error as {
          response?: {
            status?: number;
          };
          message?: string;
        };

        if (typedError.response?.status === 404) {
          console.warn("Lead not found for ID:");
          return null;
        }

        console.error("Unexpected error in getLeadByCheckoutId:", typedError.message ?? error);
        return null;
      }

      console.error("Unknown error in getLeadByCheckoutId:", error);
      return null;
    }

  };

  const createLead = async (formData: FormData) => {
    setLoadingLeads(true);
    try {
      const res = await axios.post(
        "https://api.fetchtrue.com/api/leads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLeads((prev) => [...prev, res.data]);
      setErrorLeads(null);
    } catch (err: unknown) {
      let message = "Failed to create lead.";

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
      ) {
        message = (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? message;
      }

      setErrorLeads(message);

      // ✅ Throw the message directly
      throw message;
    }
    finally {
      setLoadingLeads(false);
    }
  };

  const updateLeadByCheckoutId = async (
    checkoutId: string,
    updates: { newAmount?: number; newDiscountAmount?: number; afterDicountAmount?: number; extraService?: IExtraService[] }
  ): Promise<{ data: LeadType | null; errorMessage?: string }> => {
    try {
      const res = await axios.put(
        `https://api.fetchtrue.com/api/leads/FindByCheckout/${checkoutId}`,
        updates
      );
      const updatedLead = res.data?.data;

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.checkout === checkoutId ? { ...lead, ...updatedLead } : lead
        )
      );

      return { data: updatedLead || null };
    } catch (err: unknown) {
      console.error("Failed to update lead by checkoutId:", err);

      let message = "Something went wrong on the server.";

      if (err && typeof err === "object" && "response" in err) {
        const errorWithResponse = err as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        message = errorWithResponse.response?.data?.message || message;
      }

      return { data: null, errorMessage: message };
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
