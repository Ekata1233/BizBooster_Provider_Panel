'use client';

import React, { useState, useRef } from 'react';
import { useProviderGallery } from '@/app/context/ProviderGalleryContext';
import { useAuth } from '@/app/context/AuthContext';

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
      alert("Upload failed ❌");
      console.log(err);
      
    }
  };

  return (
    <div className="my-6 p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2">Upload Gallery Images</h2>

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
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-500">Error: {error}</p>
      )}
    </div>
  );
};

export default AddGalleryImage;
