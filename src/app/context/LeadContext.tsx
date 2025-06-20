"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

export interface ILead {
  _id?: string;
  checkout: string;
  serviceCustomer: string;
  serviceMan: string;
  service: string;
  amount: number;
  leads: IStatus[];
  createdAt?: string;
  updatedAt?: string;
}

interface LeadContextType {
  leads: ILead[];
  loading: boolean;
  fetchLeads: () => void;
  createLead: (formData: FormData) => Promise<void>;
  updateLeadStatus: (id: string, leadIndex: number, formData: FormData) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider = ({ children }: { children: React.ReactNode }) => {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const API_BASE = "https://biz-booster.vercel.app/api/leads";

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const createLead = async (formData: FormData) => {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        body: formData,
      });
      const newLead = await res.json();
      setLeads((prev) => {
        const exists = prev.find((l) => l._id === newLead._id);
        if (exists) {
          return prev.map((lead) =>
            lead._id === newLead._id ? newLead : lead
          );
        }
        return [...prev, newLead];
      });
    } catch (err) {
      console.error("Failed to create lead:", err);
    }
  };

  const updateLeadStatus = async (id: string, leadIndex: number, formData: FormData) => {
    try {
      formData.append("leadIndex", leadIndex.toString());
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        body: formData,
      });
      const updatedLead = await res.json();
      setLeads((prev) =>
        prev.map((lead) => (lead._id === updatedLead.data._id ? updatedLead.data : lead))
      );
    } catch (err) {
      console.error("Failed to update lead status:", err);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });
      setLeads((prev) => prev.filter((lead) => lead._id !== id));
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <LeadContext.Provider
      value={{ leads, loading, fetchLeads, createLead, updateLeadStatus, deleteLead }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLead = () => {
  const context = useContext(LeadContext);
  if (!context) throw new Error("useLead must be used within a LeadProvider");
  return context;
};
