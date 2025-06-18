'use client';

import React, { useEffect, useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import BasicTableOne from '@/components/tables/BasicTableOne';
import Input from '@/components/form/input/InputField';
import { useCheckout } from '@/app/context/CheckoutContext';
import { useAuth } from '@/app/context/AuthContext';
import { EyeIcon, PencilIcon, TrashBinIcon } from '@/icons';
import Link from 'next/link';

const BookingRequests = () => {
  const { provider } = useAuth();
  const {
    checkouts,
    loadingCheckouts,
    errorCheckouts,
    fetchCheckoutsByProviderId,
  } = useCheckout();

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (provider?._id) {
      fetchCheckoutsByProviderId(provider._id);
    }
  }, [provider]);

  console.log("checkout : ", checkouts)

  if (loadingCheckouts) return <p>Loading...</p>;
  if (errorCheckouts) return <p>Error: {errorCheckouts}</p>;

  // Filter based on Booking ID
  const filteredCheckouts = checkouts.filter((checkout) =>
    checkout.bookingId?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: 'Booking ID',
      accessor: 'bookingId',
    },
    {
      header: 'Customer Info',
      accessor: 'customerInfo',
      render: (row: any) => {
        console.log("Customer Info Row:", row); // 👈 This will log the entire row object
        return (
          <div className="text-sm">
            <p className="font-medium text-gray-900">{row.serviceCustomer || 'N/A'}</p>
            <p className="text-gray-500">{row.serviceCustomer || ''}</p>
          </div>
        );
      },
    },
    {
      header: 'Total Amount',
      accessor: 'totalAmount',
      render: (row: any) => (
        <span className="text-gray-800 font-semibold">₹ {row.totalAmount}</span>
      ),
    },
    {
      header: 'Payment Status',
      accessor: 'paymentStatus',
      render: (row: any) => {
        const status = row.paymentStatus;
        const statusColor = status === 'paid'
          ? 'bg-green-100 text-green-700 border-green-300'
          : 'bg-yellow-100 text-yellow-700 border-yellow-300';

        return (
          <span className={`px-3 py-1 rounded-full text-sm border ${statusColor}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: 'Schedule Date',
      accessor: 'scheduleDate',
      render: (row: any) => (
        <span>{row.scheduleDate ? new Date(row.scheduleDate).toLocaleString() : 'N/A'}</span>
      ),
    },
    {
      header: 'Booking Date',
      accessor: 'bookingDate',
      render: (row: any) => (
        <span>{new Date(row.bookingDate).toLocaleString()}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'orderStatus',
      render: (row: any) => {
        let colorClass = '';
        switch (row.orderStatus) {
          case 'processing':
            colorClass = 'bg-blue-100 text-blue-700 border border-blue-300';
            break;
          case 'completed':
            colorClass = 'bg-green-100 text-green-700 border border-green-300';
            break;
          case 'canceled':
            colorClass = 'bg-red-100 text-red-700 border border-red-300';
            break;
          default:
            colorClass = 'bg-gray-100 text-gray-700 border border-gray-300';
        }

        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
            {row.orderStatus}
          </span>
        );
      },
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row: any) => {
        console.log('Row data:', row); // 👈 This logs the entire row

        return (
          <div className="flex gap-2">
            <Link href={`/booking-management/booking-requests/${row._id}`} passHref>
              <button className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white hover:border-blue-500">
                <EyeIcon />
              </button>
            </Link>
            <button
              onClick={() => alert(`Editing booking ID: ${row.bookingId}`)}
              className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
            >
              <PencilIcon />
            </button>
            <button
              onClick={() => alert(`Deleting booking ID: ${row.bookingId}`)}
              className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
            >
              <TrashBinIcon />
            </button>
          </div>
        );
      },
    }
  ];

  const data = checkouts.map((checkout: any) => ({
    bookingId: checkout.bookingId,
    serviceCustomer: checkout.serviceCustomer,
    totalAmount: checkout.totalAmount,
    paymentStatus: checkout.paymentStatus,
    scheduleDate: checkout.createdAt, // Replace if you have it
    bookingDate: checkout.createdAt,
    orderStatus: checkout.orderStatus,
    _id: checkout._id,
  }));



  return (
    <div>
      <PageBreadcrumb pageTitle="Booking Requests" />
      <div className="space-y-6">
        <ComponentCard title="Booking Requests">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search by Booking ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
            />
          </div>

          {data.length > 0 ? (
            <BasicTableOne columns={columns} data={data} />
          ) : (
            <p className="text-sm text-gray-500">No booking request data to display.</p>
          )}
        </ComponentCard>
      </div>
    </div>
  );
};

export default BookingRequests;
