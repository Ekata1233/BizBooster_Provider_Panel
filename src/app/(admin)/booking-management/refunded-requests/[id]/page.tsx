'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import CustomerInfoCard from '@/components/booking-management/CustomerInfoCard';
import ServiceMenListCard from '@/components/booking-management/ServiceMenListCard';
import { useCheckout } from '@/app/context/CheckoutContext';
import { useLead, LeadType } from '@/app/context/LeadContext';
import { useServiceCustomer } from '@/app/context/ServiceCustomerContext';
import { useServiceMan } from '@/app/context/ServiceManContext';
import { useAuth } from '@/app/context/AuthContext';

const RefundedRequestDetails = () => {
  const params = useParams();
  const id = params?.id as string;

  const { provider } = useAuth();
  const { checkoutDetails, loadingCheckoutDetails, errorCheckoutDetails, fetchCheckoutsDetailsById } = useCheckout();
  const { getLeadByCheckoutId } = useLead();
  const { fetchServiceCustomer, serviceCustomer, loading: loadingCustomer, error: errorCustomer } = useServiceCustomer();
  const { serviceMenByProvider, fetchServiceMenByProvider } = useServiceMan();

  const [lead, setLead] = useState<LeadType | null>(null);
  console.log(lead)
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'status'>('details');

  const visibleServiceMen = showAll ? serviceMenByProvider : serviceMenByProvider.slice(0, 2);

  // Fetch checkout details by ID
  useEffect(() => {
    if (id) fetchCheckoutsDetailsById(id);
  }, [id]);

  // Fetch lead based on checkout
  useEffect(() => {
    const fetchLead = async () => {
      if (!checkoutDetails?._id) return;
      try {
        const fetchedLead = await getLeadByCheckoutId(checkoutDetails._id);
        setLead(fetchedLead ?? null);
      } catch (err) {
        console.error('Error fetching lead:', err);
      }
    };
    fetchLead();
  }, [checkoutDetails]);

  // Fetch service customer
  useEffect(() => {
    const customerId = checkoutDetails?.serviceCustomer?._id || (typeof checkoutDetails?.serviceCustomer === 'string' ? checkoutDetails.serviceCustomer : null);
    if (customerId) fetchServiceCustomer(customerId);
  }, [checkoutDetails]);

  // Fetch service men for provider
  useEffect(() => {
    if (provider?._id) fetchServiceMenByProvider(provider._id);
  }, [provider]);

  // Helper: Status Label & Color
  const getStatusLabel = () => {
    if (checkoutDetails?.isCompleted) return 'Done';
    if (checkoutDetails?.orderStatus === 'processing') return 'Processing';
    return 'Pending';
  };
  const getStatusColor = () => {
    const status = checkoutDetails?.paymentStatus?.toLowerCase();
    if (status === 'paid') return 'text-green-600';
    if (status === 'failed') return 'text-red-600';
    return 'text-blue-600';
  };

  // Download invoice
  const handleDownloadInvoice = async () => {
    if (!checkoutDetails?._id) return;
    try {
      const response = await fetch(`https://api.fetchtrue.com/api/invoice/${checkoutDetails._id}`);
      if (!response.ok) throw new Error('Failed to fetch invoice');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${checkoutDetails.bookingId || checkoutDetails._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Invoice download error:', error);
      alert('Failed to download invoice.');
    }
  };

  if (loadingCheckoutDetails) return <p>Loading checkout details...</p>;
  if (errorCheckoutDetails) return <p>Error: {errorCheckoutDetails}</p>;
  if (!checkoutDetails) return <p>No checkout details found.</p>;

  return (
    <div>
      <PageBreadcrumb pageTitle="Refunded Booking Details" />

      <div className="space-y-6">
        {/* Booking Header */}
        <ComponentCard title="Booking Details">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">
                Booking ID: <span className="text-blue-600">{checkoutDetails.bookingId}</span>
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Status: <span className="font-medium">{getStatusLabel()}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2 mt-4">
              <button onClick={handleDownloadInvoice} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Download Invoice
              </button>
            </div>
          </div>
        </ComponentCard>

        {/* Tabs */}
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

        {/* Tab: Details */}
        {activeTab === 'details' && (
          <div className="flex flex-col lg:flex-row gap-4">
            {/* LEFT SIDE */}
            <div className="w-full lg:w-2/3 rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <p className="text-gray-700"><strong>Payment Method:</strong> {checkoutDetails.paymentMethod?.join(', ')}</p>
                  <p className="text-gray-700"><strong>Total Amount:</strong> ₹{checkoutDetails.totalAmount}</p>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-gray-700"><strong>Payment Status:</strong> <span className={getStatusColor()}>{checkoutDetails.paymentStatus}</span></p>
                  <p className="text-gray-700">
                    <strong>Schedule Date:</strong>{' '}
                    {checkoutDetails.createdAt ? format(new Date(checkoutDetails.createdAt), 'dd MMMM yy hh:mm a') : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Booking Table */}
              <div className="my-5">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Booking Summary</h3>
                <table className="w-full table-auto border border-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Service</th>
                      <th className="border px-4 py-2 text-left">Price</th>
                      <th className="border px-4 py-2 text-left">Discount Price</th>
                      <th className="border px-4 py-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2">{checkoutDetails?.service?.serviceName || "N/A"}</td>
                      <td className="border px-4 py-2">₹{checkoutDetails?.service?.price}</td>
                      <td className="border px-4 py-2">₹{checkoutDetails?.service?.discountedPrice}</td>
                      <td className="border px-4 py-2">₹{checkoutDetails?.totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-1/3 rounded-2xl border border-gray-200 bg-white p-6">
              <CustomerInfoCard serviceCustomer={serviceCustomer} loading={loadingCustomer} error={errorCustomer} />
              <ServiceMenListCard
                checkoutId={checkoutDetails?._id}
                visibleServiceMen={visibleServiceMen}
                totalServiceMen={serviceMenByProvider.length}
                showAll={showAll}
                setShowAll={setShowAll}
              />
            </div>
          </div>
        )}

        {/* Tab: Status */}
        {activeTab === 'status' && (
          <div className="flex flex-col lg:flex-row gap-4">
            {/* LEFT SIDE */}
            <div className="w-full lg:w-2/3 rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment & Status</h3>
              <p><strong>Payment Status:</strong> {checkoutDetails.paymentStatus}</p>
              <p><strong>Order Status:</strong> {checkoutDetails.orderStatus}</p>
              <p><strong>Completed:</strong> {checkoutDetails.isCompleted ? 'Yes' : 'No'}</p>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-1/3 rounded-2xl border border-gray-200 bg-white p-6">
              <CustomerInfoCard serviceCustomer={serviceCustomer} loading={loadingCustomer} error={errorCustomer} />
              <ServiceMenListCard
                visibleServiceMen={visibleServiceMen}
                totalServiceMen={serviceMenByProvider.length}
                showAll={showAll}
                setShowAll={setShowAll}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefundedRequestDetails;
