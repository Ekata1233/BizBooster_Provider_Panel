'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useServiceMan } from '@/app/context/ServiceManContext';

type ServiceMan = {
  _id: string;
  name: string;
  lastName: string;
  phoneNo: string;
  email: string;
  generalImage?: string;
  businessInformation?: {
    identityType?: string;
    identityNumber?: string;
    identityImage?: string;
  };
};


export default function UpdateServiceManPage() {
  const { id } = useParams();
  const router = useRouter();
  const { updateServiceMan, serviceMenByProvider } = useServiceMan();

  const [form, setForm] = useState({
    name: '',
    lastName: '',
    phoneNo: '',
    email: '',
    identityType: '',
    identityNumber: '',
    generalImage: null as File | null,
    identityImage: null as File | null,
  });

  const [existingData, setExistingData] = useState<ServiceMan | null>(null);


  useEffect(() => {
    if (serviceMenByProvider.length === 0) return;
    const man = serviceMenByProvider.find((m) => m._id === id);
    if (man) {
      setExistingData(man);
      setForm({
        name: man.name || '',
        lastName: man.lastName || '',
        phoneNo: man.phoneNo || '',
        email: man.email || '',
        identityType: man.businessInformation?.identityType || '',
        identityNumber: man.businessInformation?.identityNumber || '',
        generalImage: null,
        identityImage: null,
      });
    }
  }, [serviceMenByProvider, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async () => {
    if (!id) return;
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('lastName', form.lastName);
    formData.append('phoneNo', form.phoneNo);
    formData.append('email', form.email);
    formData.append('businessInformation.identityType', form.identityType);
    formData.append('businessInformation.identityNumber', form.identityNumber);
    if (form.generalImage) formData.append('generalImage', form.generalImage);
    if (form.identityImage) formData.append('identityImage', form.identityImage);

    await updateServiceMan(id as string, formData);
    alert('ServiceMan updated successfully!');
    router.push('/user-management/serviceman-list');
  };

  if (!existingData) {
    return <div className="p-6 text-gray-600">Loading ServiceMan data…</div>;
  }

  return (
    <div className="w-full px-6 py-8">
      <h1 className="text-3xl font-semibold mb-8">Update ServiceMan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="text"
            name="phoneNo"
            value={form.phoneNo}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Identity Type */}
        <div>
          <label className="block mb-1 font-medium">Identity Type</label>
          <input
            type="text"
            name="identityType"
            value={form.identityType}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Identity Number */}
        <div>
          <label className="block mb-1 font-medium">Identity Number</label>
          <input
            type="text"
            name="identityNumber"
            value={form.identityNumber}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* General Image */}
        <div>
          <label className="block mb-1 font-medium">General Image</label>
          <input
            type="file"
            name="generalImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {existingData.generalImage && (
            <img
              src={existingData.generalImage}
              alt="General"
              className="mt-2 w-32 h-32 object-cover rounded border"
            />
          )}
        </div>

        {/* Identity Image */}
        <div>
          <label className="block mb-1 font-medium">Identity Image</label>
          <input
            type="file"
            name="identityImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {existingData.businessInformation?.identityImage && (
            <img
              src={existingData.businessInformation.identityImage}
              alt="Identity"
              className="mt-2 w-32 h-32 object-cover rounded border"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update
        </button>
      </div>
    </div>
  );
}
