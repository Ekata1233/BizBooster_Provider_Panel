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
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import axios from 'axios';

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

  const subscribedServices = services.filter((service) =>
    providerDetails?.subscribedServices?.some(
      (sub) => sub._id.toString() === service._id.toString()
    )
  );

  console.log("provider : ", provider)
  console.log("provider details  : ", providerDetails)

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

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
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
  };

  // Submit new ad
  const handleSubmit = async () => {
    if (!category || !service || !startDate || !endDate || !title || !selectedFile) {
      alert('Please fill in all required fields.');
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
      formData.append('fileUrl', selectedFile);
      formData.append('providerId', provider?._id || '');

      await createAd(formData);
      alert('Ad created successfully!');
      resetForm();
    } catch (error: unknown) {
  console.error('Error creating ad:', error);

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 413) {
      alert('Uploaded file size exceeds the allowed limit (Max 1MB). Please upload a smaller image.');
    } else if (status === 400) {
      alert(error.response?.data?.message || 'Invalid request.');
    } else if (status === 401) {
      alert('You are not authorized. Please login again.');
    } else {
      alert(error.response?.data?.message || 'Failed to create advertisement.');
    }
  } else {
    alert('Network error. Please check your internet connection.');
  }
} finally {
      setLoading(false);
    }
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


  return (
    <div>
      <PageBreadcrumb pageTitle="Add Advertise" />

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
            <Label>Category</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
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
          </div>

          {/* Service Selector */}
          <div>
            <Label>Service (Subscribed Services)</Label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
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
          </div>

          {/* Start Date & Time */}
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* End Date & Time */}
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded-md p-2"
              //min={startDate || undefined} optional: prevent end before start
              min={todayDateTime || undefined}
            />
          </div>


          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Input
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* File Input */}
          <div>
            <Label>Select Image</Label>
            <FileInput onChange={handleFileChange} />
            {selectedFile && (
              <p className="text-xs text-gray-500 mt-1">Selected: {selectedFile.name}</p>
            )}
          </div>

          {/* Submit */}
          <div className="mt-6">
            <Button size="sm" variant="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Add Advertise'}
            </Button>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default AddAd;
