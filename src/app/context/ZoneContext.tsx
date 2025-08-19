"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

// ✅ Zone Coordinates Type
export interface CoordinateType {
  _id: string;
  lat: number;
  lng: number;
}

// ✅ Zone Type
export interface ZoneType {
  _id: string;
  name: string;
  coordinates: CoordinateType[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ✅ Context Type
interface ZoneContextType {
  zones: ZoneType[];
  loadingZones: boolean;
  errorZones: string | null;
  refetchZones: () => void;
}

// ✅ Create Context
const ZoneContext = createContext<ZoneContextType | undefined>(undefined);

// ✅ Provider Props
interface ZoneProviderProps {
  children: ReactNode;
}

// ✅ Provider Component
export const ZoneProvider: React.FC<ZoneProviderProps> = ({ children }) => {
  const [zones, setZones] = useState<ZoneType[]>([]);
  const [loadingZones, setLoadingZones] = useState<boolean>(true);
  const [errorZones, setErrorZones] = useState<string | null>(null);

  const fetchZones = async () => {
    setLoadingZones(true);
    try {
      const res = await axios.get("https://biz-booster.vercel.app/api/zone");
      setZones(res.data?.data || []);
      setErrorZones(null);
    } catch (err) {
      console.error("Failed to fetch zones:", err);
      setErrorZones("Something went wrong while fetching zones.");
    } finally {
      setLoadingZones(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  return (
    <ZoneContext.Provider
      value={{
        zones,
        loadingZones,
        errorZones,
        refetchZones: fetchZones,
      }}
    >
      {children}
    </ZoneContext.Provider>
  );
};

// ✅ Custom Hook
export const useZone = (): ZoneContextType => {
  const context = useContext(ZoneContext);
  if (!context) {
    throw new Error("useZone must be used within a ZoneProvider");
  }
  return context;
};
