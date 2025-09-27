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
import { FaFileDownload } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { ServiceCustomer } from '../accepted-requests/page';

interface BookingRow {
  _id: string;
  bookingId: string;
  serviceCustomer: ServiceCustomer;
  totalAmount: number;
  paymentStatus: string;
  scheduleDate: string | Date;
  bookingDate: string | Date;
  orderStatus: 'processing' | 'completed' | 'canceled' | string;
  serialNo?: number;
}

const BookingRequests = () => {
  const { provider } = useAuth();
  const { checkouts, loadingCheckouts, errorCheckouts, fetchCheckoutsByProviderId } = useCheckout();
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<BookingRow[]>([]);

  useEffect(() => {
    if (provider?._id) {
      fetchCheckoutsByProviderId(provider._id);
    }
  }, [provider]);

  useEffect(() => {
    // Filter and add serial numbers
    const filtered = checkouts
      .filter((checkout) => checkout.isAccepted === false &&
        (
          checkout.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
          checkout.serviceCustomer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          checkout.serviceCustomer?.email?.toLowerCase().includes(search.toLowerCase())
        )
      )
      .map((checkout, idx) => {
        const customer: ServiceCustomer = checkout.serviceCustomer;
        return {
          bookingId: checkout.bookingId,
          serviceCustomer: customer,
          totalAmount: checkout.totalAmount,
          paymentStatus: checkout.paymentStatus,
          scheduleDate: checkout.createdAt,
          bookingDate: checkout.createdAt,
          orderStatus: checkout.orderStatus,
          _id: checkout._id,
          serialNo: idx + 1, // descending
        };
      })
      .reverse();

    setFilteredData(filtered);
  }, [checkouts, search]);

  // Excel download
  const handleDownload = () => {
    if (filteredData.length === 0) {
      alert('No booking data to download');
      return;
    }

    const dataToExport = filteredData.map((b) => ({
      'S.No': b.serialNo,
      'Booking ID': b.bookingId,
      'Customer Name': b.serviceCustomer.fullName,
      Email: b.serviceCustomer.email,
      'Total Amount': b.totalAmount,
      'Payment Status': b.paymentStatus,
      'Schedule Date': new Date(b.scheduleDate).toLocaleString(),
      'Booking Date': new Date(b.bookingDate).toLocaleString(),
      'Status': b.orderStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Booking Requests');
    XLSX.writeFile(workbook, 'Provider_Booking_Requests.xlsx');
  };

  const columns = [
    { header: 'S.No', accessor: 'serialNo' },
    { header: 'Booking ID', accessor: 'bookingId' },
    {
      header: 'Customer Info',
      accessor: 'customerInfo',
      render: (row: BookingRow) => (
        <div className="text-sm">
          <p className="font-medium text-gray-900">{row.serviceCustomer?.fullName || 'N/A'}</p>
          <p className="text-gray-500">{row.serviceCustomer?.email || ''}</p>
        </div>
      ),
    },
    {
      header: 'Total Amount',
      accessor: 'totalAmount',
      render: (row: BookingRow) => <span className="text-gray-800 font-semibold">₹ {row.totalAmount}</span>,
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
        return <span className={`px-3 py-1 rounded-full text-sm border ${statusColor}`}>{status}</span>;
      },
    },
    {
      header: 'Schedule Date',
      accessor: 'scheduleDate',
      render: (row: BookingRow) =>
        row.scheduleDate ? new Date(row.scheduleDate).toLocaleString() : 'N/A',
    },
    {
      header: 'Booking Date',
      accessor: 'bookingDate',
      render: (row: BookingRow) => new Date(row.bookingDate).toLocaleString(),
    },
    {
      header: 'Status',
      accessor: 'orderStatus',
      render: (row: BookingRow) => {
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
        return <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>{row.orderStatus}</span>;
      },
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row: BookingRow) => (
        <div className="flex gap-2">
          <Link href={`/booking-management/booking-requests/${row._id}`} passHref>
            <button className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white">
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

  return (
    <div>
      <PageBreadcrumb pageTitle="Booking Requests" />
      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex justify-between items-center w-full">
              <span>Booking Requests</span>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                <FaFileDownload className="w-5 h-5" />
                <span>Download Excel</span>
              </button>
            </div>
          }
        >
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search by any field…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
            />
          </div>

          {filteredData.length > 0 ? (
            <BasicTableOne columns={columns} data={filteredData} />
          ) : (
            <p className="text-sm text-gray-500">No booking request data to display.</p>
          )}
        </ComponentCard>
      </div>
    </div>
  );
};

export default BookingRequests;
