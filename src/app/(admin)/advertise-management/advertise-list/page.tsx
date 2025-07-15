'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { AdType, useAdContext } from '@/app/context/AdContext';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import BasicTableOne from '@/components/tables/BasicTableOne';
import Input from '@/components/form/input/InputField';
import { TrashBinIcon, EyeIcon } from '@/icons';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';

interface AdTableData {
  id: string;
  addType: string;
  category: string;
  serviceName: string;
  description: string;
  startDate: string;
  endDate: string;
  fileUrl: string;
  title: string;
  status: string;
}


const AdvertiseList = () => {
  const { ads } = useAdContext();
  const router = useRouter();
  const [tableData, setTableData] = useState<AdTableData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<AdTableData[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ type: string; url: string } | null>(null);
   
    
  const openModal = (type: string, url: string) => {
    setModalContent({ type, url });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
  };

useEffect(() => {
  if (ads && ads.length > 0) {
    const formatted = ads.map((ad: AdType) => ({
      id: ad._id || '',
      addType: ad.addType || '—',
      category: ad.category || '—', // ✅ category is a string in your context
      serviceName: ad.service || '—', // ✅ service is a string in your context
      description: ad.description || '—',
      startDate: ad.startDate?.slice(0, 10) || '—',
      endDate: ad.endDate?.slice(0, 10) || '—',
      fileUrl: ad.fileUrl || '',
      title: ad.title || '—',
      status: ad.isExpired ? 'Inactive' : 'Active',
    }));
    setTableData(formatted);
  }
}, [ads]);

  useEffect(() => {
    const lowerSearch = searchQuery.toLowerCase();
    const filtered = tableData.filter((item) =>
      `${item.addType} ${item.category} ${item.serviceName} ${item.title}`
        .toLowerCase()
        .includes(lowerSearch)
    );
    setFilteredData(filtered);
  }, [searchQuery, tableData]);

  const getFilteredByStatus = () => {
    if (activeTab === 'active') {
      return filteredData.filter((ad) => ad.status === 'Active');
    } else if (activeTab === 'inactive') {
      return filteredData.filter((ad) => ad.status === 'Inactive');
    }
    return filteredData;
  };

  const handleView = (id: string) => router.push(`/advertise-management/view/${id}`);
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      alert(`Deleted Ad ID: ${id}`);
    }
  };

  const columns = [
    { header: 'Ad Type', accessor: 'addType' },
    { header: 'Title', accessor: 'title' },
    { header: 'Description', accessor: 'description' },
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'End Date', accessor: 'endDate' },
    {
      header: 'File',
      accessor: 'fileUrl',
      render: (row: AdTableData) => {
        return row.addType === 'video' ? (
          <video
            src={row.fileUrl}
            className="w-32 h-20 rounded border object-cover cursor-pointer"
            onClick={() => openModal('video', row.fileUrl)}
          />
        ) : (
          <img
            src={row.fileUrl}
            alt="Ad File"
            className="w-32 h-20 rounded border object-cover cursor-pointer"
            onClick={() => openModal('image', row.fileUrl)}
          />
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row: AdTableData) => {
        const colorClass =
          row.status === 'Inactive'
            ? 'text-red-500 bg-red-100 border border-red-300'
            : 'text-green-600 bg-green-100 border border-green-300';

        return (
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row: AdTableData) => (
        <div className="flex gap-2">
          {/* <button
            onClick={() => handleEdit(row.id)}
            className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
          >
            <PencilIcon />
          </button> */}
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
          >
            <TrashBinIcon />
          </button>
          <button
            onClick={() => handleView(row.id)}
            className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
          >
            <EyeIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="All Advertisements" />

      <div className="my-5">
        <ComponentCard title="Advertisement List">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search ads…"
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="border-b border-gray-200 mb-4">
            <ul className="flex space-x-6 text-sm font-medium text-center text-gray-500">
              {['all', 'active', 'inactive'].map((status) => (
                <li
                  key={status}
                  className={`cursor-pointer px-4 py-2 ${
                    activeTab === status ? 'border-b-2 border-blue-600 text-blue-600' : ''
                  }`}
                  onClick={() => setActiveTab(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </li>
              ))}
            </ul>
          </div>

          {getFilteredByStatus().length === 0 ? (
            <p className="text-sm text-gray-500">No matching advertisements found.</p>
          ) : (
            <BasicTableOne columns={columns} data={getFilteredByStatus()} />
          )}
        </ComponentCard>
      </div>

      {/* ✅ Modal with video fix */}
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
            <img
              src={modalContent?.url}
              alt="Preview"
              className="w-full h-auto rounded"
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdvertiseList;
