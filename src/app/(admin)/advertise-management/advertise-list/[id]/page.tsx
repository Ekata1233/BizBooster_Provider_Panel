'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import { useAdContext } from '@/app/context/AdContext';

interface AdType {
  _id?: string;
  title: string;
  description: string;
  fileUrl: string;
  addType: string;
  category?: {
    _id?: string;
    name: string;
  };
  service?: {
    _id?: string;
    serviceName: string;
  };
  provider?: {
    _id?: string;
    fullName?: string;
    email?: string;
    phoneNo?: string;
  } | string;
  startDate?: string;
  endDate?: string;
  isApproved?: boolean;
  isExpired?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isDeleted:boolean;
}

const AdDetailsPage = () => {
  const { id } = useParams();
  const { ads } = useAdContext();

  const [ad, setAd] = useState<AdType | null>(null);

  useEffect(() => {
    if (id && ads.length > 0) {
      const found = ads.find((a) => a._id === id);
      if (found) setAd(found);
    }
  }, [id, ads]);

  const formatDate = (date?: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getAdRuntimeStatus = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return 'N/A';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  if (today < start) return 'Upcoming';
  if (today >= start && today <= end) return 'Active';
  if (today > end) return 'Inactive';

  return 'N/A';
};


  if (!ad) return <div className="p-4">Loading...</div>;

  // ✅ Handle provider safely (string or object)
  const providerName =
    typeof ad.provider === 'object'
      ? ad.provider?.fullName || ad.provider?.email || 'N/A'
      : ad.provider || 'N/A';

  return (
    <div>
      <PageBreadCrumb pageTitle="Advertisement Details" />

      {/* Card 1: Image + Title */}
      <div className="my-5">
        <ComponentCard title="Ad Overview">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {ad.fileUrl ? (
              <Image
                src={ad.fileUrl}
                alt="Ad Image"
                width={200}
                height={200}
                className="object-cover rounded border"
              />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center border rounded text-gray-500 text-sm">
                No Image
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold">Title:</h2>
              <p className="text-gray-700 mt-1">{ad.title}</p>

              <h2 className="text-lg font-semibold mt-4">Description:</h2>
              <p className="text-gray-700 mt-1">{ad.description || 'N/A'}</p>
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Card 2: Other Details */}
      <div className="my-5">
        <ComponentCard title="Additional Info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold">Category:</h2>
              <p className="text-gray-700">{ad.category?.name || 'N/A'}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Service:</h2>
              <p className="text-gray-700">{ad.service?.serviceName || 'N/A'}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Provider:</h2>
              <p className="text-gray-700">{providerName}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Ad Type:</h2>
              <p className="text-gray-700 capitalize">{ad.addType || 'N/A'}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Start Date:</h2>
              <p className="text-gray-700">{formatDate(ad.startDate)}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">End Date:</h2>
             <p className="text-gray-700">{formatDate(ad.endDate)}</p>
            </div>

            <div>
  <h2 className="text-lg font-semibold">Ad Runtime Status:</h2>
  <p
    className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
      getAdRuntimeStatus(ad.startDate, ad.endDate) === 'Upcoming'
        ? 'text-blue-600 bg-blue-100 border border-blue-300'
        : getAdRuntimeStatus(ad.startDate, ad.endDate) === 'Active'
        ? 'text-green-600 bg-green-100 border border-green-300'
        : 'text-red-600 bg-red-100 border border-red-300'
    }`}
  >
    {getAdRuntimeStatus(ad.startDate, ad.endDate)}
  </p>
</div>


            <div>
              <h2 className="text-lg font-semibold">Approval Status:</h2>
              <p
                className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${ad.isApproved
                    ? 'text-green-600 bg-green-100 border border-green-300'
                    : 'text-yellow-600 bg-yellow-100 border border-yellow-300'
                  }`}
              >
                {ad.isApproved ? 'Approved' : 'Pending'}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Expire Status:</h2>
             <p
                className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${ad.isExpired
                    ? 'text-red-600 bg-red-100 border border-red-300'
                    : 'text-green-600 bg-green-100 border border-green-300'
                  }`}
              >{ad.isExpired ? 'Expired' : 'Not expire'}</p>
            </div>

            {/* ✅ New Section for Active/Inactive */}
            <div>
              <h2 className="text-lg font-semibold">Delete or Not:</h2>
              <p
                className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${ad.isDeleted
                    ? 'text-red-600 bg-red-100 border border-red-300'
                    : 'text-green-600 bg-green-100 border border-green-300'
                  }`}
              >
                {ad.isDeleted ? 'Deleted' : 'Not deleted'}
              </p>
            </div>


            <div>
              <h2 className="text-lg font-semibold">Created At:</h2>
              <p className="text-gray-700">
                {ad.createdAt ? new Date(ad.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Updated At:</h2>
              <p className="text-gray-700">
                {ad.updatedAt ? new Date(ad.updatedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default AdDetailsPage;
