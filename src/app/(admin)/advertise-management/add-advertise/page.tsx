'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Input from '@/components/form/input/InputField';
import FileInput from '@/components/form/input/FileInput';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import ComponentCard from '@/components/common/ComponentCard';
import { useAdContext } from '@/app/context/AdContext';
import { useCategory } from '@/app/context/CategoryContext';
import { Service, useService } from '@/app/context/ServiceContext';
import { useAuth } from '@/app/context/AuthContext';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import axios from 'axios';

/* ------------------------------------------------------------------ */
/*  IMAGE VALIDATION FUNCTION                                         */
/* ------------------------------------------------------------------ */
const validateImage = (file: File, maxSizeMB: number = 1): string | null => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
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
  // Updated: Allows numbers WITH characters, but not numbers only
  title: /^(?!^\d+$)[a-zA-Z0-9\s\-&.,'()!?]{3,100}$/,
  description: /^(?!^\d+$)[a-zA-Z0-9\s\-&.,'()!?@#$%^&*]{10,500}$/,
  numbersOnly: /^\d+$/,
};

const validationMessages = {
  required: "This field is required",
  minLength: (min: number) => `Minimum ${min} characters required`,
  maxLength: (max: number) => `Maximum ${max} characters allowed`,
  invalidTitle: "Title must contain letters (cannot be only numbers)",
  invalidDescription: "Description must contain letters (cannot be only numbers)",
  invalidDateRange: "End date must be after start date",
  invalidStartDate: "Start date must be in the future",
  invalidCategory: "Please select a valid category",
  invalidService: "Please select a valid service",
  invalidFile: "Please select a valid image file",
};

const AddAd = () => {
  const { createAd } = useAdContext();
  const { categories, loadingCategories } = useCategory();
  const { services, loadingServices } = useService();
  const { provider, providerDetails } = useAuth();

  const [addType] = useState<'image'>('image');
  const [category, setCategory] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [service, setService] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subscribedServices = services.filter((service) =>
    providerDetails?.subscribedServices?.some(
      (sub) => sub._id.toString() === service._id.toString()
    )
  );

  const fetchCategories = useMemo(() => {
    if (!provider?.storeInfo?.module) return [];
    return categories.filter(
      (cat) => cat.module?._id === provider?.storeInfo?.module
    );
  }, [categories, provider]);

  // Log subscribed services for debugging
  useEffect(() => {
    if (provider && services.length > 0) {
      const subscribed = services.filter((service) =>
        provider.subscribedServices?.some(
          (id) => id.toString() === service._id.toString()
        )
      );

      console.log('Subscribed Services for Provider:', {
        providerId: provider._id,
        providerName: provider.fullName,
        subscribedServices: subscribed.map((s) => ({
          _id: s._id,
          serviceName: s.serviceName,
          category: s.category?.name || 'No category',
          price: s.price,
          discountedPrice: s.discountedPrice,
        })),
      });
    }
  }, [provider, services]);

  // Filter services based on selected category
  useEffect(() => {
    if (category) {
      const filtered = subscribedServices.filter(
        (s) => s.category?._id.toString() === category && !s.isDeleted
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
    setService('');
  }, [category, services, provider]);

  // Error display component
  const ErrorMessage = ({ message }: { message: string }) => (
    message ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">{message}</p> : null
  );

  // Validation functions
  const validateTitle = (value: string): string | null => {
    if (!value.trim()) return validationMessages.required;
    if (value.trim().length < 3) return validationMessages.minLength(3);
    if (value.trim().length > 100) return validationMessages.maxLength(100);
    
    // Check if it's only numbers
    if (validationPatterns.numbersOnly.test(value.trim())) {
      return validationMessages.invalidTitle;
    }
    
    // Check if it matches the pattern (allows numbers with characters)
    if (!validationPatterns.title.test(value.trim())) {
      return validationMessages.invalidTitle;
    }
    
    return null;
  };

  const validateDescription = (value: string): string | null => {
    if (!value.trim()) return validationMessages.required;
    if (value.trim().length < 10) return validationMessages.minLength(10);
    if (value.trim().length > 500) return validationMessages.maxLength(500);
    
    // Check if it's only numbers
    if (validationPatterns.numbersOnly.test(value.trim())) {
      return validationMessages.invalidDescription;
    }
    
    // Check if it matches the pattern (allows numbers with characters)
    if (!validationPatterns.description.test(value.trim())) {
      return validationMessages.invalidDescription;
    }
    
    return null;
  };

  const validateCategory = (value: string): string | null => {
    if (!value.trim()) return validationMessages.required;
    const categoryExists = fetchCategories.some(cat => cat._id === value);
    if (!categoryExists) return validationMessages.invalidCategory;
    return null;
  };

  const validateService = (value: string): string | null => {
    if (!value.trim()) return validationMessages.required;
    const serviceExists = filteredServices.some(s => s._id === value);
    if (!serviceExists) return validationMessages.invalidService;
    return null;
  };

  const validateStartDate = (value: string): string | null => {
    if (!value.trim()) return validationMessages.required;
    const selectedDate = new Date(value);
    const now = new Date();
    if (selectedDate < now) return validationMessages.invalidStartDate;
    return null;
  };

  const validateEndDate = (startVal: string, endVal: string): string | null => {
    if (!endVal.trim()) return validationMessages.required;
    if (!startVal.trim()) return "Please select start date first";
    
    const startDateObj = new Date(startVal);
    const endDateObj = new Date(endVal);
    
    if (endDateObj <= startDateObj) return validationMessages.invalidDateRange;
    
    // Validate end date is not too far in the future (optional: 1 year max)
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);
    if (endDateObj > maxFutureDate) {
      return "End date cannot be more than 1 year in the future";
    }
    
    return null;
  };

  const validateFile = (file: File | null): string | null => {
    if (!file) return validationMessages.invalidFile;
    const validationError = validateImage(file, 1);
    if (validationError) return validationError;
    return null;
  };

  // Main validation function
  const validateForm = (): { isValid: boolean; message: string } => {
    const newErrors: Record<string, string> = {};
    
    // Validate all fields
    const titleError = validateTitle(title);
    if (titleError) newErrors.title = titleError;
    
    const descriptionError = validateDescription(description);
    if (descriptionError) newErrors.description = descriptionError;
    
    const categoryError = validateCategory(category);
    if (categoryError) newErrors.category = categoryError;
    
    const serviceError = validateService(service);
    if (serviceError) newErrors.service = serviceError;
    
    const startDateError = validateStartDate(startDate);
    if (startDateError) newErrors.startDate = startDateError;
    
    const endDateError = validateEndDate(startDate, endDate);
    if (endDateError) newErrors.endDate = endDateError;
    
    const fileError = validateFile(selectedFile);
    if (fileError) newErrors.file = fileError;
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      return { isValid: true, message: "" };
    } else {
      const firstErrorKey = Object.keys(newErrors)[0];
      const firstErrorMessage = newErrors[firstErrorKey];
      return { 
        isValid: false, 
        message: `Validation Error: ${firstErrorMessage}` 
      };
    }
  };

  // Handle file selection with validation
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    
    // Clear file error when new file is selected
    if (errors.file) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.file;
        return newErrors;
      });
    }
    
    // Validate file immediately
    if (file) {
      const fileError = validateFile(file);
      if (fileError) {
        setErrors(prev => ({ ...prev, file: fileError }));
        alert(`File Error: ${fileError}`);
        event.target.value = ''; // Clear the file input
        setSelectedFile(null);
      }
    }
  };

  // Form field change handlers
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    if (errors.title) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.title;
        return newErrors;
      });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDescription(value);
    if (errors.description) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.description;
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategory(value);
    if (errors.category) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.category;
        return newErrors;
      });
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setService(value);
    if (errors.service) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.service;
        return newErrors;
      });
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);
    if (errors.startDate) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.startDate;
        return newErrors;
      });
    }
    // Clear end date error when start date changes
    if (errors.endDate) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.endDate;
        return newErrors;
      });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDate(value);
    if (errors.endDate) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.endDate;
        return newErrors;
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setCategory('');
    setService('');
    setStartDate('');
    setEndDate('');
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    setErrors({});
  };

  // Get today's date-time in YYYY-MM-DDTHH:mm format
  const todayDateTime = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }, []);

  // Get minimum end date based on start date
  const getMinEndDate = () => {
    if (!startDate) return todayDateTime;
    const startDateObj = new Date(startDate);
    startDateObj.setMinutes(startDateObj.getMinutes() + 1); // Add 1 minute minimum
    const yyyy = startDateObj.getFullYear();
    const mm = String(startDateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(startDateObj.getDate()).padStart(2, '0');
    const hh = String(startDateObj.getHours()).padStart(2, '0');
    const min = String(startDateObj.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  // Submit new ad
  const handleSubmit = async () => {
    // Validate form
    const validationResult = validateForm();
    
    if (!validationResult.isValid) {
      alert(validationResult.message);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('addType', addType);
      formData.append('category', category);
      formData.append('service', service);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('fileUrl', selectedFile as File);
      formData.append('providerId', provider?._id || '');

      await createAd(formData);
      alert('✅ Ad created successfully!\n\nClick OK to continue.');
      resetForm();
    } catch (error: unknown) {
      console.log('Error creating ad:', error);

      if (axios.isAxiosError(error)) {
        // 👉 NETWORK ERROR (no response)
        if (!error.response) {
          alert('Server not responding. Please try again later.');
          return;
        }

        const status = error.response.status;

        console.log('status creating ad:', status);

        if (status === 413) {
          alert('❌ Image too large. Max size is 1MB.\n\nClick OK to try again.');
        } else if (status === 400) {
          alert(`❌ Invalid request: ${error.response.data?.message || 'Please check your inputs.'}\n\nClick OK to try again.`);
        } else if (status === 401) {
          alert('❌ Session expired. Please login again.\n\nClick OK to try again.');
        } else if (status === 403) {
          alert('❌ You do not have permission to create ads.\n\nClick OK to try again.');
        } else if (status === 404) {
          alert('❌ Selected category or service not found.\n\nClick OK to try again.');
        } else if (status === 409) {
          alert('❌ An ad with similar details already exists.\n\nClick OK to try again.');
        } else if (status >= 500) {
          alert('❌ Server error. Please try again later.\n\nClick OK to try again.');
        } else {
          alert(`❌ Failed to create advertisement: ${error.response.data?.message || 'Unknown error'}\n\nClick OK to try again.`);
        }
      } else {
        alert('❌ Unexpected error occurred.\n\nClick OK to try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadCrumb pageTitle="Add Advertise" />

      <ComponentCard title="Add New Advertisement">
        <div className="space-y-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 md:gap-6">
          {/* Ad Type */}
          <div>
            <Label>Ad Type</Label>
            <select
              value={addType}
              disabled
              className="w-full border px-3 py-2 rounded-md bg-gray-100"
            >
              <option value="image">Image</option>
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <Label>Category *</Label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className={`w-full border px-3 py-2 rounded-md ${errors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Select Category</option>
              {loadingCategories ? (
                <option disabled>Loading...</option>
              ) : (
                fetchCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
            <ErrorMessage message={errors.category || ""} />
          </div>

          {/* Service Selector */}
          <div>
            <Label>Service (Subscribed Services) *</Label>
            <select
              value={service}
              onChange={handleServiceChange}
              className={`w-full border px-3 py-2 rounded-md ${errors.service ? 'border-red-500' : ''}`}
              disabled={!category}
            >
              <option value="">Select Service</option>
              {loadingServices ? (
                <option disabled>Loading...</option>
              ) : (
                filteredServices.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.serviceName}
                  </option>
                ))
              )}
            </select>
            <ErrorMessage message={errors.service || ""} />
            {category && filteredServices.length === 0 && !loadingServices && (
              <p className="mt-1 text-sm text-amber-600">No subscribed services available for this category.</p>
            )}
          </div>

          {/* Start Date & Time */}
          <div>
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={handleStartDateChange}
              className={`w-full border rounded-md p-2 ${errors.startDate ? 'border-red-500' : ''}`}
              min={todayDateTime}
            />
            <ErrorMessage message={errors.startDate || ""} />
          </div>

          {/* End Date & Time */}
          <div>
            <Label htmlFor="endDate">End Date *</Label>
            <Input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={handleEndDateChange}
              className={`w-full border rounded-md p-2 ${errors.endDate ? 'border-red-500' : ''}`}
              min={getMinEndDate()}
            />
            <ErrorMessage message={errors.endDate || ""} />
          </div>

          {/* Title */}
          <div>
            <Label>Title *</Label>
            <Input
              type="text"
              placeholder="Enter title (3-100 characters, must contain letters)"
              value={title}
              onChange={handleTitleChange}
              className={errors.title ? 'border-red-500' : ''}
              maxLength={100}
            />
            <ErrorMessage message={errors.title || ""} />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/100 characters • Must contain letters
            </p>
          </div>

          {/* Description */}
          <div>
            <Label>Description *</Label>
            <Input
              type="text"
              placeholder="Enter description (10-500 characters, must contain letters)"
              value={description}
              onChange={handleDescriptionChange}
              className={errors.description ? 'border-red-500' : ''}
              maxLength={500}
            />
            <ErrorMessage message={errors.description || ""} />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 characters • Must contain letters
            </p>
          </div>

          {/* File Input */}
          <div>
            <Label>Select Image *</Label>
            <FileInput 
              onChange={handleFileChange}
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            />
            <ErrorMessage message={errors.file || ""} />
            {selectedFile && (
              <p className="text-xs text-green-600 mt-1">✅ Selected: {selectedFile.name}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Max size: 1MB | Supported: JPEG, JPG, PNG, WEBP, GIF
            </p>
          </div>

          {/* Submit */}
          <div className="mt-6">
            <Button 
              size="sm" 
              variant="primary" 
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Add Advertise'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
                  resetForm();
                }
              }}
              className="ml-2"
            >
              Reset
            </Button>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default AddAd;