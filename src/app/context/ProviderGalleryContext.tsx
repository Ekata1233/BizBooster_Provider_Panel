"use client";

import React, { createContext, useContext, useState} from "react";
import axios from "axios";

export interface GalleryContextType {
  galleryImages: string[];
  fetchGallery: (providerId: string) => Promise<void>;
  uploadGalleryImages: (providerId: string, files: File[]) => Promise<void>;
  replaceGalleryImage: (providerId: string, index: number, newImage: File) => Promise<void>;
  deleteGalleryImage: (providerId: string, index: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ProviderGalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const useProviderGallery = (): GalleryContextType => {
  const context = useContext(ProviderGalleryContext);
  if (!context) throw new Error("useProviderGallery must be used within ProviderGalleryProvider");
  return context;
};

export const ProviderGalleryProvider = ({ children }: { children: React.ReactNode }) => {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = "https://api.fetchtrue.com/api/provider";

  const fetchGallery = async (providerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/${providerId}/gallery`);
      setGalleryImages(res.data.galleryImages || []);
   } catch (err: unknown) {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosError = err as { response?: { data?: { message?: string } } };
    setError(axiosError.response?.data?.message || "Failed to fetch gallery");
  } else {
    setError("Failed to fetch gallery");
  }
}
finally {
      setLoading(false);
    }
  };

  const uploadGalleryImages = async (providerId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append("galleryImages", file));

    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch(`${BASE_URL}/${providerId}/gallery`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setGalleryImages(res.data.data);
    } catch (err: unknown) {
  if (err instanceof Error && 'response' in err) {
    const axiosError = err as { response?: { data?: { message?: string } } };
    setError(axiosError.response?.data?.message || "Upload failed");
  } else {
    setError("Upload failed");
  }
} finally {
      setLoading(false);
    }
  };

  const replaceGalleryImage = async (providerId: string, index: number, newImage: File) => {
    const formData = new FormData();
    formData.append("newImage", newImage);

    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch(`${BASE_URL}/${providerId}/gallery/${index}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setGalleryImages(res.data.updatedImages);
    } catch (err: unknown) {
  const error = err as { response?: { data?: { message?: string } } };
  setError(error?.response?.data?.message || "Replace failed");
}
finally {
      setLoading(false);
    }
  };

  const deleteGalleryImage = async (providerId: string, index: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.delete(`${BASE_URL}/${providerId}/gallery/${index}`);
      setGalleryImages(res.data.updatedImages);
    } catch (err: unknown) {
  const error = err as { response?: { data?: { message?: string } } };
  setError(error?.response?.data?.message || "Delete failed");
}
 finally {
      setLoading(false);
    }
  };

  return (
    <ProviderGalleryContext.Provider
      value={{
        galleryImages,
        fetchGallery,
        uploadGalleryImages,
        replaceGalleryImage,
        deleteGalleryImage,
        loading,
        error,
      }}
    >
      {children}
    </ProviderGalleryContext.Provider>
  );
};
