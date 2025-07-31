'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useService } from '@/app/context/ServiceContext';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import BasicTableOne from '@/components/tables/BasicTableOne';

interface TableData {
  id: string;
  serviceName: string;
  categoryName: string;
  subCategoryName: string;
  discountedPrice: number | null;
  providerPrice: number | null;
  status: string;
}

interface ProviderPrice {
  provider?: { _id: string };
  providerPrice: number;
}


const MySubscriptionPage = () => {
  const { services, loadingServices, errorServices } = useService();
  const { providerDetails, refreshProviderDetails } = useAuth();
  console.log("proivder details: ", providerDetails)

  const [tableData, setTableData] = useState<TableData[]>([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [unsubscribing, setUnsubscribing] = useState<string | null>(null);


  /* Flatten services to tableData when services or providerDetails change */
  useEffect(() => {
    if (!services || !providerDetails?.subscribedServices?.length) {
      setTableData([]);
      return;
    }

    const idSet = new Set<string>(
      (providerDetails.subscribedServices as unknown as { _id: string }[]).map((s) => s._id)
    );

    const flattened = services
      .filter((srv) => idSet.has(srv._id))
      .map((srv) => {
        const providerPrices = (srv as { providerPrices?: ProviderPrice[] }).providerPrices;

        const providerEntry = providerPrices?.find(
          (pp) => pp.provider?._id === providerDetails?._id
        );

        return {
          id: srv._id,
          serviceName: srv.serviceName,
          categoryName: srv.category?.name || '—',
          subCategoryName: srv.subcategory?.name || '—',
          discountedPrice: srv.discountedPrice ?? null,
          providerPrice: providerEntry?.providerPrice ?? null,
          status: 'Subscribed',
        };
      });

    setTableData(flattened);
  }, [services, providerDetails]);

  /* Filter tableData on search term */
  useEffect(() => {
    if (!search) {
      setFilteredData(tableData);
      return;
    }

    const lowerSearch = search.toLowerCase();
    const filtered = tableData.filter((item) => {
      const haystack = [
        item.serviceName,
        item.categoryName,
        item.subCategoryName,
        item.discountedPrice?.toString() ?? '',
        item.providerPrice?.toString() ?? '',
        item.status,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(lowerSearch);
    });

    setFilteredData(filtered);
  }, [search, tableData]);

  const handleUnsubscribe = async (serviceId: string) => {
    if (!providerDetails?._id) return;

    setUnsubscribing(serviceId);
    try {
      const response = await fetch('https://biz-booster.vercel.app/api/provider/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId: providerDetails._id,
          serviceId,
        }),
      });

      const data = await response.json();

      if (data.ok && data.success) {
        await refreshProviderDetails(); // ✅ ← this refetches updated data
        setTableData((prev) => prev.filter((item) => item.id !== serviceId));
      } else {
        console.error("Unsubscribe failed:", data.message);
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Unsubscribe failed');
      }


    } catch (error) {
      console.error('Unsubscribe error:', error);
      alert('Failed to unsubscribe. Please try again.');
    } finally {
      setUnsubscribing(null);
    }
  };


  const onSearch = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  /* Table columns */
  const columns = [
    { header: 'Service Name', accessor: 'serviceName' },
    { header: 'Category', accessor: 'categoryName' },
    { header: 'Subcategory', accessor: 'subCategoryName' },
    {
      header: 'Price',
      accessor: 'discountedPrice',
      cell: (row: { discountedPrice: number | null }) =>
        row.discountedPrice != null ? `₹${row.discountedPrice}` : '—',
    },

    {
      header: 'Provider Price',
      accessor: 'providerPrice',
      cell: (row: { providerPrice: number | null }) =>
        row.providerPrice != null ? `₹${row.providerPrice}` : '—',
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row: TableData) => (
        <button
          onClick={() => handleUnsubscribe(row.id)}
          disabled={unsubscribing === row.id}
          className={`${unsubscribing === row.id ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
            } text-white px-4 py-2 rounded-md transition duration-200`}
        >
          {unsubscribing === row.id ? 'Unsubscribing…' : 'Unsubscribe'}
        </button>
      ),
    },
  ];

  if (loadingServices) {
    return (
      <p className="py-10 text-center text-sm text-gray-500">Loading…</p>
    );
  }
  if (errorServices) {
    return (
      <p className="py-10 text-center text-red-500">{errorServices}</p>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="My Subscription" />
      <div className="space-y-6">
        <ComponentCard title="Subscribed Services">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search services…"
              value={search}
              onChange={onSearch}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
            />
          </div>

          {filteredData.length === 0 ? (
            <p className="text-sm text-gray-500">No matching subscriptions.</p>
          ) : (
            <BasicTableOne columns={columns} data={filteredData} />
          )}
        </ComponentCard>
      </div>
    </div>
  );
};

export default MySubscriptionPage;
