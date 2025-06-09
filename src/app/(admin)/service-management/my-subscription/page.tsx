'use client';

import React, { useMemo, useState, ChangeEvent } from 'react';           // 🔍 +useState
import { useAuth } from '@/app/context/AuthContext';
import { useService } from '@/app/context/ServiceContext';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import BasicTableOne from '@/components/tables/BasicTableOne';


const MySubscriptionPage = () => {
  const { services, loadingServices, errorServices } = useService();
  const { providerDetails, loading: loadingProvider } = useAuth();
  console.log("service details", services);


  /* ---------- NEW: search term ---------- */
  const [search, setSearch] = useState('');
  const onSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value.toLowerCase());                            // 🔍

  /* ---------- existing: find subscribed services ---------- */
  const subscribedServices = useMemo(() => {
    if (!services || !providerDetails?.data?.subscribedServices?.length) {
      return [];
    }
    const idSet = new Set<string>(providerDetails.data.subscribedServices);
    return services.filter((srv) => idSet.has(srv._id));
  }, [services, providerDetails]);

  /* ---------- NEW: filter by search term across columns ---------- */
  const filteredServices = useMemo(() => {
    if (!search) return subscribedServices;
    return subscribedServices.filter((srv) => {
      const providerEntry = srv.providerPrices?.find(
        (pp: any) => pp.provider?.toString?.() === providerDetails?.data?._id
      );

      // Build one big string to search across every required field
      const haystack = [
        srv.serviceName,
        srv.category?.name,
        srv.subcategory?.name,
        srv.discountedPrice?.toString(),
        providerEntry?.providerPrice?.toString(),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(search);
    });
  }, [search, subscribedServices, providerDetails]);                     // 🔍

  /* ---------- table columns (unchanged) ---------- */
  const columns = [
    { header: 'Service Name', accessor: 'serviceName' },
    {
      header: 'Category',
      accessor: 'category.name',
      cell: (row: any) => row.category?.name || '—',
    },
    {
      header: 'Subcategory',
      accessor: 'subcategory.name',
      cell: (row: any) => row.subcategory?.name || '—',
    },
    {
      header: 'Price',
      accessor: 'discountedPrice',
      cell: (row: any) =>
        row.discountedPrice != null ? `₹${row.discountedPrice}` : '—',
    },
    {
      header: 'Provider Price',
      accessor: 'providerPrice',
      cell: ({ row }: any) => {
        const entry = row.original.providerPrices?.find(
          (pp: any) => pp.provider?.toString?.() === providerDetails?.data?._id
        );
        return entry ? `₹${entry.providerPrice}` : '—';
      },
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

  /* ---------- loading / error guards (unchanged) ---------- */
  if (loadingServices || loadingProvider) {
    return <p className="py-10 text-center text-sm text-gray-500">Loading…</p>;
  }
  if (errorServices) {
    return <p className="py-10 text-center text-red-500">{errorServices}</p>;
  }

  /* ---------- UI ---------- */
  return (
    <div>
      <PageBreadcrumb pageTitle="My Subscription" />
      <div className="space-y-6">
        <ComponentCard title="Subscribed Services">
          {/* 🔍 Search box */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search services…"
              value={search}
              onChange={onSearch}
              className="w-full  rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
            />
          </div>


          {/* Table */}
          {filteredServices.length === 0 ? (
            <p className="text-sm text-gray-500">No matching subscriptions.</p>
          ) : (
            <BasicTableOne columns={columns} data={filteredServices} />
          )}
        </ComponentCard>
      </div>
    </div>
  );
};

export default MySubscriptionPage;
