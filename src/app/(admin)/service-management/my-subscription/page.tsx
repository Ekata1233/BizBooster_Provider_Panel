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

const MySubscriptionPage = () => {
  const { services, loadingServices, errorServices } = useService();
  const { providerDetails } = useAuth();

  const [tableData, setTableData] = useState<TableData[]>([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<TableData[]>([]);

  /* Flatten services to tableData when services or providerDetails change */
  useEffect(() => {
    if (!services || !providerDetails?.subscribedServices?.length) {
      setTableData([]);
      return;
    }

    const idSet = new Set<string>(providerDetails.subscribedServices);

    const flattened = services
      .filter((srv) => idSet.has(srv._id))
      .map((srv) => {
        // find the providerPrice entry for this provider
        const providerEntry = srv.providerPrices?.find(
          (pp: any) => pp.provider?._id === providerDetails?._id
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

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  /* Table columns */
  const columns = [
    { header: 'Service Name', accessor: 'serviceName' },
    { header: 'Category', accessor: 'categoryName' },
    { header: 'Subcategory', accessor: 'subCategoryName' },
    {
      header: 'Price',
      accessor: 'discountedPrice',
      cell: (row: any) =>
        row.discountedPrice != null ? `₹${row.discountedPrice}` : '—',
    },
    {
      header: 'Provider Price',
      accessor: 'providerPrice',
      cell: (row: any) =>
        row.providerPrice != null ? `₹${row.providerPrice}` : '—',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: () => (
        <button
          disabled
          className="bg-green-500 text-white px-3 py-1 text-xs rounded shadow cursor-not-allowed"
        >
          Subscribed
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
