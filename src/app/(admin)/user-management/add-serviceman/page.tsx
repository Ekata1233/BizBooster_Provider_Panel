"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useServiceMan } from "@/app/context/ServiceManContext";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import FileInput from "@/components/form/input/FileInput";
import { useAuth } from "@/app/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const identityOptions = [
   { value: "addharcard", label: "Aadhaar Card" },
  { value: "pancard", label: "PAN Card" },
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
];

export default function AddServiceManPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [identityError, setIdentityError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { provider } = useAuth();
  // const providerId = provider?._id;
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));

    if (name === "identityNumber") {
      validateIdentityNumber(formState.identityType, value);
    }

    if (name === "identityType") {
      // Reset identity error when type changes
      validateIdentityNumber(value, formState.identityNumber);
    }
  };

  const handleGeneralImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setGeneralImageFile(file);
  };

  const handleIdentityImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setIdentityImageFile(file);
  };

  // ✅ Reusable validation for identity
  const validateIdentityNumber = (type: string, number: string) => {
    if (!number.trim()) {
      setIdentityError("Identity number is required");
      return false;
    }

    switch (type) {
      case "passport":
        if (!/^[A-PR-WYa-pr-wy][1-9]\d{6}$/.test(number)) {
          setIdentityError("Enter a valid Passport number (e.g., A1234567)");
          return false;
        }
        break;
      case "driving_license":
        if (!/^[A-Z]{2}\d{13}$/.test(number)) {
          setIdentityError(
            "Enter a valid Driving License number (e.g., MH1420111234567)"
          );
          return false;
        }
        break;
      case "addharcard":
        if (!/^\d{12}$/.test(number)) {
          setIdentityError("Enter a valid 12-digit Aadhaar number");
          return false;
        }
        break;
      case "pancard":
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(number)) {
          setIdentityError("Enter a valid PAN number (e.g., ABCDE1234F)");
          return false;
        }
        break;
      default:
        setIdentityError(null);
        return true;
    }

    setIdentityError(null);
    return true;
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

    try {
      const response = await addServiceMan(formData);

      // success
      if (response?.status === 200 || response?.status === 201) {
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
        return;
      }

     const msg = response?.message?.toLowerCase() || "";

  if (msg.includes("email")) {
    window.alert("email already exists");
  } else if (msg.includes("phone")) {
    window.alert("phoneNo already exists");
  } else if (msg.includes("identity")) {
    window.alert("identityNumber already exists");
  } else {
    window.alert(response?.message || "Failed to add serviceman");
  }

} catch (e) {
  const errorText = (e instanceof Error && e.message) ? e.message.toLowerCase() : "";

  if (errorText.includes("email")) {
    window.alert("email already exists");
  } else if (errorText.includes("phone")) {
    window.alert("phoneNo already exists");
  } else if (errorText.includes("identity")) {
    window.alert("identityNumber already exists");
  } else {
    window.alert("Something went wrong. Try again.");
  }
}
  }
  const validateForm = () => {
    const {
      name,
      lastName,
      phoneNo,
      email,
      password,
      confirmPassword,
      identityType,
      identityNumber,
    } = formState;

    if (!name.trim()) return "First Name is required";
    if (!lastName.trim()) return "Last Name is required";
    if (!phoneNo.trim() || !/^\d{10}$/.test(phoneNo))
      return "Enter a valid 10-digit phone number";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    if (!identityType) return "Select an identity type";

    // Check identity again before submit
    if (!validateIdentityNumber(identityType, identityNumber)) {
      return identityError || "Invalid identity number";
    }

    if (!generalImageFile) return "Upload general image";
    if (!identityImageFile) return "Upload identity image";

    return null;
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add Serviceman" />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl "
        encType="multipart/form-data"
      >
        <ComponentCard title="Serviceman Details">
          {/* Section 1: Basic Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              1. Basic Details
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <Input
                name="name"
                type="text"
                value={formState.name}
                onChange={handleChange}
                placeholder="First Name"
                required
                minLength={2}
                maxLength={30}
                className="border px-3 py-2 rounded w-full"
              />
              <Input
                name="lastName"
                type="text"
                value={formState.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
                minLength={2}
                maxLength={30}
                className="border px-3 py-2 rounded w-full"
              />
              <Input
                name="phoneNo"
                type="tel"
                value={formState.phoneNo}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                pattern="^\d{10}$"
                title="Enter a valid 10-digit phone number"
                className="border px-3 py-2 rounded w-full"
              />
              <FileInput onChange={handleGeneralImageChange} className="custom-class" />
            </div>
          </div>

          {/* Section 2: Business Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              2. Business Details
            </h3>
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

              <div>
                <Input
                  name="identityNumber"
                  type="text"
                  value={formState.identityNumber}
                  onChange={handleChange}
                  placeholder="Identity Number"
                  required
                  minLength={6}
                  maxLength={20}
                  className="border px-3 py-2 rounded w-full"
                />
                {identityError && (
                  <p className="text-red-600 text-sm mt-1">{identityError}</p>
                )}
              </div>

              <FileInput
                onChange={handleIdentityImageChange}
                className="custom-class"
              />
            </div>
          </div>

          {/* Section 3: Account Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              3. Account Details
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Email */}
              <Input
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="border px-3 py-2 rounded w-full"
              />

              {/* Password */}
              <div className="relative w-full">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  minLength={6}
                  className="border px-3 py-2 rounded w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative w-full">
                <Input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={formState.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                  minLength={6}
                  className="border px-3 py-2 rounded w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirm ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>

          {formError && (
            <p className="text-red-600 text-sm mt-2 text-center">{formError}</p>
          )}
          {error && (
            <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
          )}
        </ComponentCard>
      </form>
    </div>
  );
}
