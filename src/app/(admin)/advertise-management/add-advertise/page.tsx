'use client';

import React, { useEffect, useState } from 'react';
import Input from '@/components/form/input/InputField';
import FileInput from '@/components/form/input/FileInput';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import ComponentCard from '@/components/common/ComponentCard';
import { useAdContext } from '@/app/context/AdContext';
import { useCategory } from '@/app/context/CategoryContext';
import { useService } from '@/app/context/ServiceContext';
import { useAuth } from '@/app/context/AuthContext';
import { uploadToImageKit } from '@/utils/uploadToImageKit';

const AddAd = () => {
  const { createAd } = useAdContext();
  const { ads } = useAdContext();
  const { categories, loadingCategories } = useCategory();
  const { services, loadingServices } = useService();
  const { provider } = useAuth();

  const [addType, setAddType] = useState<'image' | 'video'>('image');
  const [category, setCategory] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [service, setService] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  console.log('provider in add : ', provider?._id);

  useEffect(() => {
    if (provider) {
      console.log('🔐 Logged-in Provider:', provider);
    }
  }, [provider]);

  useEffect(() => {
    if (category && provider?.subscribedServices?.length) {
      const filtered = services.filter(
        (s) =>
          s.category?._id === category &&
          s.isDeleted === false &&
          provider.subscribedServices.includes(s._id)
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
    setService('');
  }, [category, services, provider]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const resetForm = () => {
    setAddType('image');
    setCategory('');
    setService('');
    setStartDate('');
    setEndDate('');
    setTitle('');
    setDescription('');
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    if (
      !addType ||
      !category ||
      !service ||
      !startDate ||
      !endDate ||
      !title ||
      !selectedFile
    ) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      setLoading(true);
      const fileUrl = await uploadToImageKit(selectedFile);

      const formData = new FormData();
      formData.append('addType', addType);
      formData.append('category', category);
      formData.append('service', service);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('fileUrl', fileUrl);
      formData.append('providerId', provider?._id || '');

      await createAd(formData);
      alert('Ad created successfully!');
      resetForm();
    } catch (error) {
      alert('Failed to create ad.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Add New Ad">
      <div className="space-y-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 md:gap-6">
        {/* Ad Type */}
        <div>
          <Label>Ad Type</Label>
          <select
            value={addType}
            onChange={(e) => setAddType(e.target.value as 'image' | 'video')}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        {/* Category Selector (filtered by subscribed services) */}
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
                      provider?.subscribedServices?.includes(s._id)
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

        {/* Service Selector (filtered by category and subscribed services) */}
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

        {/* Start and End Date */}
        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Title and Description */}
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
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
          <Label>Select Image / Video</Label>
          <FileInput onChange={handleFileChange} />
          {selectedFile && (
            <p className="text-xs text-gray-500 mt-1">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <Button
            size="sm"
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Add Ad'}
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
};

export default AddAd;
