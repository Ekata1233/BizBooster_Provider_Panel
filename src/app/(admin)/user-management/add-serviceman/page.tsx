"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useServiceMan } from "@/app/context/ServiceManContext";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import FileInput from "@/components/form/input/FileInput";
import { useAuth } from "@/app/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

const identityOptions = [
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
  { value: "addharcard", label: "AddarCard" },
  { value: "pancard", label: "PanCard" },
];

export default function AddServiceManPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const { provider } = useAuth();
  console.log("provider details : ", provider)
  const providerId = provider?._id;
  const { addServiceMan, loading, error } = useServiceMan();
  console.log(providerId);

  const [formState, setFormState] = useState({
    name: "",
    lastName: "",
    phoneNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    identityType: "",
    identityNumber: "",
  });

  const [generalImageFile, setGeneralImageFile] = useState<File | null>(null);
  const [identityImageFile, setIdentityImageFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeneralImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setGeneralImageFile(file);
  };

  const handleIdentityImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setIdentityImageFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError(null);


    const formData = new FormData();
    const completeFormState = {
      ...formState,
      provider: provider?._id || "",
    };

    Object.entries(completeFormState).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (generalImageFile) formData.append("generalImage", generalImageFile);
    if (identityImageFile) formData.append("identityImage", identityImageFile);

    await addServiceMan(formData);
    window.alert("Serviceman added successfully!");

    setFormState({
      name: "",
      lastName: "",
      phoneNo: "",
      email: "",
      password: "",
      confirmPassword: "",
      identityType: "",
      identityNumber: "",
    });
    setGeneralImageFile(null);
    setIdentityImageFile(null);
  };

  const validateForm = () => {
    const { name, lastName, phoneNo, email, password, confirmPassword, identityType, identityNumber } = formState;

    if (!name.trim()) return "First Name is required";
    if (!lastName.trim()) return "Last Name is required";
    if (!phoneNo.trim() || !/^\d{10}$/.test(phoneNo)) return "Enter a valid 10-digit phone number";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    if (!identityType) return "Select an identity type";
    if (!identityNumber.trim()) return "Identity number is required";
    if (!generalImageFile) return "Upload general image";
    if (!identityImageFile) return "Upload identity image";

    return null; // no errors
  };


  return (
    <div>
      <PageBreadcrumb pageTitle="Add Serviceman" />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl "
        encType="multipart/form-data"
      >
        <ComponentCard title="Account Details">

          {/* Section 1: Basic Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">1. Basic Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <Input
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="First Name"
                required
                className="border px-3 py-2 rounded w-full"
              />
              <Input
                name="lastName"
                value={formState.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
                className="border px-3 py-2 rounded w-full"
              />
              <Input
                name="phoneNo"
                value={formState.phoneNo}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="border px-3 py-2 rounded w-full"
              />
              <FileInput
                onChange={handleGeneralImageChange}
                className="custom-class"
              />
            </div>
          </div>

          {/* Section 2: Business Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">2. Business Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <select
                name="identityType"
                value={formState.identityType}
                onChange={handleChange}
                required
                className="border px-3 py-2 rounded w-full text-gray-500"
              >
                <option value="">Select Identity Type</option>
                {identityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <Input
                name="identityNumber"
                value={formState.identityNumber}
                onChange={handleChange}
                placeholder="Identity Number"
                required
                className="border px-3 py-2 rounded w-full"
              />
              <FileInput
                onChange={handleIdentityImageChange}
                className="custom-class"
              />
            </div>
          </div>

          {/* Section 3: Account Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">3. Account Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <Input
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="border px-3 py-2 rounded w-full"
              />
              <Input
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="border px-3 py-2 rounded w-full"
              />
              <Input
                name="confirmPassword"
                type="password"
                value={formState.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="border px-3 py-2 rounded w-full"
              />
            </div>
          </div>

          <Button

            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
          {formError && <p className="text-red-600 text-sm mt-2 text-center">{formError}</p>}


          {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
        </ComponentCard>

      </form>
    </div>
  );
}
