"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

export default function EditProfilePage() {
  const { providerDetails, refreshProviderDetails } = useAuth();
  const countries = [{ code: "IN", label: "+91" }];

  // Personal info
  const [fullName, setFullName] = useState(providerDetails?.fullName || "");
  const [phoneNo, setPhoneNo] = useState(providerDetails?.phoneNo || "");

  // Store info
  const [storeName, setStoreName] = useState(providerDetails?.storeInfo?.storeName || "");
  const [storeEmail, setStoreEmail] = useState(providerDetails?.storeInfo?.storeEmail || "");
  const [storePhone, setStorePhone] = useState(providerDetails?.storeInfo?.storePhone || "");
  const [address, setAddress] = useState(providerDetails?.storeInfo?.address || "");
  const [city, setCity] = useState(providerDetails?.storeInfo?.city || "");
  const [state, setState] = useState(providerDetails?.storeInfo?.state || "");
  const [country, setCountry] = useState(providerDetails?.storeInfo?.country || "");
  
  const [logo, setLogo] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(providerDetails?.storeInfo?.logo || "");
  const [coverPreview, setCoverPreview] = useState<string>(providerDetails?.storeInfo?.cover || "");

  // Gallery & KYC
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(providerDetails?.galleryImages || []);

  const [kycDocs, setKycDocs] = useState<{ [key: string]: File[] }>({
    aadhaarCard: [],
    panCard: [],
    storeDocument: [],
    GST: [],
    other: [],
  });
  const [kycPreviews, setKycPreviews] = useState<{ [key: string]: string[] }>({
    aadhaarCard: providerDetails?.kyc?.aadhaarCard || [],
    panCard: providerDetails?.kyc?.panCard || [],
    storeDocument: providerDetails?.kyc?.storeDocument || [],
    GST: providerDetails?.kyc?.GST || [],
    other: providerDetails?.kyc?.other || [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (providerDetails) {
      setFullName(providerDetails.fullName || "");
      setPhoneNo(providerDetails.phoneNo || "");
      setStoreName(providerDetails.storeInfo?.storeName || "");
      setStoreEmail(providerDetails.storeInfo?.storeEmail || "");
      setStorePhone(providerDetails.storeInfo?.storePhone || "");
      setAddress(providerDetails.storeInfo?.address || "");
      setCity(providerDetails.storeInfo?.city || "");
      setState(providerDetails.storeInfo?.state || "");
      setCountry(providerDetails.storeInfo?.country || "");
      setLogoPreview(providerDetails.storeInfo?.logo || "");
      setCoverPreview(providerDetails.storeInfo?.cover || "");
      setGalleryPreviews(providerDetails.galleryImages || []);
      setKycPreviews({
        aadhaarCard: providerDetails.kyc?.aadhaarCard || [],
        panCard: providerDetails.kyc?.panCard || [],
        storeDocument: providerDetails.kyc?.storeDocument || [],
        GST: providerDetails.kyc?.GST || [],
        other: providerDetails.kyc?.other || [],
      });
    }
  }, [providerDetails]);

  // Single file handler (logo/cover)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: Function, previewSetter?: Function) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setter(file);
    if (previewSetter && file) previewSetter(URL.createObjectURL(file));
  };

  // Gallery handler (multiple files)
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setGalleryImages((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  // KYC handler
  const handleKycChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setKycDocs((prev) => ({ ...prev, [key]: [...prev[key], ...files] }));
    setKycPreviews((prev) => ({
      ...prev,
      [key]: [...prev[key], ...files.map((file) => URL.createObjectURL(file))],
    }));
  };

  // Validation
  const validate = () => {
    if (!fullName.trim()) return "Full Name is required.";
    if (!phoneNo.trim() || !/^\d{10}$/.test(phoneNo)) return "Enter a valid 10-digit phone number.";
    if (!storeName.trim()) return "Store Name is required.";
    if (!address.trim()) return "Address is required.";
    if (!city.trim()) return "City is required.";
    if (!state.trim()) return "State is required.";
    if (!country.trim()) return "Country is required.";
    if (storeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeEmail)) return "Enter a valid store email.";
    if (storePhone && !/^\d{10}$/.test(storePhone)) return "Enter a valid store phone.";
    return "";
  };

  // Update handler
  const handleUpdate = async () => {
    setError("");
    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("fullName", fullName);
      formData.append("phoneNo", phoneNo);

      formData.append("storeInfo.storeName", storeName);
      formData.append("storeInfo.storeEmail", storeEmail);
      formData.append("storeInfo.storePhone", storePhone);
      formData.append("storeInfo.address", address);
      formData.append("storeInfo.city", city);
      formData.append("storeInfo.state", state);
      formData.append("storeInfo.country", country);

      if (logo) formData.append("logo", logo);
      if (cover) formData.append("cover", cover);

      galleryImages.forEach((file) => formData.append("galleryImages", file));

      Object.keys(kycDocs).forEach((key) => {
        kycDocs[key].forEach((file) => formData.append(key, file));
      });

      const response = await fetch(`https://api.fetchtrue.com/api/provider/edit-profile/${providerDetails?._id}`, { method: "PUT", body: formData });
      const data = await response.json();

      if (response.ok && data.success) {
        alert("Profile updated successfully!");
        await refreshProviderDetails();
      } else {
        setError(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Profile" />
      {error && <p className="text-red-500 m-4">{error}</p>}
      <div className="space-y-6 m-4">

        <ComponentCard title="Personal Information">
          <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input placeholder="Phone" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
        </ComponentCard>

        <ComponentCard title="Store Information">
          <Input placeholder="Store Name" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          <Input placeholder="Store Email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} />
          <Input placeholder="Store Phone" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
          <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="border p-2 rounded w-full">
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.code} ({c.label})</option>
            ))}
          </select>

          <div>
            <Label>Logo</Label>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setLogo, setLogoPreview)} />
            {logoPreview && <img src={logoPreview} alt="Logo" className="h-16 mt-2 border rounded" />}
          </div>

          <div>
            <Label>Cover</Label>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setCover, setCoverPreview)} />
            {coverPreview && <img src={coverPreview} alt="Cover" className="h-24 mt-2 border rounded" />}
          </div>

          <div>
            <Label>Gallery Images</Label>
            <input type="file" accept="image/*" multiple onChange={handleGalleryChange} />
            <div className="flex flex-wrap gap-2 mt-2">
              {galleryPreviews.map((img, idx) => (
                <img key={idx} src={img} alt={`Gallery ${idx}`} className="h-16 border rounded" />
              ))}
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="KYC Documents">
          {["aadhaarCard", "panCard", "storeDocument", "GST", "other"].map((key) => (
            <div key={key} className="mb-4">
              <Label>{key}</Label>
              <input type="file" multiple onChange={(e) => handleKycChange(e, key)} />
              <div className="flex flex-wrap gap-2 mt-2">
                {kycPreviews[key].map((file, idx) => (
                  <img key={idx} src={file} alt={`${key} ${idx}`} className="h-16 border rounded" />
                ))}
              </div>
            </div>
          ))}
        </ComponentCard>

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`px-6 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
