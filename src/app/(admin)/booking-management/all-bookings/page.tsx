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
import * as XLSX from 'xlsx';
import { FaFileDownload } from 'react-icons/fa';

interface ServiceCustomer {
  fullName: string;
  email: string;
  city?: string; 
}

interface BookingRow {
  _id: string;
  bookingId: string;
  serviceCustomer: ServiceCustomer;
  totalAmount: number;
  paymentStatus: string;
  scheduleDate?: string;
  bookingDate: string;
  orderStatus: string;
  isPartialPayment?: boolean;
  paidAmount?: number;
  serialNo?: number; // ✅ Add serialNo
}

const AllBookings = () => {
  const { provider } = useAuth();
  const { checkouts, loadingCheckouts, errorCheckouts, fetchCheckoutsByProviderId } = useCheckout();
  const [search, setSearch] = useState('');
  // const [currentPage, setCurrentPage] = useState(1);
  // const rowsPerPage = 10;

  useEffect(() => {
    if (provider?._id) fetchCheckoutsByProviderId(provider._id);
  }, [provider]);

  if (loadingCheckouts) return <p>Loading...</p>;
  if (errorCheckouts) return <p>Error: {errorCheckouts}</p>;

  // ✅ Filter data across multiple fields
  // First filter
const filteredCheckouts = [...checkouts]
  .reverse()
  .filter(
    (checkout) =>
      checkout.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
      checkout.serviceCustomer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      checkout.serviceCustomer?.email?.toLowerCase().includes(search.toLowerCase()) ||
       (checkout.serviceCustomer?.city ?? '').toLowerCase().includes(search.toLowerCase()) || // ✅ fix
      String(checkout.totalAmount || checkout.grandTotal)?.includes(search)
  );

// Then map with serial numbers
const filteredData: BookingRow[] = filteredCheckouts.map((checkout, idx) => ({
  bookingId: checkout.bookingId,
  serviceCustomer: checkout.serviceCustomer as ServiceCustomer,
  totalAmount:
    Number(checkout.grandTotal ?? 0) > 0 ? Number(checkout.grandTotal) : Number(checkout.totalAmount),
  paymentStatus: checkout.paymentStatus,
  scheduleDate: checkout.createdAt,
  bookingDate: checkout.createdAt,
  orderStatus: checkout.orderStatus,
  _id: checkout._id,
  isPartialPayment: checkout.isPartialPayment as boolean | undefined,
  paidAmount: checkout.paidAmount,
  serialNo: filteredCheckouts.length - idx, 

}));


  const columns = [
    { header: 'S.No', accessor: 'serialNo' }, // ✅ Serial number column
    { header: 'Booking ID', accessor: 'bookingId' },
    {
      header: 'Customer Info',
      accessor: 'customerInfo',
      render: (row: BookingRow) => (
        <div className="text-sm">
          <p className="font-medium text-gray-900">{row.serviceCustomer?.fullName || 'N/A'}</p>
          <p className="text-gray-500">{row.serviceCustomer?.email || ''}</p>
          <p className="text-gray-500">{row.serviceCustomer?.city || ''}</p>
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
        let status = row.paymentStatus;
        if (row.paidAmount === 0) status = 'unpaid';
        else if (row.isPartialPayment) status = 'partpay';
        const statusColor =
          status === 'paid'
            ? 'bg-green-100 text-green-700 border-green-300'
            : status === 'unpaid'
            ? 'bg-red-100 text-red-700 border-red-300'
            : status === 'partpay'
            ? 'bg-purple-100 text-purple-700 border-purple-300'
            : 'bg-yellow-100 text-yellow-700 border-yellow-300';
        return <span className={`px-3 py-1 rounded-full text-sm border ${statusColor}`}>{status}</span>;
      },
    },
    {
      header: 'Schedule Date',
      accessor: 'scheduleDate',
      render: (row: BookingRow) => <span>{row.scheduleDate ? new Date(row.scheduleDate).toLocaleString() : 'N/A'}</span>,
    },
    {
      header: 'Booking Date',
      accessor: 'bookingDate',
      render: (row: BookingRow) => <span>{new Date(row.bookingDate).toLocaleString()}</span>,
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
          case 'cancelled':
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
          <Link href={`/booking-management/all-bookings/${row._id}`} passHref>
            <button className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white hover:border-blue-500">
              <EyeIcon />
            </button>
          </Link>
          {/* <button
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
          </button> */}
        </div>
      ),
    },
  ];

  // ✅ Excel download
  const handleDownload = () => {
    if (filteredData.length === 0) {
      alert('No booking data available');
      return;
    }
    const dataToExport = filteredData.map((b) => ({
      'S.No': b.serialNo,
      'Booking ID': b.bookingId,
      'Customer Name': b.serviceCustomer?.fullName,
      Email: b.serviceCustomer?.email,
      City: b.serviceCustomer?.city,
      'Total Amount': b.totalAmount,
      'Payment Status': b.paymentStatus,
      'Schedule Date': b.scheduleDate ? new Date(b.scheduleDate).toLocaleString() : 'N/A',
      'Booking Date': new Date(b.bookingDate).toLocaleString(),
      Status: b.orderStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'All Bookings');
    XLSX.writeFile(workbook, 'Provider_All_Bookings.xlsx');
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="All Bookings" />
      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex justify-between items-center w-full">
              <span>All Bookings</span>
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
            <p className="text-sm text-gray-500">No booking data to display.</p>
          )}
        </ComponentCard>
      </div>
    </div>
  );
};

export default AllBookings;
