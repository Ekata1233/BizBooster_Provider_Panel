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

const identityOptions = [
   { value: "addharcard", label: "Aadhaar Card" },
  { value: "pancard", label: "PAN Card" },
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
];

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

  const [errors, setErrors] = useState({
    name: '',
    lastName: '',
    phoneNo: '',
    email: '',
    identityType: '',
    identityNumber: '',
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

const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
    ...(name === 'identityType' && value === ''
      ? { identityNumber: '' }
      : {}),
  }));

  setErrors((prev) => ({ ...prev, [name]: '' }));
};


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {
      name: '',
      lastName: '',
      phoneNo: '',
      email: '',
      identityType: '',
      identityNumber: '',
    };
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = 'First Name is required';
      isValid = false;
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'First Name should be at least 2 characters';
      isValid = false;
    }
     if (!form.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    } else if (form.lastName.trim().length < 2) {
      newErrors.lastName = 'Last Name should be at least 2 characters';
      isValid = false;
    }

    //phone
    const phoneRegex = /^[0-9]{10}$/;
    if (!form.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone Number is required';
      isValid = false;
    } else if (!phoneRegex.test(form.phoneNo)) {
      newErrors.phoneNo = 'Phone Number must be 10 digits and numeric';
      isValid = false;
    }
    
    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    
     // Identity fields rules
    if ((form.identityType && !form.identityNumber) || (!form.identityType && form.identityNumber)) {
      if (!form.identityType) newErrors.identityType = 'Identity Type is required when Identity Number is filled';
      if (!form.identityNumber) newErrors.identityNumber = 'Identity Number is required when Identity Type is filled';
      isValid = false;
    }

    // Identity Type (if filled - alphabets only)
// Identity Type + Identity Number dependency
if (
  (form.identityType && !form.identityNumber) ||
  (!form.identityType && form.identityNumber)
) {
  if (!form.identityType)
    newErrors.identityType = 'Identity Type is required when Identity Number is filled';

  if (!form.identityNumber)
    newErrors.identityNumber = 'Identity Number is required when Identity Type is filled';

  isValid = false;
}

// Identity Number length
if (form.identityNumber && form.identityNumber.length < 4) {
  newErrors.identityNumber = 'Identity Number must be at least 4 characters';
  isValid = false;
}


    // Identity Number (if filled)
    if (form.identityNumber && form.identityNumber.length < 4) {
      newErrors.identityNumber = 'Identity Number must be at least 4 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleSubmit = async () => {
    if (!id) return;
    if (!validate()) return;

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('lastName', form.lastName);
    formData.append('phoneNo', form.phoneNo);
    formData.append('email', form.email);
    formData.append('businessInformation.identityType', form.identityType);
    formData.append('businessInformation.identityNumber', form.identityNumber);
    if (form.generalImage) formData.append('generalImage', form.generalImage);
    if (form.identityImage) formData.append('identityImage', form.identityImage);

    // updateServiceMan now returns ApiResponse
    const resp = await updateServiceMan(id as string, formData);

    if (!resp) {
      alert('Update failed: No response from server');
      return;
    }

    if (!resp.status || resp.status >= 400) {
      // show server-provided error message (specific duplicate or validation)
      alert(`Update failed: ${resp.message || 'Unknown error'}`);
      return;
    }

    // success
    alert(resp.message || 'ServiceMan updated successfully!');
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
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
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
          {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
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
          {errors.phoneNo && <p className="text-red-600 text-sm mt-1">{errors.phoneNo}</p>}
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
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Identity Type */}
        {/* Identity Type */}
<div>
  <label className="block mb-1 font-medium">Identity Type</label>
  <select
    name="identityType"
    value={form.identityType}
    onChange={handleInputChange}
    className="border px-3 py-2 rounded w-full"
  >
    <option value="">Select Identity Type</option>
    {identityOptions.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>

  {errors.identityType && (
    <p className="text-red-600 text-sm mt-1">{errors.identityType}</p>
  )}
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
          {errors.identityNumber && <p className="text-red-600 text-sm mt-1">{errors.identityNumber}</p>}
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
