
// "use client";

// import React, { useEffect, useState } from "react";
// import { useAuth } from "@/app/context/AuthContext";
// import ComponentCard from "@/components/common/ComponentCard";
// import PageBreadCrumb from "@/components/common/PageBreadCrumb";
// import Label from "@/components/form/Label";
// import Input from "@/components/form/input/InputField";
// import { useRouter } from "next/navigation";
// import FileInput from "@/components/form/input/FileInput";

// // console.log({
// //   ComponentCard,
// //   PageBreadCrumb,
// //   Label,
// //   Input,
// //   FileInput,
// // });


// export default function EditProfilePage() {
//   const { providerDetails, refreshProviderDetails } = useAuth();

//   console.log("proivder details : ", providerDetails)
//   useEffect(() => {
//     console.log({
//       ComponentCard,
//       PageBreadCrumb,
//       Label,
//       Input,
//       FileInput,
//     });
//   }, []);
//   // Personal info
//   const [fullName, setFullName] = useState(providerDetails?.fullName || "");
//   const [phoneNo, setPhoneNo] = useState(providerDetails?.phoneNo || "");
//   const [email, setEmail] = useState(providerDetails?.email || ""); // ✅ Added email state

//   // Store info
//   const [storeName, setStoreName] = useState(providerDetails?.storeInfo?.storeName || "");
//   const [storeEmail, setStoreEmail] = useState(providerDetails?.storeInfo?.storeEmail || "");
//   const [storePhone, setStorePhone] = useState(providerDetails?.storeInfo?.storePhone || "");
//   const [address, setAddress] = useState(providerDetails?.storeInfo?.address || "");
//   const [city, setCity] = useState(providerDetails?.storeInfo?.city || "");
//   const [state, setState] = useState(providerDetails?.storeInfo?.state || "");
//   const [country, setCountry] = useState(providerDetails?.storeInfo?.country || "");
// const [tags, setTags] = useState<string[]>(
//   providerDetails?.storeInfo?.tags || []
// );
// const [tagInput, setTagInput] = useState("");
// const [totalProjects, setTotalProjects] = useState(
//   providerDetails?.storeInfo?.totalProjects?.toString() || ""
// );
// const [totalExperience, setTotalExperience] = useState(
//   providerDetails?.storeInfo?.totalExperience?.toString() || ""
// );

  
//   const [logo, setLogo] = useState<File | null>(null);
//   const [cover, setCover] = useState<File | null>(null);
//   const [logoPreview, setLogoPreview] = useState<string>(providerDetails?.storeInfo?.logo || "");
//   const [coverPreview, setCoverPreview] = useState<string>(providerDetails?.storeInfo?.cover || "");

//   // Gallery & KYC
//   const [galleryImages, setGalleryImages] = useState<File[]>([]);
//   const [galleryPreviews, setGalleryPreviews] = useState<string[]>(providerDetails?.galleryImages || []);

//   const [kycDocs, setKycDocs] = useState<{ [key: string]: File[] }>({
//     aadhaarCard: [],
//     panCard: [],
//     storeDocument: [],
//     GST: [],
//     other: [],
//   });
//   const [kycPreviews, setKycPreviews] = useState<{ [key: string]: string[] }>({
//     aadhaarCard: providerDetails?.kyc?.aadhaarCard || [],
//     panCard: providerDetails?.kyc?.panCard || [],
//     storeDocument: providerDetails?.kyc?.storeDocument || [],
//     GST: providerDetails?.kyc?.GST || [],
//     other: providerDetails?.kyc?.other || [],
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     if (providerDetails) {
//       setFullName(providerDetails.fullName || "");
//       setPhoneNo(providerDetails.phoneNo || "");
//       setEmail(providerDetails.email || ""); // ✅ Sync email from providerDetails
//       setStoreName(providerDetails.storeInfo?.storeName || "");
//       setStoreEmail(providerDetails.storeInfo?.storeEmail || "");
//       setStorePhone(providerDetails.storeInfo?.storePhone || "");
//       setAddress(providerDetails.storeInfo?.address || "");
//       setCity(providerDetails.storeInfo?.city || "");
//       setState(providerDetails.storeInfo?.state || "");
//       setCountry(providerDetails.storeInfo?.country || "");
//       setLogoPreview(providerDetails.storeInfo?.logo || "");
//       setCoverPreview(providerDetails.storeInfo?.cover || "");
//       setGalleryPreviews(providerDetails.galleryImages || []);
//       setKycPreviews({
//         aadhaarCard: providerDetails.kyc?.aadhaarCard || [],
//         panCard: providerDetails.kyc?.panCard || [],
//         storeDocument: providerDetails.kyc?.storeDocument || [],
//         GST: providerDetails.kyc?.GST || [],
//         other: providerDetails.kyc?.other || [],
//       });
//       setTags(providerDetails.storeInfo?.tags || []);
// setTotalProjects(
//   providerDetails.storeInfo?.totalProjects?.toString() || ""
// );
// setTotalExperience(
//   providerDetails.storeInfo?.totalExperience?.toString() || ""
// );

//     }
//   }, [providerDetails]);

//   // Single file handler (logo/cover)
//   const handleFileChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     setter: (file: File | null) => void,
//     previewSetter?: (url: string) => void
//   ) => {
//     if (!e.target.files) return;
//     const file = e.target.files[0];
//     setter(file);
//     if (previewSetter && file) previewSetter(URL.createObjectURL(file));
//   };

//   // Gallery handler (multiple files)
//   const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const files = Array.from(e.target.files);
//     setGalleryImages((prev) => [...prev, ...files]);
//     setGalleryPreviews((prev) => [
//       ...prev,
//       ...files.map((file) => URL.createObjectURL(file)),
//     ]);
//   };

//   // KYC handler
//   const handleKycChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
//     if (!e.target.files) return;
//     const files = Array.from(e.target.files);
//     setKycDocs((prev) => ({ ...prev, [key]: [...prev[key], ...files] }));
//     setKycPreviews((prev) => ({
//       ...prev,
//       [key]: [...prev[key], ...files.map((file) => URL.createObjectURL(file))],
//     }));
//   };

//   // Validation
//   const validate = () => {
//     if (!fullName.trim()) return "Full Name is required.";
//     if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email."; // ✅ Email validation
//     if (!phoneNo.trim() || !/^\d{10}$/.test(phoneNo)) return "Enter a valid 10-digit phone number.";
//     if (!storeName.trim()) return "Store Name is required.";
//     if (!address.trim()) return "Address is required.";
//     if (!city.trim()) return "City is required.";
//     if (!state.trim()) return "State is required.";
//     if (!country.trim()) return "Country is required.";
//     if (storeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeEmail)) return "Enter a valid store email.";
//     if (storePhone && !/^\d{10}$/.test(storePhone)) return "Enter a valid store phone.";
//     return "";
//   };

//   const addTag = () => {
//   if (!tagInput.trim()) return;
//   if (tags.includes(tagInput.trim())) return;

//   setTags((prev) => [...prev, tagInput.trim()]);
//   setTagInput("");
// };

// const removeTag = (tag: string) => {
//   setTags((prev) => prev.filter((t) => t !== tag));
// };


//   // Update handler
//   const handleUpdate = async () => {
//     setError("");
//     const validationError = validate();
//     if (validationError) return setError(validationError);

//     setLoading(true);
//     try {
//       const formData = new FormData();

//       formData.append("fullName", fullName);
//       formData.append("phoneNo", phoneNo);
//       formData.append("email", email); // ✅ Added email to formData

//       formData.append("storeInfo.storeName", storeName);
//       formData.append("storeInfo.storeEmail", storeEmail);
//       formData.append("storeInfo.storePhone", storePhone);
//       formData.append("storeInfo.address", address);
//       formData.append("storeInfo.city", city);
//       formData.append("storeInfo.state", state);
//       formData.append("storeInfo.country", country);

//       formData.append("storeInfo.totalProjects", totalProjects);
// formData.append("storeInfo.totalExperience", totalExperience);

// // Send tags as multiple keys
// tags.forEach((tag) => {
//   formData.append("storeInfo.tags", tag);
// });


//       if (logo) formData.append("logo", logo);
//       if (cover) formData.append("cover", cover);

//       galleryImages.forEach((file) => formData.append("galleryImages", file));

//       Object.keys(kycDocs).forEach((key) => {
//         kycDocs[key].forEach((file) => formData.append(key, file));
//       });

//       const response = await fetch(
//         `https://api.fetchtrue.com/api/provider/edit-profile/${providerDetails?._id}`,
//         { method: "PATCH", body: formData }
//       );
//       const data = await response.json();

//       if (response.ok && data.success) {
//         alert("Profile updated successfully!");
//         await refreshProviderDetails();
//         router.push("/profile");
//       } else {
//         setError(data.message || "Failed to update profile.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("An error occurred while updating profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <PageBreadCrumb pageTitle="Edit Profile" />
//       {error && <p className="text-red-500 m-4">{error}</p>}
//       <div className="space-y-6 m-4">

//         <ComponentCard title="Personal Information">
//             <Label>Full Name</Label>
//           <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
//           <Label>Email</Label>
//           <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> {/* ✅ Added email input */}
//           <Label>Phone Number</Label>
//           <Input placeholder="Phone" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
//         </ComponentCard>

//         <ComponentCard title="Store Information">
//            <Label>Store Name</Label>
//           <Input placeholder="Store Name" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
//             <Label>Store Email</Label>
//           <Input placeholder="Store Email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} />
//            <Label>Store Phone</Label>
//           <Input placeholder="Store Phone" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
//           <Label>Address</Label>
//           <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
//            <Label>City</Label>
//           <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
//             <Label>State</Label>
//           <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
//           <Label>Country</Label>
//           <Input placeholder="State" value={country} onChange={(e) => setCountry(e.target.value)} />
//            <Label>Tags</Label>
// <div>
//   <Label>Tags</Label>
//   <div className="flex gap-2">
//     <Input
//       placeholder="Add a tag"
//       value={tagInput}
//       onChange={(e) => setTagInput(e.target.value)}
//     />
//     <button
//       type="button"
//       onClick={addTag}
//       className="px-4 bg-blue-600 text-white rounded"
//     >
//       Add
//     </button>
//   </div>

//   <div className="flex flex-wrap gap-2 mt-2">
//     {tags.map((tag, idx) => (
//       <span
//         key={idx}
//         className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
//       >
//         {tag}
//         <button
//           type="button"
//           onClick={() => removeTag(tag)}
//           className="text-red-500"
//         >
//           ✕
//         </button>
//       </span>
//     ))}
//   </div>
// </div>

//  <Label>Total Projects</Label>
//           <Input
//   placeholder="Total Projects"
//   type="number"
//   value={totalProjects}
//   onChange={(e) => setTotalProjects(e.target.value)}
// />

//  <Label>Total Experience (Years)</Label>
// <Input
//   placeholder="Total Experience (Years)"
//   type="number"
//   value={totalExperience}
//   onChange={(e) => setTotalExperience(e.target.value)}
// />




//           <div>
//             <Label>Logo</Label>
//             <FileInput  onChange={(e) => handleFileChange(e, setLogo, setLogoPreview)} />
//             {logoPreview && <img src={logoPreview} alt="Logo" className="h-16 mt-2 border rounded" />}
//           </div>

//           <div>
//             <Label>Cover</Label>
//             <FileInput  onChange={(e) => handleFileChange(e, setCover, setCoverPreview)} />
//             {coverPreview && <img src={coverPreview} alt="Cover" className="h-24 mt-2 border rounded" />}
//           </div>

//           <div>
//             <Label>Gallery Images</Label>
//             <FileInput  multiple onChange={handleGalleryChange} />
//             <div className="flex flex-wrap gap-2 mt-2">
//               {galleryPreviews.map((img, idx) => (
//                 <img key={idx} src={img} alt={`Gallery ${idx}`} className="h-16 border rounded" />
//               ))}
//             </div>
//           </div>
//         </ComponentCard>

//         <ComponentCard title="KYC Documents">
//           {["aadhaarCard", "panCard", "storeDocument", "GST", "other"].map((key) => (
//             <div key={key} className="mb-4">
//               <Label>{key}</Label>
//               <FileInput multiple onChange={(e) => handleKycChange(e, key)} />
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {kycPreviews[key].map((file, idx) => (
//                   <img key={idx} src={file} alt={`${key} ${idx}`} className="h-16 border rounded" />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </ComponentCard>

//         <div className="flex justify-end">
//           <button
//             onClick={handleUpdate}
//             disabled={loading}
//             className={`px-6 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
//           >
//             {loading ? "Updating..." : "Update Profile"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React from "react";

export default function EditProfilePage() {
  return (
    <div>
      <h1>Edit Profile - Test Build</h1>
      <p>If this builds on Vercel, your imported components have issues.</p>
    </div>
  );
}