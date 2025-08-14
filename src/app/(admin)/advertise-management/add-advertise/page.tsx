'use client';

import React, { useEffect, useState } from 'react';
import Input from '@/components/form/input/InputField';
import FileInput from '@/components/form/input/FileInput';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import ComponentCard from '@/components/common/ComponentCard';
import { useAdContext } from '@/app/context/AdContext';
import { useCategory } from '@/app/context/CategoryContext';
import { Service, useService } from '@/app/context/ServiceContext';
import { useAuth } from '@/app/context/AuthContext';

const AddAd = () => {
  const { createAd } = useAdContext();
  const { categories, loadingCategories } = useCategory();
  const { services, loadingServices } = useService();
  const { provider } = useAuth();

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

  // Filter services based on selected category & provider subscriptions
  useEffect(() => {
    if (category && provider?.subscribedServices?.length) {
      const filtered = services.filter(
        (s) =>
          s.category?._id === category &&
          !s.isDeleted &&
          (provider.subscribedServices ?? []).includes(s._id)
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

      // Prepare FormData for backend
      const formData = new FormData();
      formData.append('addType', addType);
      formData.append('category', category);
      formData.append('service', service);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('fileUrl', selectedFile); // ✅ Send file, backend will upload to ImageKit
      formData.append('providerId', provider?._id || '');

      await createAd(formData);
      alert('Ad created successfully!');
      resetForm();
    } catch (error) {
      console.error('Error creating ad:', error);
      alert('Failed to create ad.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
              categories
                .filter((cat) =>
                  services.some(
                    (s) =>
                      s.category?._id === cat._id &&
                      (provider?.subscribedServices ?? []).includes(s._id)
                  )
                )
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))
            )}
          </select>
        </div>

        {/* Service Selector */}
        <div>
          <Label>Service</Label>
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

        {/* Start Date */}
        <div>
          <Label>Start Date</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        {/* End Date */}
        <div>
          <Label>End Date</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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
            {loading ? 'Submitting...' : 'Add Ad'}
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
};

export default AddAd;
