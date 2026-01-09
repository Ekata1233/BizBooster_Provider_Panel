'use client';

import React, { useState, useRef } from 'react';
import { useProviderGallery } from '@/app/context/ProviderGalleryContext';
import { useAuth } from '@/app/context/AuthContext';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import axios from 'axios';

const AddGalleryImage = () => {
  const { uploadGalleryImages, fetchGallery, loading, error } = useProviderGallery();
  const { providerDetails } = useAuth();
  const providerId = providerDetails?._id;

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // ref to reset file input

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!providerId || !selectedFiles) return;

    const filesArray = Array.from(selectedFiles);
    try {
      await uploadGalleryImages(providerId, filesArray);
      await fetchGallery(providerId);
      alert("Images uploaded successfully ✅");

      // ✅ Clear file input
      setSelectedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
    if (axios.isAxiosError(err)) {
    if (err.code === "ERR_NETWORK") {
      alert(
        "Upload failed: Images exceed the allowed file size."
      );
      return;
    }
    if (err.response?.status === 413) {
      alert(
        "Upload failed: Images exceed the allowed file size."
      );
      return;
    }
  }
  alert("Upload failed: Images exceed the allowed file size.");
}
  };

  return (
    <div>
      <PageBreadCrumb pageTitle="Add Gallery" />

      <ComponentCard title="Upload Gallery Images">


        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm  hover:file:bg-blue-100 my-3"
        />



        <button
          onClick={handleUpload}
          disabled={loading || !selectedFiles}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {error && (
          <p className="mt-2 text-sm text-red-500">Error: {error}</p>
        )}
      </ComponentCard>
    </div>

  );
};

export default AddGalleryImage;
