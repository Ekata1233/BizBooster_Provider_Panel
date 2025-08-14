'use client';

import axios from 'axios';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface AdType {
  _id?: string;
  addType: 'image';
  category: string;
  service: string;
  provider?: string;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  fileUrl: string;
  isExpired?: boolean;
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AdContextType {
  ads: AdType[];
  loading: boolean;
  error: string | null;
  fetchAds: () => Promise<void>;
  createAd: (data: FormData) => Promise<void>;
  deleteAd: (id: string) => Promise<void>;
  updateAd: (id: string, data: Partial<AdType>) => Promise<void>;
}

const AdContext = createContext<AdContextType | null>(null);

// ✅ API base URL (use env variable for flexibility)
const API_BASE_URL =  'https://biz-booster.vercel.app/api/ads';

export const AdProvider = ({ children }: { children: ReactNode }) => {
  const [ads, setAds] = useState<AdType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAds = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_BASE_URL);
      setAds(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch ads:', err);
      setError('Failed to fetch ads');
    } finally {
      setLoading(false);
    }
  };

  const createAd = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(API_BASE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchAds();
    } catch (err) {
      console.error('Failed to create ad:', err);
      setError('Failed to create ad');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setAds(prev => prev.filter(ad => ad._id !== id));
    } catch (err) {
      console.error('Failed to delete ad:', err);
      setError('Failed to delete ad');
    } finally {
      setLoading(false);
    }
  };

  const updateAd = async (id: string, data: Partial<AdType>) => {
    setLoading(true);
    setError(null);
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
      await fetchAds();
    } catch (err) {
      console.error('Failed to update ad:', err);
      setError('Failed to update ad');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <AdContext.Provider
      value={{
        ads,
        loading,
        error,
        fetchAds,
        createAd,
        deleteAd,
        updateAd,
      }}
    >
      {children}
    </AdContext.Provider>
  );
};

export const useAdContext = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAdContext must be used within an AdProvider');
  }
  return context;
};
