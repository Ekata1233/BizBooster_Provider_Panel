"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useRouter } from "next/navigation";
import FileInput from "@/components/form/input/FileInput";

/* ------------------------------------------------------------------ */
/*  IMAGE VALIDATION FUNCTION                                         */
/* ------------------------------------------------------------------ */
const validateImage = (file: File, maxSizeMB: number = 1): string | null => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File size must be less than or equal to ${maxSizeMB}MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
  }

  return null;
};

/* ------------------------------------------------------------------ */
/*  VALIDATION PATTERNS & MESSAGES                                    */
/* ------------------------------------------------------------------ */
const validationPatterns = {
  fullName: /^(?!^\d+$)[a-zA-Z0-9\s]+$/,
  storeName: /^(?!^\d+$)[a-zA-Z0-9\s\-&.,'()]+$/,
  phone: /^[0-9]{10}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  address: /^[a-zA-Z0-9\s\-#,./\\()&'"°]+$/,
  city: /^[a-zA-Z\s\-']+$/,
  state: /^[a-zA-Z\s\-']+$/,
  country: /^[a-zA-Z\s\-']+$/,
  numbersOnly: /^\d+$/,
};

const validationMessages = {
  required: "This field is required",
  minLength: (min: number) => `Minimum ${min} characters required`,
  invalidEmail: "Please enter a valid email address",
  invalidPhone: "Phone number must be exactly 10 digits",
  fullName: "Name must contain letters (cannot be only numbers)",
  storeName: "Store name must contain letters (cannot be only numbers)",
  address: "Address contains invalid characters",
  city: "City name can only contain letters, spaces, hyphens, and apostrophes",
  state: "State name can only contain letters, spaces, hyphens, and apostrophes",
  country: "Country name can only contain letters, spaces, hyphens, and apostrophes",
};

export default function EditProfilePage() {
  const { providerDetails, refreshProviderDetails } = useAuth();
  const router = useRouter();
  
  // Form state
  const [form, setForm] = useState({
    fullName: "",
    phoneNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    storeEmail: "",
    storePhone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    tags: [] as string[],
    tagInput: "",
    totalProjects: "",
    totalExperience: "",
    logo: null as File | null,
    cover: null as File | null,
    galleryImages: [] as File[],
    kycDocs: {
      aadhaarCard: [] as File[],
      panCard: [] as File[],
      storeDocument: [] as File[],
      GST: [] as File[],
      other: [] as File[],
    },
    logoPreview: "",
    coverPreview: "",
    galleryPreviews: [] as string[],
    kycPreviews: {
      aadhaarCard: [] as string[],
      panCard: [] as string[],
      storeDocument: [] as string[],
      GST: [] as string[],
      other: [] as string[],
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Initialize form from providerDetails
  useEffect(() => {
    if (providerDetails) {
      setForm(prev => ({
        ...prev,
        fullName: providerDetails.fullName || "",
        phoneNo: providerDetails.phoneNo || "",
        email: providerDetails.email || "",
        storeName: providerDetails.storeInfo?.storeName || "",
        storeEmail: providerDetails.storeInfo?.storeEmail || "",
        storePhone: providerDetails.storeInfo?.storePhone || "",
        address: providerDetails.storeInfo?.address || "",
        city: providerDetails.storeInfo?.city || "",
        state: providerDetails.storeInfo?.state || "",
        country: providerDetails.storeInfo?.country || "",
        tags: providerDetails.storeInfo?.tags || [],
        totalProjects: providerDetails.storeInfo?.totalProjects?.toString() || "",
        totalExperience: providerDetails.storeInfo?.totalExperience?.toString() || "",
        logoPreview: providerDetails.storeInfo?.logo || "",
        coverPreview: providerDetails.storeInfo?.cover || "",
        galleryPreviews: providerDetails.galleryImages || [],
        kycPreviews: {
          aadhaarCard: providerDetails.kyc?.aadhaarCard || [],
          panCard: providerDetails.kyc?.panCard || [],
          storeDocument: providerDetails.kyc?.storeDocument || [],
          GST: providerDetails.kyc?.GST || [],
          other: providerDetails.kyc?.other || [],
        },
      }));
    }
  }, [providerDetails]);

  // Error display component
  const ErrorMessage = ({ message }: { message: string }) => (
    message ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">{message}</p> : null
  );

  // Validation functions
  const validateFullName = (value: string): string | null => {
    if (!value.trim()) return validationMessages.required;
    if (value.trim().length < 3) return validationMessages.minLength(3);
    if (!validationPatterns.fullName.test(value.trim())) return validationMessages.fullName;
    return null;
  };

  const validateEmail = (value: string): string | null => {
    if (!value.trim()) return validationMessages.required;
    if (!validationPatterns.email.test(value.trim())) return validationMessages.invalidEmail;
    return null;
  };

  const validatePhone = (value: string): string | null => {
    if (!value.trim()) return validationMessages.required;
    if (!validationPatterns.phone.test(value.trim())) return validationMessages.invalidPhone;
    return null;
  };

  const validateStoreName = (value: string): string | null => {
    if (!value.trim()) return validationMessages.required;
    if (value.trim().length < 2) return validationMessages.minLength(2);
    if (validationPatterns.numbersOnly.test(value.trim())) return validationMessages.storeName;
    if (!validationPatterns.storeName.test(value.trim())) return validationMessages.storeName;
    return null;
  };

  const validateAddress = (value: string): string | null => {
    if (!value.trim()) return validationMessages.required;
    if (value.trim().length < 5) return validationMessages.minLength(5);
    if (!validationPatterns.address.test(value.trim())) return validationMessages.address;
    return null;
  };

  const validateCity = (value: string): string | null => {
    if (!value.trim()) return validationMessages.required;
    if (value.trim().length < 2) return validationMessages.minLength(2);
    if (!validationPatterns.city.test(value.trim())) return validationMessages.city;
    if (/\d/.test(value.trim())) return "City name should not contain numbers";
    return null;
  };

  const validateState = (value: string): string | null => {
    if (!value.trim()) return validationMessages.required;
    if (value.trim().length < 2) return validationMessages.minLength(2);
    if (!validationPatterns.state.test(value.trim())) return validationMessages.state;
    if (/\d/.test(value.trim())) return "State name should not contain numbers";
    return null;
  };

  const validateCountry = (value: string): string | null => {
    if (!value.trim()) return validationMessages.required;
    if (value.trim().length < 2) return validationMessages.minLength(2);
    if (!validationPatterns.country.test(value.trim())) return validationMessages.country;
    if (/\d/.test(value.trim())) return "Country name should not contain numbers";
    return null;
  };

  const validateStoreEmail = (value: string): string | null => {
    if (!value.trim()) return null;
    if (!validationPatterns.email.test(value.trim())) return validationMessages.invalidEmail;
    return null;
  };

  const validateStorePhone = (value: string): string | null => {
    if (!value.trim()) return null;
    if (!validationPatterns.phone.test(value.trim())) return validationMessages.invalidPhone;
    return null;
  };

  const validateTotalProjects = (value: string): string | null => {
    if (!value.trim()) return null;
    const num = parseInt(value);
    if (isNaN(num) || num < 0) return "Total projects must be a non-negative number";
    return null;
  };

  const validateTotalExperience = (value: string): string | null => {
    if (!value.trim()) return null;
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return "Total experience must be a non-negative number";
    return null;
  };

  const validatePassword = (value: string): string | null => {
    if (value && value.length < 6) return "Password must be at least 6 characters";
    if (value && !/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
    return null;
  };

  const validateConfirmPassword = (value: string, password: string): string | null => {
    if (value && value !== password) return "Passwords do not match";
    return null;
  };

  // Main validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Personal Information
    const fullNameError = validateFullName(form.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;
    
    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;
    
    const phoneError = validatePhone(form.phoneNo);
    if (phoneError) newErrors.phoneNo = phoneError;
    
    // Password validation
    if (form.password) {
      const passwordError = validatePassword(form.password);
      if (passwordError) newErrors.password = passwordError;
      
      const confirmPasswordError = validateConfirmPassword(form.confirmPassword, form.password);
      if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    } else if (form.confirmPassword) {
      newErrors.confirmPassword = "Please enter a new password first";
    }
    
    // Store Information
    const storeNameError = validateStoreName(form.storeName);
    if (storeNameError) newErrors.storeName = storeNameError;
    
    const addressError = validateAddress(form.address);
    if (addressError) newErrors.address = addressError;
    
    const cityError = validateCity(form.city);
    if (cityError) newErrors.city = cityError;
    
    const stateError = validateState(form.state);
    if (stateError) newErrors.state = stateError;
    
    const countryError = validateCountry(form.country);
    if (countryError) newErrors.country = countryError;
    
    // Optional fields
    const storeEmailError = validateStoreEmail(form.storeEmail);
    if (storeEmailError) newErrors.storeEmail = storeEmailError;
    
    const storePhoneError = validateStorePhone(form.storePhone);
    if (storePhoneError) newErrors.storePhone = storePhoneError;
    
    const totalProjectsError = validateTotalProjects(form.totalProjects);
    if (totalProjectsError) newErrors.totalProjects = totalProjectsError;
    
    const totalExperienceError = validateTotalExperience(form.totalExperience);
    if (totalExperienceError) newErrors.totalExperience = totalExperienceError;
    
    // Combine file errors
    const allErrors = { ...newErrors, ...fileErrors };
    
    setErrors(allErrors);
    
    if (Object.keys(allErrors).length > 0) {
      // Show alert with first error message
      const firstErrorKey = Object.keys(allErrors)[0];
      const firstErrorMessage = allErrors[firstErrorKey];
      alert(`Validation Error: ${firstErrorMessage}`);
      return false;
    }
    
    return true;
  };

  // Form field handlers
  const handleChange = (field: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // File validation handlers
  const validateAndSetFile = (
    file: File | null, 
    setter: (file: File | null) => void,
    previewSetter: (url: string) => void,
    fieldName: string,
    fileErrorSetter: (error: string | null) => void
  ) => {
    fileErrorSetter(null);
    
    if (file) {
      const validationError = validateImage(file, 1);
      if (validationError) {
        fileErrorSetter(validationError);
        setFileErrors(prev => ({ ...prev, [fieldName]: validationError }));
        alert(`File Validation Error: ${validationError}`);
        return;
      }
    }
    
    setFileErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    
    setter(file);
    if (file) previewSetter(URL.createObjectURL(file));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    validateAndSetFile(
      file,
      (file) => handleChange("logo", file),
      (url) => handleChange("logoPreview", url),
      "logo",
      (error) => setFileErrors(prev => ({ ...prev, logo: error || "" }))
    );
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    validateAndSetFile(
      file,
      (file) => handleChange("cover", file),
      (url) => handleChange("coverPreview", url),
      "cover",
      (error) => setFileErrors(prev => ({ ...prev, cover: error || "" }))
    );
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    const validFiles: File[] = [];
    const validationErrors: string[] = [];
    
    files.forEach((file, index) => {
      const validationError = validateImage(file, 1);
      if (validationError) {
        validationErrors.push(`Gallery image ${index + 1}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });
    
    if (validationErrors.length > 0) {
      setFileErrors(prev => ({
        ...prev,
        gallery: validationErrors.join(' | ')
      }));
      alert(`Gallery Validation Error: ${validationErrors[0]}`);
      
      if (validFiles.length === 0) return;
    } else {
      setFileErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.gallery;
        return newErrors;
      });
    }
    
    setForm(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ...validFiles],
      galleryPreviews: [
        ...prev.galleryPreviews,
        ...validFiles.map(file => URL.createObjectURL(file))
      ]
    }));
  };

  // KYC validation handlers
  const validateAndSetKycFiles = (
    files: File[],
    key: keyof typeof form.kycDocs,
    fieldName: string
  ) => {
    const validFiles: File[] = [];
    const validationErrors: string[] = [];
    
    files.forEach((file, index) => {
      const validationError = validateImage(file, 1);
      if (validationError) {
        validationErrors.push(`${fieldName} file ${index + 1}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });
    
    if (validationErrors.length > 0) {
      setFileErrors(prev => ({
        ...prev,
        [fieldName]: validationErrors.join(' | ')
      }));
      alert(`KYC Validation Error: ${validationErrors[0]}`);
    } else {
      setFileErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
    
    return validFiles;
  };

  const handleKycChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof form.kycDocs) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const fieldName = key.toString();
    
    const validFiles = validateAndSetKycFiles(files, key, fieldName);
    
    if (validFiles.length > 0) {
      setForm(prev => ({
        ...prev,
        kycDocs: {
          ...prev.kycDocs,
          [key]: [...prev.kycDocs[key], ...validFiles]
        },
        kycPreviews: {
          ...prev.kycPreviews,
          [key]: [
            ...prev.kycPreviews[key],
            ...validFiles.map(file => URL.createObjectURL(file))
          ]
        }
      }));
    }
  };

  // Tag handlers
  const addTag = () => {
    if (!form.tagInput.trim()) {
      alert("Please enter a tag");
      return;
    }
    if (form.tags.includes(form.tagInput.trim())) {
      alert("This tag already exists");
      return;
    }
    
    setForm(prev => ({
      ...prev,
      tags: [...prev.tags, form.tagInput.trim()],
      tagInput: ""
    }));
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // Phone number formatter
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>, field: 'phoneNo' | 'storePhone') => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    handleChange(field, value);
  };

  // Update handler with alert messages
  const handleUpdate = async () => {
    // Validate form
    if (!validateForm()) {
      return; // Stop if validation fails (alert already shown)
    }

    setLoading(true);
    
    try {
      const formData = new FormData();

      // Personal info
      formData.append("fullName", form.fullName);
      formData.append("phoneNo", form.phoneNo);
      formData.append("email", form.email);
      
      if (form.password) {
        formData.append("password", form.password);
      }

      // Store info
      formData.append("storeInfo.storeName", form.storeName);
      formData.append("storeInfo.storeEmail", form.storeEmail);
      formData.append("storeInfo.storePhone", form.storePhone);
      formData.append("storeInfo.address", form.address);
      formData.append("storeInfo.city", form.city);
      formData.append("storeInfo.state", form.state);
      formData.append("storeInfo.country", form.country);
      formData.append("storeInfo.totalProjects", form.totalProjects);
      formData.append("storeInfo.totalExperience", form.totalExperience);

      // Tags
      form.tags.forEach((tag) => {
        formData.append("storeInfo.tags", tag);
      });

      // Files
      if (form.logo) formData.append("logo", form.logo);
      if (form.cover) formData.append("cover", form.cover);

      form.galleryImages.forEach((file) => formData.append("galleryImages", file));

      // KYC documents
      Object.entries(form.kycDocs).forEach(([key, files]) => {
        files.forEach((file) => formData.append(key, file));
      });

      const response = await fetch(
        `https://api.fetchtrue.com/api/provider/edit-profile/${providerDetails?._id}`,
        { method: "PATCH", body: formData }
      );
      const data = await response.json();

      if (response.ok && data.success) {
        // Show success alert with OK button
        alert("✅ Profile updated successfully!\n\nClick OK to continue.");
        
        // Refresh data
        await refreshProviderDetails();
        
        // Redirect after user clicks OK
        router.push("/profile");
      } else {
        // Show error alert with OK button
        alert(`❌ Failed to update profile: ${data.message || "Unknown error"}\n\nClick OK to try again.`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ An error occurred while updating profile.\n\nClick OK to try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadCrumb pageTitle="Edit Profile" />

      <div className="space-y-6 m-4">
        {/* Personal Information */}
        <ComponentCard title="Personal Information">
          <div className="space-y-4">
            <div>
              <Label>Full Name *</Label>
              <Input 
                placeholder="Full Name" 
                value={form.fullName} 
                onChange={(e) => handleChange("fullName", e.target.value)}
                className={errors.fullName ? 'border-red-500' : ''}
              />
              <ErrorMessage message={errors.fullName || ""} />
            </div>

            <div>
              <Label>Email *</Label>
              <Input 
                placeholder="Email" 
                value={form.email} 
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              <ErrorMessage message={errors.email || ""} />
            </div>

            <div>
              <Label>Phone Number *</Label>
              <Input 
                placeholder="Phone" 
                value={form.phoneNo} 
                onChange={(e) => handlePhoneInput(e, 'phoneNo')}
                className={errors.phoneNo ? 'border-red-500' : ''}
              />
              <ErrorMessage message={errors.phoneNo || ""} />
            </div>
          </div>
        </ComponentCard>

        {/* Store Information */}
        <ComponentCard title="Store Information">
          <div className="space-y-4">
            <div>
              <Label>Store Name *</Label>
              <Input 
                placeholder="Store Name" 
                value={form.storeName} 
                onChange={(e) => handleChange("storeName", e.target.value)}
                className={errors.storeName ? 'border-red-500' : ''}
              />
              <ErrorMessage message={errors.storeName || ""} />
            </div>

            <div>
              <Label>Store Email</Label>
              <Input 
                placeholder="Store Email" 
                value={form.storeEmail} 
                onChange={(e) => handleChange("storeEmail", e.target.value)}
                className={errors.storeEmail ? 'border-red-500' : ''}
              />
              <ErrorMessage message={errors.storeEmail || ""} />
            </div>

            <div>
              <Label>Store Phone</Label>
              <Input 
                placeholder="Store Phone" 
                value={form.storePhone} 
                onChange={(e) => handlePhoneInput(e, 'storePhone')}
                className={errors.storePhone ? 'border-red-500' : ''}
              />
              <ErrorMessage message={errors.storePhone || ""} />
            </div>

            <div>
              <Label>Address *</Label>
              <Input 
                placeholder="Address" 
                value={form.address} 
                onChange={(e) => handleChange("address", e.target.value)}
                className={errors.address ? 'border-red-500' : ''}
              />
              <ErrorMessage message={errors.address || ""} />
            </div>

            <div>
              <Label>City *</Label>
              <Input 
                placeholder="City" 
                value={form.city} 
                onChange={(e) => handleChange("city", e.target.value)}
                className={errors.city ? 'border-red-500' : ''}
              />
              <ErrorMessage message={errors.city || ""} />
            </div>

            <div>
              <Label>State *</Label>
              <Input 
                placeholder="State" 
                value={form.state} 
                onChange={(e) => handleChange("state", e.target.value)}
                className={errors.state ? 'border-red-500' : ''}
              />
              <ErrorMessage message={errors.state || ""} />
            </div>

            <div>
              <Label>Country *</Label>
              <Input 
                placeholder="Country" 
                value={form.country} 
                onChange={(e) => handleChange("country", e.target.value)}
                className={errors.country ? 'border-red-500' : ''}
              />
              <ErrorMessage message={errors.country || ""} />
            </div>

            <div>
              <Label>Tags (comma separated)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag (e.g., On Time, Trusted)"
                  value={form.tagInput}
                  onChange={(e) => handleChange("tagInput", e.target.value)}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label>Total Projects</Label>
              <Input
                placeholder="Total Projects"
                type="number"
                min={0}
                value={form.totalProjects}
                onChange={(e) => handleChange("totalProjects", e.target.value)}
                className={errors.totalProjects ? 'border-red-500' : ''}
              />
              <ErrorMessage message={errors.totalProjects || ""} />
            </div>

            <div>
              <Label>Total Experience (Years)</Label>
              <Input
                placeholder="Total Experience (Years)"
                type="number"
                min={0}
                step={0.5}
                value={form.totalExperience}
                onChange={(e) => handleChange("totalExperience", e.target.value)}
                className={errors.totalExperience ? 'border-red-500' : ''}
              />
              <ErrorMessage message={errors.totalExperience || ""} />
            </div>

            {/* Logo with validation */}
            <div>
              <Label>Logo</Label>
              <FileInput 
                onChange={handleLogoChange}
                accept="image/jpeg,image/jpg,image/png,image/webp"
              />
              {fileErrors.logo && (
                <ErrorMessage message={fileErrors.logo} />
              )}
              {form.logoPreview && (
                <img src={form.logoPreview} alt="Logo" className="h-16 mt-2 border rounded" />
              )}
              <p className="text-xs text-gray-500 mt-1">Max size: 1MB | Supported: JPEG, JPG, PNG, WEBP, GIF, PDF</p>
            </div>

            {/* Cover with validation */}
            <div>
              <Label>Cover</Label>
              <FileInput 
                onChange={handleCoverChange}
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,application/pdf"
              />
              {fileErrors.cover && (
                <ErrorMessage message={fileErrors.cover} />
              )}
              {form.coverPreview && (
                <img src={form.coverPreview} alt="Cover" className="h-24 mt-2 border rounded" />
              )}
              <p className="text-xs text-gray-500 mt-1">Max size: 1MB | Supported: JPEG, JPG, PNG, WEBP, GIF, PDF</p>
            </div>

            {/* Gallery Images with validation */}
            <div>
              <Label>Gallery Images</Label>
              <FileInput 
                multiple 
                onChange={handleGalleryChange}
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              />
              {fileErrors.gallery && (
                <ErrorMessage message={fileErrors.gallery} />
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {form.galleryPreviews.map((img, idx) => (
                  <img key={idx} src={img} alt={`Gallery ${idx}`} className="h-16 border rounded" />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Max size per file: 1MB | Supported: JPEG, JPG, PNG, WEBP, GIF</p>
            </div>
          </div>
        </ComponentCard>

        {/* KYC Documents */}
        <ComponentCard title="KYC Documents">
          <div className="space-y-4">
            {["aadhaarCard", "panCard", "storeDocument", "GST", "other"].map((key) => (
              <div key={key} className="mb-4">
                <Label>
                  {key === "aadhaarCard" ? "Aadhaar Card" : 
                   key === "panCard" ? "PAN Card" : 
                   key === "storeDocument" ? "Store Document" : 
                   key === "GST" ? "GST Certificate" : 
                   "Other Documents"}
                  {(key === "aadhaarCard" || key === "panCard" || key === "storeDocument") && (
                    <span className="text-red-500"> *</span>
                  )}
                </Label>
                <FileInput 
                  multiple 
                  onChange={(e) => handleKycChange(e, key as keyof typeof form.kycDocs)}
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,application/pdf"
                />
                {fileErrors[key] && (
                  <ErrorMessage message={fileErrors[key]} />
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.kycPreviews[key as keyof typeof form.kycPreviews].map((file, idx) => (
                    <img key={idx} src={file} alt={`${key} ${idx}`} className="h-16 border rounded" />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Max size per file: 1MB | Supported: JPEG, JPG, PNG, WEBP, GIF, PDF
                </p>
              </div>
            ))}
          </div>
        </ComponentCard>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
                router.back();
              }
            }}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`px-6 py-2 rounded text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}