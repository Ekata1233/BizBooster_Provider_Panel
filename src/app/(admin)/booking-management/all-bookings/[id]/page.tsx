'use client';
import React, { useEffect, useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useCheckout } from '@/app/context/CheckoutContext';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { useServiceCustomer } from '@/app/context/ServiceCustomerContext';
import { useServiceMan } from '@/app/context/ServiceManContext';
import { useAuth } from '@/app/context/AuthContext';
import CustomerInfoCard from '@/components/booking-management/CustomerInfoCard';
import ServiceMenListCard from '@/components/booking-management/ServiceMenListCard';
import BookingStatus from '@/components/booking-management/BookingStatus';
import { useModal } from '@/hooks/useModal';
import { LeadType, useLead } from '@/app/context/LeadContext';
import UpdateStatusModal from '@/components/booking-management/UpdateStatusModal';
import UpdateEditLead from '@/components/booking-management/UpdateEditLead';
import InvoiceDownload from '@/components/booking-management/InvoiceDownload';

const AllBookingsDetails = () => {
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'status'>('details');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { isOpen, openModal, closeModal } = useModal();
  const { provider } = useAuth();
  const { serviceMenByProvider, fetchServiceMenByProvider } = useServiceMan();
  const { createLead, loadingLeads, } = useLead();
  const visibleServiceMen = showAll ? serviceMenByProvider : serviceMenByProvider.slice(0, 2);

  const params = useParams();
  const id = params?.id as string;

  const {
    checkoutDetails,
    loadingCheckoutDetails,
    errorCheckoutDetails,
    fetchCheckoutsDetailsById,
  } = useCheckout();

  const { getLeadByCheckoutId } = useLead();
  const [lead, setLead] = useState<LeadType | null>(null);

  useEffect(() => {
  const fetchLead = async () => {
    if (!checkoutDetails?._id) return;

    try {
      const fetchedLead = await getLeadByCheckoutId(checkoutDetails._id);

      if (!fetchedLead) {
        console.warn("No lead found for ID:", checkoutDetails._id);
        return;
      }

      setLead(fetchedLead);
    } catch (error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { status?: number } }).response?.status === "number" &&
    (error as { response: { status: number } }).response.status === 404
  ) {
    console.warn("Lead not found (404) for ID:", checkoutDetails._id);
  } else {
    const errorMessage =
      typeof error === "object" &&
      error !== null &&
      "message" in error
        ? String((error as { message?: unknown }).message)
        : String(error);

    console.error("Error fetching lead:", errorMessage);
  }
}

  };

  fetchLead();
}, [checkoutDetails]);


  const {
    fetchServiceCustomer,
    serviceCustomer,
    loading,
    error,
  } = useServiceCustomer();

  // Fetch checkout by ID
  useEffect(() => {
    if (id) fetchCheckoutsDetailsById(id);
  }, [id]);

  // Fetch service customer
  useEffect(() => {
    if (checkoutDetails?.serviceCustomer) {
      fetchServiceCustomer(checkoutDetails.serviceCustomer);
    }
  }, [checkoutDetails]);

  // Fetch service men
  useEffect(() => {
    if (provider?._id) {
      fetchServiceMenByProvider(provider._id);
    }
  }, [provider]);

  const getStatusLabel = () => {
    if (checkoutDetails?.isCompleted) return 'Done';
    if (checkoutDetails?.orderStatus === 'processing') return 'Processing';
    return 'Pending';
  };
  const getStatusColor = () => {
    const status = checkoutDetails?.paymentStatus?.toLowerCase();
    if (status === 'paid') return 'text-green-600';
    if (status === 'failed') return 'text-red-600';
    return 'text-blue-600'; // default for pending or other statuses
  };

    const hasExtraServices =
    lead?.isAdminApproved === true &&
    Array.isArray(lead?.extraService) &&
    lead.extraService.length > 0;
  const formatPrice = (amount: number) => `₹${amount?.toFixed(2)}`;
  const baseAmount = lead?.newAmount ?? checkoutDetails?.totalAmount ?? 0;
  const extraAmount = lead?.extraService?.reduce((sum, service) => sum + (service.total || 0), 0) ?? 0;
  const grandTotal = baseAmount + extraAmount;

  if (loadingCheckoutDetails) return <p>Loading...</p>;
  if (errorCheckoutDetails) return <p>Error: {errorCheckoutDetails}</p>;
  if (!checkoutDetails) return <p>No details found.</p>;



  return (
    <div>
      <PageBreadcrumb pageTitle="All Bookings Details" />

      <div className="space-y-6">
        {/* Booking Summary Header */}
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
              <button
                className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-900 transition duration-300"
                onClick={() => setIsEditOpen(true)}
              >
                Edit Lead
              </button>

              {isEditOpen && (
                <UpdateEditLead
                  isOpen={isEditOpen}
                  closeModal={() => setIsEditOpen(false)}
                  checkoutId={checkoutDetails._id}
                />
              )}

              <InvoiceDownload
                leadDetails={lead}
                checkoutDetails={checkoutDetails}
                serviceCustomer={serviceCustomer}
              />
            </div>

          </div>
        </ComponentCard>

        {/* Tabs */}
        <div className="flex gap-4 border-b pb-2 mb-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
              }`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'status' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
              }`}
            onClick={() => setActiveTab('status')}
          >
            Status
          </button>
        </div>

        {/* Tab: Details */}
        {activeTab === 'details' && (
          <div className="flex flex-col lg:flex-row gap-4">
            {/* LEFT SIDE */}
            <div className="w-full lg:w-2/3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
              {/* Payment Info */}
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
                    {checkoutDetails.createdAt
                      ? format(new Date(checkoutDetails.createdAt), 'dd MMMM yy hh:mm a')
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <hr className="my-4 border-gray-300 dark:border-gray-700" />
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
                      <td className="border px-4 py-2">{checkoutDetails?.service?.serviceName || 'N/A'}</td>
                      <td className="border px-4 py-2">{formatPrice(lead?.newAmount ?? checkoutDetails?.service?.price ?? 0)}</td>
                      <td className="border px-4 py-2">
                        {lead?.newAmount != null
                          ? '₹0'
                          : `₹${checkoutDetails?.service?.discountedPrice || 0}`}
                      </td>
                      <td className="border px-4 py-2">{formatPrice(lead?.newAmount ?? checkoutDetails?.totalAmount ?? 0)}</td>
                    </tr>
                  </tbody>
                </table>

                  {hasExtraServices && (
                  <>
                    <h4 className="text-sm font-semibold text-gray-700 my-3">Extra Services</h4>
                    <table className="w-full table-auto border border-gray-200 text-sm mb-5">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-4 py-2 text-left">SL</th>
                          <th className="border px-4 py-2 text-left">Service Name</th>
                          <th className="border px-4 py-2 text-left">Price</th>
                          <th className="border px-4 py-2 text-left">Discount</th>
                          <th className="border px-4 py-2 text-left">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lead!.extraService!.map((service, index) => (
                          <tr key={index}>
                            <td className="border px-4 py-2 text-left">{index + 1}</td>
                            <td className="border px-4 py-2 text-left">{service.serviceName}</td>
                            <td className="border px-4 py-2 text-left">{formatPrice(service.price)}</td>
                            <td className="border px-4 py-2 text-left">{formatPrice(service.discount)}</td>
                            <td className="border px-4 py-2 text-left">{formatPrice(service.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>

              {/* Summary Values */}
              <div className="mt-6 space-y-2 text-sm text-gray-800">
                {[
                  ['Subtotal', checkoutDetails.subtotal],
                  ['Discount', checkoutDetails.serviceDiscount],
                  ['Campaign Discount', 0],
                  ['Coupon Discount', checkoutDetails.couponDiscount || 0],
                  ['VAT', 0],
                  ['Platform Fee', 0],
                ].map(([label, amount]) => (
                  <div className="flex justify-between" key={label}>
                    <span className="font-medium">{label} :</span>
                    <span>₹{amount}</span>
                  </div>
                ))}
                {lead?.extraService?.map((service, index) => (
                  <div key={index} className="flex justify-between font-semibold">
                    <span>Extra Service</span>
                    <span>{formatPrice(service.total)}</span>
                  </div>
                ))}

                <div className="flex justify-between font-bold text-blue-600">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal || 0)}</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-1/3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="px-8 py-6 bg-gray-100 m-3 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Booking Setup</h4>
                <hr className="my-4 border-gray-300 dark:border-gray-700" />
                <button onClick={openModal} className="bg-red-500 text-white px-7  py-2 rounded-md hover:bg-red-600 transition duration-200">
                  Update Status
                </button>

              </div>

              <CustomerInfoCard serviceCustomer={serviceCustomer} loading={loading} error={error} />
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
            <div className="w-full lg:w-2/3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
              {/* Payment Info */}
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <p className="text-gray-700"><strong>Payment Method:</strong> {checkoutDetails.paymentMethod?.join(', ')}</p>
                  <p className="text-gray-700"><strong>Total Amount:</strong> ₹{checkoutDetails.totalAmount}</p>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-gray-700"><strong>Payment Status:</strong> {checkoutDetails.paymentStatus}</p>
                  <p className="text-gray-700">
                    <strong>Schedule Date:</strong>{' '}
                    {checkoutDetails.createdAt
                      ? format(new Date(checkoutDetails.createdAt), 'dd MMMM yy hh:mm a')
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <hr className="my-4 border-gray-300 dark:border-gray-700" />
              <BookingStatus checkout={checkoutDetails} />
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-1/3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <CustomerInfoCard serviceCustomer={serviceCustomer} loading={loading} error={error} />
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

      <div>
        <UpdateStatusModal
          isOpen={isOpen}
          onClose={closeModal}
          onSubmit={async (formData) => {
            try {
              await createLead(formData);
              alert("Lead status updated Successfully.");
              closeModal();
            } catch (err) {
              console.error("Failed to save lead:", err);
              // ✅ `err` is now the message string
              alert(err || "Failed to save lead status.");
            }
          }}
          checkoutId={checkoutDetails._id}
          serviceCustomerId={checkoutDetails.serviceCustomer}
          serviceManId={checkoutDetails.serviceMan ?? ""}
          serviceId={checkoutDetails.service?._id ?? ""}
          amount={checkoutDetails.totalAmount?.toString() || "000"}
          loading={loadingLeads}
        />

      </div>

    </div>
  );
};

export default AllBookingsDetails;
