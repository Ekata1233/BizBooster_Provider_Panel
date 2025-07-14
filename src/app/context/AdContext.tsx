'use client';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AdType {
  _id?: string;
  addType: 'image' | 'video';
  category: string;
  service: string;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  fileUrl: string;
}

interface AdContextType {
  ads: AdType[];
  fetchAds: () => void;
  createAd: (data: FormData) => Promise<void>;
  deleteAd: (id: string) => Promise<void>;
  updateAd: (id: string, data: Partial<AdType>) => Promise<void>;
}

const AdContext = createContext<AdContextType | null>(null);

// ✅ Your actual deployed API base URL
const API_BASE_URL = 'https://biz-booster.vercel.app/api/ads';

export const AdProvider = ({ children }: { children: React.ReactNode }) => {
  const [ads, setAds] = useState<AdType[]>([]);

  const fetchAds = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setAds(res.data.data);
    } catch (error) {
      console.error('Failed to fetch ads:', error);
    }
  };

  const createAd = async (formData: FormData) => {
    try {
      await axios.post(API_BASE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchAds();
    } catch (error) {
      console.error('Failed to create ad:', error);
      throw error;
    }
  };

  const deleteAd = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setAds(prev => prev.filter(ad => ad._id !== id));
    } catch (error) {
      console.error('Failed to delete ad:', error);
    }
  };

  const updateAd = async (id: string, data: Partial<AdType>) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        const value = data[key as keyof AdType];
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      }

      await axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      fetchAds();
    } catch (error) {
      console.error('Failed to update ad:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <AdContext.Provider value={{ ads, fetchAds, createAd, deleteAd, updateAd }}>
      {children}
    </AdContext.Provider>
  );
};

export const useAdContext = () => {
  const context = useContext(AdContext);
  if (!context) throw new Error('useAdContext must be used within AdProvider');
  return context;
};
