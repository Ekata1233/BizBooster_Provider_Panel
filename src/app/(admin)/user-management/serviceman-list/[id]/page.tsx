'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useServiceMan } from '@/app/context/ServiceManContext';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Input from '@/components/form/input/InputField';

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
  { value: "aadharcard", label: "Aadhaar Card" },
  { value: "pancard", label: "PAN Card" },
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
];

export default function UpdateServiceManPage() {
  const { id } = useParams();
  const router = useRouter();
  const { updateServiceMan, serviceMenByProvider } = useServiceMan();

  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    lastName: '',
    phoneNo: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    password: '',
    confirmPassword: '',
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
        password: '',
        confirmPassword: '',
        identityType: man.businessInformation?.identityType || '',
        identityNumber: man.businessInformation?.identityNumber || '',
        generalImage: null,
        identityImage: null,
      });
    }
  }, [serviceMenByProvider, id]);

  // ✅ Reusable validation for identity (from AddServiceManPage)
  const validateIdentityNumber = (type: string, number: string): string => {
    if (!number.trim()) {
      return "Identity number is required";
    }

    switch (type) {
      case "passport":
        if (!/^[A-PR-WYa-pr-wy][1-9]\d{6}$/.test(number)) {
          return "Enter a valid Passport number (e.g., A1234567)";
        }
        break;
      case "driving_license":
        if (!/^[A-Z]{2}\d{13}$/.test(number)) {
          return "Enter a valid Driving License number (e.g., MH1420111234567)";
        }
        break;
      case "aadharcard":
        if (!/^\d{12}$/.test(number)) {
          return "Enter a valid 12-digit Aadhaar number";
        }
        break;
      case "pancard":
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(number)) {
          return "Enter a valid PAN number (e.g., ABCDE1234F)";
        }
        break;
      default:
        return "";
    }

    return "";
  };

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

    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setFormError(null);

    // Validate identity number in real-time
    if (name === "identityNumber") {
      const error = validateIdentityNumber(form.identityType, value);
      setErrors((prev) => ({ ...prev, identityNumber: error }));
    }

    if (name === "identityType") {
      const error = validateIdentityNumber(value, form.identityNumber);
      setErrors((prev) => ({ ...prev, identityNumber: error }));
    }

    // Validate name and lastName for alphabets only
    if (name === "name" && value.trim() && !/^[A-Za-z]+$/.test(value.trim())) {
      setErrors((prev) => ({ ...prev, name: 'Name must contain only alphabetic characters' }));
    }

    if (name === "lastName" && value.trim() && !/^[A-Za-z]+$/.test(value.trim())) {
      setErrors((prev) => ({ ...prev, lastName: 'Last name must contain only alphabetic characters' }));
    }

    // Validate phone number in real-time
    if (name === "phoneNo" && value.trim() && !/^\d{10}$/.test(value)) {
      setErrors((prev) => ({ ...prev, phoneNo: 'Phone number must be 10 digits' }));
    }

    // Validate email in real-time
    if (name === "email" && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
    }

    // Validate password match in real-time
    if (name === "confirmPassword" && form.password && value !== form.password) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    }
    if (name === "password" && form.confirmPassword && value !== form.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // ✅ Main validation function
  const validate = () => {
    const newErrors = {
      name: '',
      lastName: '',
      phoneNo: '',
      email: '',
      password: '',
      confirmPassword: '',
      identityType: '',
      identityNumber: '',
    };
    let isValid = true;

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = 'First Name is required';
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(form.name.trim())) {
      newErrors.name = 'Name must contain only alphabetic characters';
      isValid = false;
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'First Name should be at least 2 characters';
      isValid = false;
    } else if (form.name.trim().length > 30) {
      newErrors.name = 'First Name should not exceed 30 characters';
      isValid = false;
    }

    // Last Name validation
    if (!form.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(form.lastName.trim())) {
      newErrors.lastName = 'Last Name must contain only alphabetic characters';
      isValid = false;
    } else if (form.lastName.trim().length < 2) {
      newErrors.lastName = 'Last Name should be at least 2 characters';
      isValid = false;
    } else if (form.lastName.trim().length > 30) {
      newErrors.lastName = 'Last Name should not exceed 30 characters';
      isValid = false;
    }

    // Phone validation
    if (!form.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone Number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(form.phoneNo)) {
      newErrors.phoneNo = 'Phone number must be 10 digits';
      isValid = false;
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Password validation (only if changing password)
    if (form.password) {
      if (form.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        isValid = false;
      }
      
      if (!form.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    // Identity validation
    if (form.identityType && !form.identityNumber) {
      newErrors.identityNumber = 'Identity number is required when identity type is selected';
      isValid = false;
    } else if (!form.identityType && form.identityNumber) {
      newErrors.identityType = 'Identity type is required when identity number is entered';
      isValid = false;
    } else if (form.identityType && form.identityNumber) {
      const identityError = validateIdentityNumber(form.identityType, form.identityNumber);
      if (identityError) {
        newErrors.identityNumber = identityError;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!id) return;
    
    // Validate form
    if (!validate()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find(key => errors[key as keyof typeof errors]);
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      return;
    }
    
    // Additional validation for identity dependency
    if ((form.identityType && !form.identityNumber) || (!form.identityType && form.identityNumber)) {
      setFormError('Both identity type and number must be provided together');
      return;
    }
    
    setFormError(null);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('lastName', form.lastName);
    formData.append('phoneNo', form.phoneNo);
    formData.append('email', form.email);
    
    if (form.identityType && form.identityNumber) {
      formData.append('businessInformation.identityType', form.identityType);
      formData.append('businessInformation.identityNumber', form.identityNumber);
    }
    
    // Only append password if it's being changed
    if (form.password) {
      formData.append('password', form.password);
    }
    
    if (form.generalImage) formData.append('generalImage', form.generalImage);
    if (form.identityImage) formData.append('identityImage', form.identityImage);

    const resp = await updateServiceMan(id as string, formData);

    if (!resp) {
      alert('Update failed: No response from server');
      return;
    }

    if (!resp.status || resp.status >= 400) {
      // Show specific error messages
      const msg = resp?.message?.toLowerCase() || "";
      
      if (msg.includes("email")) {
        setErrors(prev => ({ ...prev, email: "Email already exists" }));
        document.querySelector('[name="email"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (msg.includes("phone")) {
        setErrors(prev => ({ ...prev, phoneNo: "Phone number already exists" }));
        document.querySelector('[name="phoneNo"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (msg.includes("name must contain only alphabetic")) {
        setErrors(prev => ({ ...prev, name: "Name must contain only alphabetic characters" }));
        document.querySelector('[name="name"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (msg.includes("last name must contain only alphabetic")) {
        setErrors(prev => ({ ...prev, lastName: "Last name must contain only alphabetic characters" }));
        document.querySelector('[name="lastName"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (msg.includes("identitynumber already exists")) {
        setErrors(prev => ({ ...prev, identityNumber: "Identity number already exists" }));
        document.querySelector('[name="identityNumber"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (msg.includes("identitytype")) {
        setErrors(prev => ({ ...prev, identityType: "Invalid identity type selected" }));
        document.querySelector('[name="identityType"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setFormError(resp?.message || "Failed to update serviceman");
      }
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
            minLength={2}
            maxLength={30}
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
            minLength={2}
            maxLength={30}
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
            pattern="^\d{10}$"
            title="Enter a valid 10-digit phone number"
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

        {/* Password (Optional - for change) */}
        <div>
          <label className="block mb-1 font-medium">New Password (Leave empty to keep current)</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleInputChange}
              className="w-full border p-2 rounded pr-10"
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleInputChange}
              className="w-full border p-2 rounded pr-10"
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirm ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

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
            minLength={6}
            maxLength={20}
          />
          {errors.identityNumber && (
            <p className="text-red-600 text-sm mt-1">{errors.identityNumber}</p>
          )}
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

      {/* Form Error Display (for general errors only) */}
      {formError && (
        <p className="text-red-600 text-sm mt-4 text-center">{formError}</p>
      )}

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