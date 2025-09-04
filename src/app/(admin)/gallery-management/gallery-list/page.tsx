'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useProviderGallery } from '@/app/context/ProviderGalleryContext';
import { useAuth } from '@/app/context/AuthContext';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';

const Page = () => {
  const {
    galleryImages,
    fetchGallery,
    
    replaceGalleryImage,
    deleteGalleryImage,
    loading,
    error,
  } = useProviderGallery();

  const { providerDetails } = useAuth();
  const providerId = providerDetails?._id;

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (providerId) {
      fetchGallery(providerId);
    }
  }, [providerId]);

  const handleFileChange = async (index: number) => {
    const fileInput = fileInputRefs.current[index];
    const file = fileInput?.files?.[0];
    if (!file || !providerId) return;

    await replaceGalleryImage(providerId, index, file);
    alert('Image replaced successfully!');
    if (fileInput) fileInput.value = '';
    fetchGallery(providerId);
  };

  const handleReplaceClick = (index: number) => {
    const fileInput = fileInputRefs.current[index];
    fileInput?.click();
  };

  const handleDelete = async (index: number) => {
    if (!providerId) return;
    const confirmDelete = confirm('Are you sure you want to delete this image?');
    if (!confirmDelete) return;

    await deleteGalleryImage(providerId, index);
    alert('Image deleted successfully!');
    fetchGallery(providerId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
            <PageBreadcrumb pageTitle="Gallery List" />

      <ComponentCard title="Gallery Images">
      <div className="grid grid-cols-3 gap-6">
        {galleryImages.map((imgUrl, index) => (
          <div key={index} className="border p-3 rounded shadow flex flex-col justify-between">
            <img
              src={imgUrl}
              alt={`Gallery ${index}`}
              className="w-full h-40 object-cover rounded cursor-pointer"
              onClick={() => setSelectedImage(imgUrl)}
            />

            {/* Hidden File Input */}
           <input
  type="file"
  accept="image/*"
ref={(el) => {
  fileInputRefs.current[index] = el;
}}
  className="hidden"
  onChange={() => handleFileChange(index)}
/>



            {/* Button Container at Bottom */}
            <div className="mt-3 flex justify-between">
              <button
                onClick={() => handleReplaceClick(index)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
              >
                Replace
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full View"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
      </ComponentCard>
    </div>
  );
};

export default Page;
