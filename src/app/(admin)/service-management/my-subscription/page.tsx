'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import BasicTableOne from '@/components/tables/BasicTableOne';
import { usePathname } from 'next/navigation';
import { useService } from '@/app/context/ServiceContext';
interface TableRow {
  original: {
    providerDiscount: number | null;
    providerPrice: number | null;
  };
}
interface TableData {
  id: string;
  serviceName: string;
  categoryName: string;
  subCategoryName: string;
  discountedPrice: number | null;
  providerPrice: number | null;
  providerMRP: number | null;       // ✅ new
  providerDiscount: number | null;
  providerCommission: string | null;
  status: string;
}

interface ProviderPrice {
  provider?: { _id: string };
  providerPrice?: number | null;
  providerMRP?: number | null;
  providerDiscount?: number | null;
  providerCommission?: string | null;
}

interface ServiceType {
  _id: string;
  serviceName: string;
  categoryName?: string;
  subCategoryName?: string;
  discountedPrice?: number | null;
  providerPrices?: ProviderPrice[];
}

export interface SubscribedService {
  _id: string;
  serviceName?: string;
  categoryName?: string;
  subCategoryName?: string;
  discountedPrice?: number | null;
  providerPrice?: number | null;
  providerMRP?: number | null;
  providerCommission?: string | null;
  providerDiscount?: number | null;
}

const MySubscriptionPage = () => {
  const { providerDetails, refreshProviderDetails } = useAuth();
  const pathname = usePathname();
  const { services } = useService();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [unsubscribing, setUnsubscribing] = useState<string | null>(null);

  console.log('provider details f:', providerDetails);
  console.log('updates price', services);

  // ✅ Refresh provider details when page loads or path changes
  useEffect(() => {
    refreshProviderDetails();
  }, [pathname]);

  useEffect(() => {
    refreshProviderDetails();
  }, []);

  // ✅ Map subscribedServices to table format
  useEffect(() => {
    if (providerDetails?.subscribedServices?.length) {
      const mapped = (providerDetails.subscribedServices as SubscribedService[]).map((srv,index) => {
        const matchingService = (services as ServiceType[]).find((svc) => {
          if (!Array.isArray(svc.providerPrices)) return false;
          return svc.providerPrices.some(
            (pp: ProviderPrice) =>
              pp.provider?._id === providerDetails._id && svc._id === srv._id
          );
        });

        let updatedProviderPrice: number | null = srv.providerPrice ?? null;
        let updatedProviderMRP: number | null = srv.providerMRP ?? null;
        let updatedProviderDiscount: number | null = srv.providerDiscount ?? null;
        let updatedProviderCommission: string | null = srv.providerCommission ?? null;

        if (matchingService) {
          const providerPriceEntry = matchingService.providerPrices?.find(
            (pp: ProviderPrice) => pp.provider?._id === providerDetails._id
          );

          if (providerPriceEntry) {
            if (providerPriceEntry.providerPrice != null) {
              updatedProviderPrice = Number(providerPriceEntry.providerPrice);
            }
            if (providerPriceEntry.providerMRP != null) {
              updatedProviderMRP = Number(providerPriceEntry.providerMRP);
            }
            if (providerPriceEntry.providerDiscount != null) {
              updatedProviderDiscount = Number(providerPriceEntry.providerDiscount);
            }
            if (providerPriceEntry.providerCommission != null) {
              updatedProviderCommission = (providerPriceEntry.providerCommission);
            }
          }
        }

        return {
           srNo: index + 1, 
          id: srv._id,
          serviceName: srv.serviceName || '—',
          categoryName: srv.categoryName || '—',
          subCategoryName: srv.subCategoryName || '—',
          discountedPrice: srv.discountedPrice ?? null,
          providerPrice: updatedProviderPrice,
          providerMRP: updatedProviderMRP,
          providerDiscount: updatedProviderDiscount,
          providerCommission: updatedProviderCommission,
          status: 'Subscribed',
        };
      });
      setTableData(mapped);
      setFilteredData(mapped);
    }
  }, [providerDetails, services]);


  // ✅ Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredData(tableData);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredData(
        tableData.filter((item) =>
          item.serviceName.toLowerCase().includes(lowerSearch)
        )
      );
    }
  }, [search, tableData]);

  const handleUnsubscribe = async (serviceId: string) => {
    if (!providerDetails?._id) {
      console.error('No providerId found');
      return;
    }

    try {
      setUnsubscribing(serviceId);

      const response = await fetch('https://api.fetchtrue.com/api/provider/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId: providerDetails._id,
          serviceId,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Unsubscribe failed');
      }

      alert('Service unsubscribed successfully!');

      await refreshProviderDetails(); // ✅ Update table without full reload
    } catch (error) {
      console.error('Error unsubscribing:', error);
    } finally {
      setUnsubscribing(null);
    }
  };


  const columns = [
      {
    header: 'Sr. No',
    accessor: 'srNo',
    cell: (_: unknown, rowIndex: number) => rowIndex + 1, // ✅ use unknown instead of any
  },
    { header: 'Service Name', accessor: 'serviceName' },
    {
      header: 'Price',
      accessor: 'discountedPrice',
      cell: (row: { discountedPrice: number | null }) =>
        row.discountedPrice != null ? `₹${row.discountedPrice}` : '—',
    },
    {
      header: 'Provider MRP',
      accessor: 'providerMRP',
      cell: (row: { providerMRP: number | null }) =>
        row.providerMRP != null ? `₹${row.providerMRP}` : '—',
    },
    {
      header: 'Provider Discount',
      accessor: 'providerDiscount',
      cell: (row: TableRow) =>
        row.original.providerDiscount != null
          ? `${row.original.providerDiscount}%`
          : '—',
    },
    {
      header: 'Commission',
      accessor: 'providerCommission',
      cell: (row: { providerCommission: string | null }) =>
        row.providerCommission != null ? `${row.providerCommission}` : '—',
    },
    {
      header: 'Provider Price',
      accessor: 'providerPrice',
      cell: (row: TableRow) =>
        row.original.providerPrice != null
          ? `₹${row.original.providerPrice}`
          : '—',
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row: TableData) => (
        <button
          onClick={() => handleUnsubscribe(row.id)}
          disabled={unsubscribing === row.id}
          className={`${unsubscribing === row.id
            ? 'bg-gray-400'
            : 'bg-red-500 hover:bg-red-600'
            } text-white px-4 py-2 rounded-md transition duration-200`}
        >
          {unsubscribing === row.id ? 'Unsubscribing…' : 'Unsubscribe'}
        </button>
      ),
    },
  ];

  return (
    <>
      <PageBreadCrumb pageTitle="My Subscription" />
      <div className="space-y-6">
        <ComponentCard title="Subscribed Services">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>
          <BasicTableOne columns={columns} data={filteredData} />
        </ComponentCard>
      </div>
    </>
  );
};

export default MySubscriptionPage;
