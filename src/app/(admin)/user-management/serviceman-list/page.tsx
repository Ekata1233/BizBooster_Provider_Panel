'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useServiceMan } from '@/app/context/ServiceManContext';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import BasicTableOne from '@/components/tables/BasicTableOne';
import { useRouter } from 'next/navigation';
import Input from '@/components/form/input/InputField';
import { EyeIcon, PencilIcon, TrashBinIcon } from '@/icons';
import { useAuth } from '@/app/context/AuthContext';
import { Modal } from '@/components/ui/modal';
import Link from 'next/link';

interface ServiceManTableData {
  id: string;
  name: string;
  lastName: string;
  phoneNo: string;
  email: string;
  status: string;
  businessInfo?: {
    identityType?: string;
    identityNumber?: string;
    identityImage?: string;
  };
}

interface ServiceMan {
  _id?: string;
  name?: string;
  lastName?: string;
  phoneNo?: string;
  email?: string;
  isDeleted?: boolean;
  businessInformation?: {
    identityType?: string;
    identityNumber?: string;
    identityImage?: string;
  };
}

const ServicemanListPage = () => {
  const { provider } = useAuth();
  const { serviceMenByProvider, fetchServiceMenByProvider, loading, error, deleteServiceMan } = useServiceMan();
  const [tableData, setTableData] = useState<ServiceManTableData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<ServiceManTableData[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // ✅
  const [isOpen, setIsOpen] = useState(false); // ✅
  const router = useRouter();
  console.log("serviceman",serviceMenByProvider);
  
  useEffect(() => {
    if (provider?._id) {
      fetchServiceMenByProvider(provider._id);
    }
  }, [provider]);

  useEffect(() => {
    if (serviceMenByProvider && serviceMenByProvider.length > 0) {
      const formatted = serviceMenByProvider.map((man: ServiceMan, index: number) => ({
        srNo: index + 1,
        id: man._id || '',
        name: man.name || '—',
        lastName: man.lastName || '—',
        phoneNo: man.phoneNo || '—',
        email: man.email || '—',
        status: man.isDeleted ? 'Inactive' : 'Active',
        businessInfo: man.businessInformation || {},
      }));

      setTableData(formatted);
    }
  }, [serviceMenByProvider]);

  useEffect(() => {
    const lowerSearch = searchQuery.toLowerCase();
    const filtered = tableData.filter((item) => {
      const fullText = `${item.name} ${item.lastName} ${item.phoneNo} ${item.email}`;
      return fullText.toLowerCase().includes(lowerSearch);
    });

    setFilteredData(filtered);
  }, [searchQuery, tableData]);

  const getFilteredByStatus = () => {
    if (activeTab === 'active') {
      return filteredData.filter((mod) => mod.status === 'Active');
    } else if (activeTab === 'inactive') {
      return filteredData.filter((mod) => mod.status === 'Inactive');
    }
    return filteredData;
  };

  const handleEdit = (id: string) => router.push(`/user-management/serviceman-list/${id}`);
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this serviceman?')) {
      await deleteServiceMan(id);
       alert('Serviceman deleted successfully!');
    }
  };

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  const columns = [
    { header: 'Sr. No', accessor: 'srNo' },
    { header: 'Name', accessor: 'name' },
    { header: 'Last Name', accessor: 'lastName' },
    { header: 'Phone Number', accessor: 'phoneNo' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Identity Info',
      accessor: 'businessInfo',
      render: (row: ServiceManTableData) => {
        const { identityType, identityNumber, identityImage } = row.businessInfo || {};
        return (
          <div className="text-sm space-y-1">
            <div><strong>Type:</strong> {identityType || '—'}</div>
            <div><strong>Number:</strong> {identityNumber || '—'}</div>
            {identityImage && (
              <img
                src={identityImage}
                alt="ID"
                className="w-12 h-12 rounded border mt-1 cursor-pointer hover:opacity-80"
                onClick={() => openModal(identityImage)}
              />
            )}
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row: ServiceManTableData) => {
        const colorClass =
          row.status === 'Inactive'
            ? 'text-red-500 bg-red-100 border border-red-300'
            : 'text-green-600 bg-green-100 border-green-300';

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
      render: (row: ServiceManTableData) => (
        <div className="flex gap-2">
           <Link
                            href={`/user-management/serviceman-list/details/${row.id}`}
                            className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                          >
                            <EyeIcon size={16} />
                          </Link>
          <button
            onClick={() => handleEdit(row.id)}
            className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white hover:border-yellow-500"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white hover:border-red-500"
          >
            <TrashBinIcon />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <p className="py-10 text-center text-sm text-gray-500">Loading ServiceMen…</p>;
  if (error) return <p className="py-10 text-center text-red-500">{error}</p>;

  return (
    <div>
      <PageBreadcrumb pageTitle="All ServiceMan" />

      <div className="my-5">
        <ComponentCard title="ServiceMan List">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search Serviceman"
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="border-b border-gray-200 mb-4">
            <ul className="flex space-x-6 text-sm font-medium text-center text-gray-500">
              <li
                className={`cursor-pointer px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </li>
              {/* <li
                className={`cursor-pointer px-4 py-2 ${activeTab === 'active' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
                onClick={() => setActiveTab('active')}
              >
                Active
              </li>
              <li
                className={`cursor-pointer px-4 py-2 ${activeTab === 'inactive' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
                onClick={() => setActiveTab('inactive')}
              >
                Inactive
              </li> */}
            </ul>
          </div>

          {getFilteredByStatus().length === 0 ? (
            <p className="text-sm text-gray-500">No matching servicemen found.</p>
          ) : (
            <BasicTableOne columns={columns} data={getFilteredByStatus()} />
          )}
        </ComponentCard>
      </div>

      {/* ✅ Image Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] max-h-[95vh] m-4">
        {selectedImage && (
          <div className="flex justify-center items-center m-3">
            <img
              src={selectedImage}
              alt="Identity Preview"
              className="h-[500px] w-auto object-contain rounded"
            />
          </div>
        )}
      </Modal>


    </div>
  );
};

export default ServicemanListPage;
