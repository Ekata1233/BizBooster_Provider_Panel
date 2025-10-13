'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import BasicTableOne from '@/components/tables/BasicTableOne';
import Input from '@/components/form/input/InputField';
import { TrashBinIcon, EyeIcon } from '@/icons';
import { Modal } from '@/components/ui/modal';
import Link from 'next/link';
import Image from 'next/image';
import { AdType, useAdContext } from '@/app/context/AdContext';
import { useAuth } from '@/app/context/AuthContext'; // ✅ Import AuthContext

interface AdTableData {
  // _id:string;
  id: string;
  addType: string;
  categoryName: string;
  serviceName: string;
  description: string;
  startDate: string;
  endDate: string;
  fileUrl: string;
  title: string;
  status: 'Active' | 'Inactive';
}

const AdvertiseList = () => {
  const { ads, deleteAd } = useAdContext();
  const { providerDetails } = useAuth(); // ✅ Logged-in provider info

  const [tableData, setTableData] = useState<AdTableData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<AdTableData[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ type: string; url: string } | null>(null);

  // ✅ Modal Controls
  const openModal = (type: string, url: string) => {
    setModalContent({ type, url });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
  };

  // ✅ Filter ads for the logged-in provider only
  useEffect(() => {
    if (!ads || !providerDetails?._id) return;

    // ✅ Filter by provider ID
    const providerAds = ads.filter(
      (ad: AdType) =>
        ad.provider &&
        typeof ad.provider === 'object' && // ✅ ensure it's an object first
        ad.provider._id === providerDetails._id
    );

    console.log('📦 Provider Ads:', providerAds);
    // ✅ Format for table
    const formatted: AdTableData[] = providerAds.map((ad: AdType) => ({
      id: ad._id || '',
      addType: ad.addType || 'image',
      categoryName: ad.category?.name || '—',
      serviceName: ad.service?.serviceName || '—',
      description: ad.description || '—',
      startDate: ad.startDate?.slice(0, 10) || '—',
      endDate: ad.endDate?.slice(0, 10) || '—',
      fileUrl: ad.fileUrl || '',
      title: ad.title || '—',
      status: ad.isDeleted ? 'Inactive' : 'Active',
    }));

    setTableData(formatted);
  }, [ads, providerDetails]);

  // ✅ Search Filter
  useEffect(() => {
    const lowerSearch = searchQuery.toLowerCase();
    const filtered = tableData.filter((item) =>
      `${item.addType} ${item.categoryName} ${item.serviceName} ${item.title}`
        .toLowerCase()
        .includes(lowerSearch)
    );
    setFilteredData(filtered);
  }, [searchQuery, tableData]);

  // ✅ Tab-based Filter
  const getFilteredByStatus = () => {
    switch (activeTab) {
      case 'active':
        return filteredData.filter((ad) => ad.status === 'Active');
      case 'inactive':
        return filteredData.filter((ad) => ad.status === 'Inactive');
      default:
        return filteredData;
    }
  };

  // ✅ Soft Delete (Mark as Inactive)
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to mark this ad as inactive?')) {
      await deleteAd(id);
      alert('Advertisement marked as inactive.');
      setTableData((prev) =>
        prev.map((ad) => (ad.id === id ? { ...ad, status: 'Inactive' } : ad))
      );
    }
  };


  // ✅ Table Columns
  const columns = [
    {
      header: 'Sr No',
      accessor: 'srNo',
      render: (_: AdTableData, index: number) => <span>{index + 1}</span>,
    },
    { header: 'Ad Type', accessor: 'addType' },
    { header: 'Title', accessor: 'title' },
    { header: 'Category', accessor: 'categoryName' },
    { header: 'Service', accessor: 'serviceName' },
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'End Date', accessor: 'endDate' },
    {
      header: 'Preview',
      accessor: 'fileUrl',
      render: (row: AdTableData) =>
        row.addType === 'video' ? (
          <video
            src={row.fileUrl}
            className="w-32 h-20 rounded border object-cover cursor-pointer"
            onClick={() => openModal('video', row.fileUrl)}
          />
        ) : (
          <Image
            src={row.fileUrl}
            alt="Ad File"
            width={128}
            height={80}
            className="rounded border object-cover cursor-pointer"
            onClick={() => openModal('image', row.fileUrl)}
          />
        ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row: AdTableData) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${row.status === 'Inactive'
              ? 'text-red-600 bg-red-100 border border-red-300'
              : 'text-green-600 bg-green-100 border border-green-300'
            }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row: AdTableData) => (
        <div className="flex gap-2">
          {/* {row.status === 'Active' && (
            <button
              onClick={() => handleDelete(row.id)}
              className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
            >
              <TrashBinIcon />
            </button>
          )} */}
          <button
            onClick={() => handleDelete(row.id)}
            disabled={row.status !== 'Active'}
            className={`rounded-md p-2 border 
    ${row.status === 'Active'
                ? 'text-red-500 border-red-500 hover:bg-red-500 hover:text-white'
                : 'text-gray-400 border-gray-300 cursor-not-allowed opacity-60'
              }`}
          >
            <TrashBinIcon />
          </button>

          <Link href={`/advertise-management/advertise-list/${row.id}`} passHref>
            <button className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white">
              <EyeIcon />
            </button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="My Advertisements" />
      <div className="my-5">
        <ComponentCard title="My Advertisement List">
          {/* ✅ Search Input */}
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search by ad type, title, or category…"
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* ✅ Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <ul className="flex space-x-6 text-sm font-medium text-center text-gray-500">
              {['all', 'active', 'inactive'].map((status) => (
                <li
                  key={status}
                  className={`cursor-pointer px-4 py-2 ${activeTab === status ? 'border-b-2 border-blue-600 text-blue-600' : ''
                    }`}
                  onClick={() => setActiveTab(status as 'all' | 'active' | 'inactive')}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {
                      tableData.filter((ad) =>
                        status === 'all'
                          ? true
                          : status === 'active'
                            ? ad.status === 'Active'
                            : ad.status === 'Inactive'
                      ).length
                    }
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ Table Display */}
          {getFilteredByStatus().length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-10">
              No advertisements found for your account.
            </p>
          ) : (
            <BasicTableOne columns={columns} data={getFilteredByStatus()} />
          )}
        </ComponentCard>
      </div>

      {/* ✅ Preview Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
        <div className="relative w-full rounded-lg">
          {modalContent?.type === 'video' ? (
            <video
              src={modalContent.url}
              controls
              autoPlay
              muted
              className="w-full h-auto rounded"
            />
          ) : (
            <Image
              src={modalContent?.url || ''}
              alt="Preview"
              width={600}
              height={400}
              className="w-full h-auto rounded"
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdvertiseList;
