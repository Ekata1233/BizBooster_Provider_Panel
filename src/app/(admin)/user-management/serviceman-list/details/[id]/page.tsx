'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import { useServiceMan } from '@/app/context/ServiceManContext';

interface ServiceMan {
  _id?: string;
  name?: string;
  lastName?: string;
  phoneNo?: string;
  email?: string;
  serviceManId?: string;
  generalImage?: string;
  provider?: string;
  password?: string;
  businessInformation?: {
    identityType?: string;
    identityNumber?: string;
    identityImage?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

const ServiceManDetailsPage = () => {
  const { id } = useParams();
  const { serviceMenByProvider, fetchServiceMenByProvider } = useServiceMan();
  const [serviceman, setServiceman] = useState<ServiceMan | null>(null);

  useEffect(() => {
    if (!serviceMenByProvider || serviceMenByProvider.length === 0) {
      fetchServiceMenByProvider(''); // optionally pass provider id if needed
    }
  }, []);

  useEffect(() => {
    if (serviceMenByProvider && id) {
      const selected = serviceMenByProvider.find((man) => man._id === id);
      setServiceman(selected || null);
      console.log('Selected Serviceman:', selected);
    }
  }, [serviceMenByProvider, id]);

  if (!serviceman) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <PageBreadcrumb pageTitle="Serviceman Details" />

      {/* Card 1: Image left + Name/Last Name right */}
      <div className="my-5">
        <ComponentCard title="Serviceman Overview">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            {/* Left: General Image */}
            <div>
              {serviceman.generalImage ? (
                <Image
                  src={serviceman.generalImage}
                  alt="Profile Image"
                  width={200}
                  height={200}
                  className="object-cover rounded border"
                />
              ) : (
                <div className="w-[200px] h-[200px] flex items-center justify-center border rounded text-gray-500 text-sm">
                  No Image
                </div>
              )}
            </div>

            {/* Right: Name & Last Name */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Name:</h2>
              <p className="text-gray-700 mt-1">{serviceman.name || 'N/A'}</p>

              <h2 className="text-lg font-semibold mt-4">Last Name:</h2>
              <p className="text-gray-700 mt-1">{serviceman.lastName || 'N/A'}</p>
            </div>
          </div>

          {/* Next Row: Other Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h2 className="text-lg font-semibold">Phone Number:</h2>
              <p className="text-gray-700">{serviceman.phoneNo || 'N/A'}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Email:</h2>
              <p className="text-gray-700">{serviceman.email || 'N/A'}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">ServiceMan ID:</h2>
              <p className="text-gray-700">{serviceman.serviceManId || 'N/A'}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Status:</h2>
              <p
                className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                  serviceman.isDeleted
                    ? 'text-red-600 bg-red-100 border border-red-300'
                    : 'text-green-600 bg-green-100 border border-green-300'
                }`}
              >
                {serviceman.isDeleted ? 'Inactive' : 'Active'}
              </p>
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Card 2: Business Information */}
      {serviceman.businessInformation && (
        <div className="my-5">
          <ComponentCard title="Business Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold">Identity Type:</h2>
                <p className="text-gray-700">{serviceman.businessInformation.identityType || 'N/A'}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Identity Number:</h2>
                <p className="text-gray-700">{serviceman.businessInformation.identityNumber || 'N/A'}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Identity Image:</h2>
                {serviceman.businessInformation.identityImage ? (
                  <Image
                    src={serviceman.businessInformation.identityImage}
                    alt="Identity"
                    width={200}
                    height={150}
                    className="object-contain rounded border"
                  />
                ) : (
                  <p className="text-gray-700">N/A</p>
                )}
              </div>
            </div>
          </ComponentCard>
        </div>
      )}

      {/* Card 3: Timestamps */}
      <div className="my-5">
        <ComponentCard title="Record Timestamps">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold">Created At:</h2>
              <p className="text-gray-700">
                {serviceman.createdAt ? new Date(serviceman.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Updated At:</h2>
              <p className="text-gray-700">
                {serviceman.updatedAt ? new Date(serviceman.updatedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default ServiceManDetailsPage;
