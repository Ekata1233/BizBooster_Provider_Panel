'use client';

import React, { useEffect, useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useCheckout } from '@/app/context/CheckoutContext';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';

const BookingRequestDetails = () => {
  const params = useParams();
  const id = params?.id as string;
  const {
    checkoutDetails,
    loadingCheckoutDetails,
    errorCheckoutDetails,
    fetchCheckoutsDetailsById,
  } = useCheckout();

  const [activeTab, setActiveTab] = useState<'details' | 'status'>('details');

  useEffect(() => {
    if (id) {
      fetchCheckoutsDetailsById(id);
    }
  }, [id]);

  if (loadingCheckoutDetails) return <p>Loading...</p>;
  if (errorCheckoutDetails) return <p>Error: {errorCheckoutDetails}</p>;
  if (!checkoutDetails) return <p>No details found.</p>;

  const getStatusLabel = () => {
    if (checkoutDetails.isCompleted) return 'Done';
    if (checkoutDetails.orderStatus === 'processing') return 'Processing';
    return 'Pending';
  };

  console.log("checkout details : ", checkoutDetails)

  return (
    <div>
      <PageBreadcrumb pageTitle="Booking Request Details" />
      <div className="space-y-6">
        <ComponentCard title="Booking Details">
          <div className="flex justify-between items-start p-4">
            {/* Left Info */}
            <div>
              <h2 className="text-lg font-semibold">
                Booking ID: <span className="text-blue-600">{checkoutDetails.bookingId}</span>
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Status: <span className="font-medium">{getStatusLabel()}</span>
              </p>
              <p className="text-sm text-gray-600">
                {/* Placed On: {format(new Date(checkoutDetails.createdAt), 'dd MMM yyyy, hh:mm a')} */}
              </p>
            </div>

            {/* Right - Invoice Button */}
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Download Invoice
            </button>
          </div>
        </ComponentCard>
      </div>


      <div className="space-y-6 my-3">
        <div className="flex gap-4 border-b pb-2 mb-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'status' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('status')}
          >
            Status
          </button>
        </div>

        {activeTab === 'details' && (
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-2/3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Left Side */}
                <div className="flex-1 space-y-2">
                  <p className="text-gray-700">
                    <strong>Payment Method:</strong> {checkoutDetails.paymentMethod?.join(', ')}
                  </p>
                  <p className="text-gray-700">
                    <strong>Total Amount:</strong> ₹{checkoutDetails.totalAmount}
                  </p>
                </div>

                {/* Right Side */}
                <div className="flex-1 space-y-2">
                  <p className="text-gray-700">
                    <strong>Payment Status:</strong> {checkoutDetails.paymentStatus}
                  </p>
                  <p className="text-gray-700">
                    <strong>Schedule Date:</strong>{' '}
                    {checkoutDetails.createdAt
                      ? format(new Date(checkoutDetails.createdAt), 'dd MMMM yy hh:mm a')
                      : 'N/A'}
                  </p>




                </div>
              </div>

              {/* Booking Summary Table */}
              <div className='my-5'>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Booking Summary</h3>
                <table className="w-full table-auto border border-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Service</th>
                      <th className="border px-4 py-2 text-left">Price</th>
                      <th className="border px-4 py-2 text-left">Discount</th>
                      <th className="border px-4 py-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2">Subtotal</td>
                      <td className="border px-4 py-2">₹{checkoutDetails.subtotal}</td>
                      <td className="border px-4 py-2">Subtotal</td>
                      <td className="border px-4 py-2">Subtotal</td>
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Booking Summary Values */}
              <div className="mt-6 space-y-2 text-sm text-gray-800">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal : </span>
                  <span>₹{checkoutDetails.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Discount : </span>
                  <span>₹{checkoutDetails.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Campaign Discount : </span>
                  <span>₹{checkoutDetails.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Coupon Discount : </span>
                  <span>₹{checkoutDetails.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">VAT : </span>
                  <span>₹{checkoutDetails.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Platform Fee : </span>
                  <span>₹{checkoutDetails.subtotal}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2 font-semibold text-base">
                  <span>Grand Total : </span>
                  <span>₹{checkoutDetails.totalAmount}</span>
                </div>
            
              </div>

            </div>




            <div className="w-full lg:w-1/3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="p-8">details booking details (1/3)</h3>
            </div>
          </div>
        )}


        {activeTab === 'status' && (
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-2/3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="p-8">stat booking details (2/3)</h3>
            </div>
            <div className="w-full lg:w-1/3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="p-8">stat booking details (1/3)</h3>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingRequestDetails;
