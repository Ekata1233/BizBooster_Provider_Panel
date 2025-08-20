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
import { ServiceCustomer } from '../accepted-requests/page';
import { useLead } from '@/app/context/LeadContext';

type BookingRow = {
  _id: string;
  bookingId: string;
  serviceCustomer: ServiceCustomer;
  totalAmount: number;
  paymentStatus: 'paid' | 'unpaid' | string;
  scheduleDate: string | Date | null;
  bookingDate: string | Date;
  orderStatus: 'processing' | 'completed' | 'canceled' | string;
};

const RefundedRequest = () => {
  const { provider } = useAuth();
   const { leads, refetchLeads } = useLead();
  const {
    checkouts,
    loadingCheckouts,
    errorCheckouts,
    fetchCheckoutsByProviderId,
  } = useCheckout();

  const [search, setSearch] = useState('');
  useEffect(() => {
    refetchLeads();
  }, []);

  console.log("Leads....:", leads);

  useEffect(() => {
    if (provider?._id) {
      fetchCheckoutsByProviderId(provider._id);
    }
  }, [provider]);

  console.log('checkout : ', checkouts);

  if (loadingCheckouts) return <p>Loading...</p>;
  if (errorCheckouts) return <p>Error: {errorCheckouts}</p>;

  const columns = [
    {
      header: 'Booking ID',
      accessor: 'bookingId',
    },
    {
      header: 'Customer Info',
      accessor: 'customerInfo',
      render: (row: BookingRow) => {
        console.log('Customer Info Row:', row);
        return (
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {row.serviceCustomer?.fullName || 'N/A'}
            </p>
            <p className="text-gray-500">{row.serviceCustomer?.email || ''}</p>
          </div>
        );
      },
    },
    {
      header: 'Total Amount',
      accessor: 'totalAmount',
      render: (row: BookingRow) => (
        <span className="text-gray-800 font-semibold">₹ {row.totalAmount}</span>
      ),
    },
    {
      header: 'Payment Status',
      accessor: 'paymentStatus',
      render: (row: BookingRow) => {
        const status = row.paymentStatus;
        const statusColor =
          status === 'paid'
            ? 'bg-green-100 text-green-700 border-green-300'
            : 'bg-yellow-100 text-yellow-700 border-yellow-300';

        return (
          <span
            className={`px-3 py-1 rounded-full text-sm border ${statusColor}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: 'Schedule Date',
      accessor: 'scheduleDate',
      render: (row: BookingRow) => (
        <span>
          {row.scheduleDate
            ? new Date(row.scheduleDate).toLocaleString()
            : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Booking Date',
      accessor: 'bookingDate',
      render: (row: BookingRow) => (
        <span>{new Date(row.bookingDate).toLocaleString()}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'orderStatus',
      render: (row: BookingRow) => {
        let colorClass = '';
        switch (row.orderStatus) {
          case 'processing':
            colorClass =
              'bg-blue-100 text-blue-700 border border-blue-300';
            break;
          case 'completed':
            colorClass =
              'bg-green-100 text-green-700 border border-green-300';
            break;
          case 'canceled':
          case 'cancelled': // in case API sends British spelling
            colorClass =
              'bg-red-100 text-red-700 border border-red-300';
            break;
          default:
            colorClass =
              'bg-gray-100 text-gray-700 border border-gray-300';
        }

        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
          >
            {row.orderStatus}
          </span>
        );
      },
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row: BookingRow) => (
        <div className="flex gap-2">
          <Link
            href={`/booking-management/canceled-requests/${row._id}`}
            passHref
          >
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
      ),
    },
  ];


  // ✅ Only show bookings with at least one lead having statusType "Refund"
  // ✅ Only show leads with at least one statusType === "Refund"
  const data: BookingRow[] = leads
    .filter((leadItem) =>
      Array.isArray(leadItem.leads) &&
      leadItem.leads.some((lead) => lead.statusType === "Refund")
    )
    .map((leadItem) => {
      const checkoutObj = leadItem.checkout as unknown as {
        bookingId: string;
        serviceCustomer: ServiceCustomer;
        totalAmount: number;
        paymentStatus: string;
        scheduleDate?: string | Date;
        bookingDate?: string | Date;
        createdAt: string | Date;
        orderStatus: string;
      };

      return {
        bookingId: checkoutObj.bookingId,
        serviceCustomer: checkoutObj.serviceCustomer,
        totalAmount: checkoutObj.totalAmount,
        paymentStatus: checkoutObj.paymentStatus,
        scheduleDate: checkoutObj.scheduleDate ?? checkoutObj.createdAt,
        bookingDate: checkoutObj.bookingDate ?? checkoutObj.createdAt,
        orderStatus: checkoutObj.orderStatus,
        _id: leadItem._id ?? "",
      };
    })
    .reverse();


  return (
    <div>
      <PageBreadcrumb pageTitle="Canceled Request" />
      <div className="space-y-6">
        <ComponentCard title="Canceled Request">
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
            <p className="text-sm text-gray-500">
              No cancel request data to display.
            </p>
          )}
        </ComponentCard>
      </div>
    </div>
  );
};

export default RefundedRequest;
