"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useServiceMan } from "@/app/context/ServiceManContext";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import FileInput from "@/components/form/input/FileInput";
import { useAuth } from "@/app/context/AuthContext";

const identityOptions = [
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
  { value: "nid", label: "NID" },
  { value: "trade_license", label: "Trade License" },
];

export default function AddServiceManPage() {
  const { provider } = useAuth();
  console.log("provider details : ", provider)
  const providerId = provider?._id;
  const { addServiceMan, loading, error } = useServiceMan();

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

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-8 space-y-10"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-center">Add Serviceman</h2>

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

        {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
      </form>
    </div>
  );
}
