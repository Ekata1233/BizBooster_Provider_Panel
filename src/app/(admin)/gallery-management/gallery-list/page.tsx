'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useProviderGallery } from '@/app/context/ProviderGalleryContext';
import { useAuth } from '@/app/context/AuthContext';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
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
      <PageBreadCrumb pageTitle="Gallery List" />

      <ComponentCard title="Gallery Images">
        <div className="grid grid-cols-3 gap-6">
          {galleryImages && galleryImages.length > 0 ? (
            galleryImages.map((imgUrl, index) => (
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
            ))
          ) : (
            <div className="col-span-3 flex flex-col items-center justify-center py-20 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 mb-4 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-9-9v12m0 0L8.25 13.5m3.75 5.25L15.75 13.5"
                />
              </svg>
              <h3 className="text-lg font-semibold mb-1">No Gallery Images Found</h3>
              <p className="text-sm text-gray-500 text-center">
                You haven’t uploaded any images yet. Start adding to your gallery!
              </p>
            </div>
          )}
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
