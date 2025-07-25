'use client';
import React, { useEffect, useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useCheckout } from '@/app/context/CheckoutContext';
import { useParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const { provider } = useAuth();
  const { serviceMenByProvider, fetchServiceMenByProvider } = useServiceMan();
  const { createLead, loadingLeads } = useLead();
  const visibleServiceMen = showAll ? serviceMenByProvider : serviceMenByProvider.slice(0, 2);
  const [lead, setLead] = useState<LeadType | null>(null);
  console.log("lead details for distribution : ", lead)


  const params = useParams();
  const id = params?.id as string;

  const {
    checkoutDetails,
    loadingCheckoutDetails,
    errorCheckoutDetails,
    fetchCheckoutsDetailsById,
    updateCheckoutById, loadingUpdate,
  } = useCheckout();

  const { getLeadByCheckoutId } = useLead();



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

  console.log("custiner info : ", serviceCustomer)
  // Fetch checkout by ID
  useEffect(() => {
    if (id) fetchCheckoutsDetailsById(id);
  }, [id]);

  // Fetch service customer
  // useEffect(() => {
  //   console.log("--------",checkoutDetails?.serviceCustomer)
  //   if (checkoutDetails?.serviceCustomer) {
  //     fetchServiceCustomer(checkoutDetails.serviceCustomer?._id );
  //   }
  // }, [checkoutDetails]);

  useEffect(() => {
    const customer = checkoutDetails?.serviceCustomer;

    if (customer) {
      const customerId = typeof customer === 'string' ? customer : customer._id;
      if (customerId) {
        fetchServiceCustomer(customerId);
      }
    }
  }, [checkoutDetails]);

  // Fetch service men
  useEffect(() => {
    if (provider?._id) {
      fetchServiceMenByProvider(provider._id);
    }
  }, [provider]);

  const getStatusStyle = () => {
    if (checkoutDetails?.isCompleted)
      return { label: 'Completed', color: 'text-green-700 border-green-400 bg-green-50' };
    if (checkoutDetails?.orderStatus === 'processing')
      return { label: 'Processing', color: 'text-yellow-700 border-yellow-400 bg-yellow-50' };
    return { label: 'Pending', color: 'text-gray-700 border-gray-400 bg-gray-50' };
  };

  const status = getStatusStyle();

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
  const baseAmount = lead?.afterDicountAmount ?? checkoutDetails?.totalAmount ?? 0;
  const extraAmount = lead?.extraService?.reduce((sum, service) => sum + (service.total || 0), 0) ?? 0;
  const grandTotal = baseAmount + extraAmount;

  const handleAccept = async () => {
    if (!checkoutDetails?._id) {
      console.error("No checkout ID found");
      return;
    }

    try {
      await updateCheckoutById(checkoutDetails._id, {
        isAccepted: true,
        acceptedDate: new Date(), // Current timestamp
      });

      alert("Booking Accepted Successfully");
      router.push("/booking-management/all-bookings");
    } catch (error) {
      alert("Failed to accept booking");
      console.error("Error while accepting booking:", error);
    }
  };

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
                Booking ID : <span className="text-blue-600">{checkoutDetails.bookingId}</span>
              </h2>
              <p className="text-md text-gray-600 mt-2 flex items-center gap-1">
                Status :
                <span
                  className={`font-medium px-2 py-0.5 rounded-full text-md border ${status.color}`}
                >
                  {status.label}
                </span>
              </p>

            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2 mt-2">
              {checkoutDetails.isCompleted === false ? (<button
                className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-900 transition duration-300"
                onClick={() => setIsEditOpen(true)}
              >
                Edit Lead
              </button>) : <></>}


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
                  <p className="text-gray-700"><strong>Total Amount:</strong> {formatPrice(grandTotal || 0)}</p>
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
                      {/* <td className="border px-4 py-2">
                        {lead?.newDiscountAmount != null
                          ? '₹0'
                          : `₹${checkoutDetails?.service?.discountedPrice || 0}`}
                      </td> */}
                      <td className="border px-4 py-2">{formatPrice(lead?.newDiscountAmount ?? checkoutDetails?.service?.discountedPrice ?? 0)}</td>
                      <td className="border px-4 py-2">{formatPrice(lead?.afterDicountAmount ?? checkoutDetails?.totalAmount ?? 0)}</td>
                    </tr>
                  </tbody>
                </table>


              </div>

              {/* Summary Values */}
              <div className="mt-6 space-y-2 text-sm text-gray-800">
                {[
                  ['Subtotal', lead?.newAmount ?? checkoutDetails?.service?.price],
                  ['Discount', lead?.newDiscountAmount ?? (checkoutDetails?.service?.price - checkoutDetails?.service?.discountedPrice) ?? 0],
                  ['Campaign Discount', 0],
                  ['Coupon Discount', checkoutDetails.couponDiscount || 0],
                  ['VAT', 0],
                  ['Platform Fee', 0],
                  ['Total ', lead?.afterDicountAmount ?? checkoutDetails?.service?.discountedPrice],
                ].map(([label, amount]) => (
                  <div className="flex justify-between" key={label}>
                    <span className="font-medium">{label} :</span>
                    <span>₹{amount}</span>
                  </div>
                ))}


                {hasExtraServices && (() => {
                  const extraServices = lead!.extraService!;
                  const subtotal = extraServices.reduce((acc, service) => acc + (service.price || 0), 0);
                  const totalDiscount = extraServices.reduce((acc, service) => acc + (service.discount || 0), 0);
                  const grandTotal = extraServices.reduce((acc, service) => acc + (service.total || 0), 0);

                  return (
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
                          {extraServices.map((service, index) => (
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

                      {/* Summary section */}
                      {[
                        ['Subtotal', subtotal],
                        ['Discount', totalDiscount],
                        ['Campaign Discount', 0],
                        ['Coupon Discount', checkoutDetails.couponDiscount || 0],
                        ['VAT', 0],
                        ['Platform Fee', 0],
                        ['Extra Service Total', grandTotal],
                      ].map(([label, amount]) => (
                        <div className="flex justify-between mb-1" key={label}>
                          <span className="font-medium">{label}:</span>
                          <span>{formatPrice(Number(amount))}</span>

                        </div>
                      ))}
                    </>
                  );
                })()}

                <div className="flex justify-between font-bold text-blue-600">
                  <span>Grand Total</span>
                  <span>{formatPrice(grandTotal || 0)}</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-1/3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              {checkoutDetails.isCompleted === false ? (<div className="px-8 py-6 bg-gray-100 m-3 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Booking Setup</h4>
                <hr className="my-4 border-gray-300 dark:border-gray-700" />

                {!checkoutDetails?.isAccepted ? (
                  <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
                    <button className="bg-red-500 text-white px-7 py-2 rounded-md hover:bg-red-600 transition duration-200">
                      Ignore
                    </button>
                    <button
                      onClick={handleAccept}
                      disabled={loadingUpdate}
                      className="bg-blue-500 text-white px-7 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                      {loadingUpdate ? "Accepting..." : "Accept"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={openModal}
                    className="bg-red-500 text-white px-7 py-2 rounded-md hover:bg-red-600 transition duration-200"
                  >
                    Update Status
                  </button>
                )}


              </div>) : (<></>)}

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
                  <p className="text-gray-700"><strong>Total Amount:</strong> {formatPrice(grandTotal || 0)}</p>
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

              const statusType = formData.get("leads")
                ? JSON.parse(formData.get("leads") as string)?.[0]?.statusType
                : null;


              if (statusType === "Lead completed") {
                const res = await fetch("https://biz-booster.vercel.app/api/distributeLeadCommission", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ checkoutId: checkoutDetails._id }),
                });


                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Commission distribution failed.");

                alert("Commission distributed successfully.");
              }

              alert("Lead status updated Successfully.");

              router.push("/booking-management/all-bookings");
              closeModal();
            } catch (err) {
              console.error("Failed to save lead:", err);
              // ✅ `err` is now the message string
              alert(err || "Failed to save lead status.");
            }
          }}
          checkoutId={checkoutDetails._id}
          serviceCustomerId={
            typeof checkoutDetails.serviceCustomer === 'string'
              ? checkoutDetails.serviceCustomer
              : checkoutDetails.serviceCustomer?._id
          }
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
