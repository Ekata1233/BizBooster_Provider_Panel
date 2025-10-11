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

const AllBookingsDetails = () => {
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'status'>('details');
  const [isEditOpen, setIsEditOpen] = useState(false);
  // const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const { provider } = useAuth();
  const { serviceMenByProvider, fetchServiceMenByProvider } = useServiceMan();
  const { createLead, loadingLeads } = useLead();
  const visibleServiceMen = showAll ? serviceMenByProvider : serviceMenByProvider.slice(0, 2);
  const [lead, setLead] = useState<LeadType | null>(null);



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

  useEffect(() => {
    if (id) fetchCheckoutsDetailsById(id);
  }, [id]);


  useEffect(() => {
    const customer = checkoutDetails?.serviceCustomer;

    if (customer) {
      const customerId = typeof customer === 'string' ? customer : customer._id;
      if (customerId) {
        fetchServiceCustomer(customerId);
      }
    }
  }, [checkoutDetails]);

  useEffect(() => {
    if (provider?._id) {
      fetchServiceMenByProvider(provider._id);
    }
  }, [provider]);

  const refreshBooking = async () => {
    if (!checkoutDetails?._id) return;
    await fetchCheckoutsDetailsById(checkoutDetails._id);
    await getLeadByCheckoutId(checkoutDetails._id);
  };


  const getStatusStyle = () => {
    if (checkoutDetails?.isCompleted)
      return { label: 'Completed', color: 'text-green-700 border-green-400 bg-green-50' };

    if (checkoutDetails?.isCanceled === true) // ✅ compare as boolean
      return { label: 'Cancelled', color: 'text-red-700 border-red-400 bg-red-50' };

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
  console.log(baseAmount)
  console.log("hasExtraServices : ", hasExtraServices)


  const handleDownloadInvoice = async () => {
    if (!checkoutDetails?._id) return;

    try {
      const response = await fetch(
        `https://api.fetchtrue.com/api/invoice/${checkoutDetails._id}`
      );
      if (!response.ok) throw new Error('Failed to fetch invoice');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `invoice-${checkoutDetails.bookingId || checkoutDetails._id}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };


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

      try {
        const res = await fetch("https://api.fetchtrue.com/api/upcoming-lead-commission", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutId: checkoutDetails._id }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create upcoming commission.");

      } catch (apiError) {
        console.error("Upcoming commission API error:", apiError);
        alert("Booking accepted, but failed to create upcoming commission.");
      }

      alert("Booking Accepted Successfully");
      // router.push("/booking-management/all-bookings");
      await refreshBooking();

    } catch (error) {
      alert("Failed to accept booking");
      console.error("Error while accepting booking:", error);
    }
  };


  const serviceGSTPercent = checkoutDetails?.gst || 0;
  const platformFeePercent = checkoutDetails?.platformFee || 0;
  const assurityFeePercent = checkoutDetails?.assurityfee || 0;

  const value = checkoutDetails?.subtotal ?? 0;
  const gstValue = (serviceGSTPercent / 100) * value;
  const platformFeeValue = (platformFeePercent / 100) * value;
  const assurityFeeValue = (assurityFeePercent / 100) * value;



  const extraServices = lead?.extraService ?? [];

  const extraSubtotal = extraServices.reduce((acc, service) => acc + (service.price || 0), 0);
  const extraDiscount = extraServices.reduce((acc, service) => acc + (service.discount || 0), 0);

  const couponDiscount = checkoutDetails?.couponDiscount || 0;
  const champaignDiscount = checkoutDetails?.champaignDiscount || 0;

  let extraAmount = 0;
  console.log(extraAmount)

  // Only calculate if extra services exist
  if (lead?.extraService && lead.extraService.length > 0) {
    extraAmount = extraSubtotal - extraDiscount - couponDiscount - champaignDiscount + gstValue + platformFeeValue + assurityFeeValue;
  }

  // Final grand total (base + extra)
  const grandTotal = checkoutDetails?.grandTotal && checkoutDetails.grandTotal > 0
    ? checkoutDetails.grandTotal
    : checkoutDetails?.totalAmount;
  let finalGrandTotal = checkoutDetails?.totalAmount ?? 0;



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
              {checkoutDetails.isCompleted === false && (
                <div className="flex flex-col">
                  <button
                    className={`bg-blue-800 text-white px-6 py-2 rounded-md transition duration-300 ${hasExtraServices
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'hover:bg-blue-900'
                      }`}
                    onClick={() => !hasExtraServices && setIsEditOpen(true)}
                    disabled={hasExtraServices}
                  >
                    + Add on Service
                  </button>
                  {hasExtraServices && (
                    <p className="text-xs text-gray-500 mt-1">
                      Already one additional service added
                    </p>
                  )}
                </div>
              )}

              {isEditOpen && (
                <UpdateEditLead
                  isOpen={isEditOpen}
                  closeModal={() => setIsEditOpen(false)}
                  checkoutId={checkoutDetails._id}
                />
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2 ">
                <button
                  onClick={handleDownloadInvoice}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Download Invoice
                </button>
              </div>
              {/* <InvoiceDownload
                leadDetails={lead}
                checkoutDetails={checkoutDetails}
                serviceCustomer={serviceCustomer}
              /> */}
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
                  <p className="text-gray-700"><strong>Total Amount :</strong> {formatPrice(grandTotal || 0)}</p>
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
                      <td className="border px-4 py-2">
                        {formatPrice(Number(checkoutDetails?.listingPrice ?? checkoutDetails?.service?.price ?? 0))}
                      </td>

                      <td className="border px-4 py-2">
                        {formatPrice(Number(checkoutDetails?.serviceDiscountPrice ?? checkoutDetails?.service?.discountedPrice ?? 0))}
                      </td>

                      <td className="border px-4 py-2">
                        {formatPrice(Number(checkoutDetails?.priceAfterDiscount ?? checkoutDetails?.totalAmount ?? 0))}
                      </td>

                    </tr>
                  </tbody>
                </table>


              </div>

              {/* Summary Values */}
              <div className="mt-6 space-y-2 text-sm text-gray-800">
                {([
                  ['Listing Price', checkoutDetails?.listingPrice ?? 0],
                  [`Service Discount (${checkoutDetails?.serviceDiscount ?? 0}%)`, -(checkoutDetails?.serviceDiscountPrice ?? 0)],
                  ['Price After Discount', checkoutDetails?.priceAfterDiscount ?? 0],
                  [`Coupon Discount (${checkoutDetails?.couponDiscount ?? 0}${checkoutDetails?.couponDiscountType})`, -(checkoutDetails?.couponDiscountPrice ?? 0)],
                  [`Service GST (${checkoutDetails?.gst ?? 0}%)`, checkoutDetails?.serviceGSTPrice ?? 0],
                  [`Platform Fee `, checkoutDetails?.platformFeePrice ?? 0],
                  [`Fetch True Assurity Charges (${checkoutDetails?.assurityfee ?? 0}%)`, checkoutDetails?.assurityChargesPrice ?? 0],
                  ['Service Total', checkoutDetails?.totalAmount ?? 0],
                ] as [string, number][]
                ).map(([label, amount]) => (
                  <div className="flex justify-between" key={label}>
                    <span className="font-medium">{label} :</span>
                    <span>₹{amount}</span>
                  </div>
                ))}

                {!hasExtraServices && (
                  (() => {
                    const extraServices = lead?.extraService || [];
                    console.log("extra services : ", extraServices);

                    const allCommissionInvalid = extraServices.every(service => {
                      const commissionValue = parseFloat(service.commission || "0");
                      return !commissionValue || commissionValue <= 0;
                    });
                    if (extraServices.length === 0) {
                      return null; // 👈 Don't render anything if no extra services
                    }

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

                        {allCommissionInvalid && (
                          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-5 rounded-md">
                            <p className="font-medium">Approval Pending</p>
                            <p className="text-sm">
                              The commission for this service is not approved yet by the admin. Please wait for admin approval to see detailed calculations.
                            </p>
                          </div>
                        )}
                      </>
                    );
                  })()
                )}



                {hasExtraServices && (() => {
                  const extraServices = lead!.extraService!;
                  console.log("extra services : ", extraServices)

                  const allCommissionInvalid = extraServices.every(service => {
                    const commissionValue = parseFloat(service.commission || "0");
                    return !commissionValue || commissionValue <= 0;
                  });

                  const subtotal = extraServices.reduce((acc, service) => acc + (service.price || 0), 0);
                  const totalDiscount = extraServices.reduce((acc, service) => acc + (service.discount || 0), 0);
                  const priceAfterDiscount = extraServices.reduce((acc, service) => acc + (service.total || 0), 0);

                  const gstPercent = checkoutDetails?.gst ?? gstValue ?? 0;

                  // GST calculated only on priceAfterDiscount
                  const serviceGST = (gstPercent / 100) * priceAfterDiscount;
                  const assurityFeePercent = checkoutDetails?.assurityfee ?? assurityFeeValue ?? 0;

                  // ✅ calculated assurity fee amount
                  const assurityFee = (assurityFeePercent / 100) * priceAfterDiscount;

                  const grandTotal = priceAfterDiscount + serviceGST + assurityFee;
                  finalGrandTotal = (checkoutDetails?.totalAmount ?? 0) + (grandTotal || 0);


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

                      {allCommissionInvalid ? (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-5 rounded-md">
                          <p className="font-medium">Approval Pending</p>
                          <p className="text-sm">The commission for this service is not approved yet by the admin. Please wait for admin approval to see detailed calculations.</p>
                        </div>
                      ) : (
                        <>
                          {([
                            ['Listing Price', subtotal],
                            [`Service Discount `, -(totalDiscount || 0)],
                            [`Price After Discount`, priceAfterDiscount || 0],
                            // show coupon if you want to include coupon for extra services — commented out to match previous code
                            // [`Coupon Discount (${checkoutDetails?.couponDiscount ?? 0}%)`, -(checkoutDetails?.couponDiscountPrice ?? 0)],
                            [`Service GST (${checkoutDetails?.gst ?? 0}%)`, serviceGST || 0],
                            // [`Platform Fee`, platformFee || 0], // uncomment if platform fee applies to extra services
                            [`Fetch True Assurity Charges (${assurityFeePercent}%)`, assurityFee || 0],
                            ['Extra Service Total', grandTotal || 0],
                          ] as [string, number][]).map(([label, amount]) => (
                            <div className="flex justify-between mb-1" key={label}>
                              <span className="font-medium">{label}:</span>
                              <span>{formatPrice(Number(amount))}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  );
                })()}


              </div>
              <hr className='mt-4' />
              <div className="flex justify-between font-bold text-blue-600 mt-2">
                <span>Grand Total</span>
                <span>{formatPrice(finalGrandTotal)}</span>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-1/3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">


              {!checkoutDetails?.isCompleted &&
                !lead?.leads?.some(l => l.statusType === "Lead cancel") && (
                  <div className="px-8 py-6 bg-gray-100 m-3 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Booking Setup
                    </h4>
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
                  </div>
                )}


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
              // await createLead(formData);

              const statusType = formData.get("leads")
                ? JSON.parse(formData.get("leads") as string)?.[0]?.statusType
                : null;

              if (statusType === "Lead cancel") {
                const paymentStatus = checkoutDetails?.paymentStatus?.trim().toLowerCase() || "";
                const cashInHand = Boolean(checkoutDetails?.cashInHand);
                const cashInHandAmount = Number(checkoutDetails?.cashInHandAmount ?? 0);
                const paidAmount = Number(checkoutDetails?.paidAmount ?? 0);

                if (paidAmount > 0 || paidAmount > 0 || paymentStatus === "paid" || cashInHand || cashInHandAmount > 0) {
                  alert("Lead cannot be canceled because payment is already made.");
                  console.log("Lead cancel blocked due to existing payment:", {
                    paymentStatus,
                    cashInHand,
                    cashInHandAmount,
                  });
                  return; // EXIT here, before calling createLead
                }
              }

              // Only call createLead if payment conditions are okay
              await createLead(formData);

              if (statusType === "Lead completed") {
                const res = await fetch("https://api.fetchtrue.com/api/distributeLeadCommission", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ checkoutId: checkoutDetails._id }),
                });


                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Commission distribution failed.");

                alert("Commission distributed successfully.");
              }


              if (statusType === "Lead cancel") {
                // Normalize values to prevent type/format issues
                const paymentStatus = checkoutDetails?.paymentStatus?.trim().toLowerCase() || "";
                const cashInHand = Boolean(checkoutDetails?.cashInHand);
                const cashInHandAmount = Number(checkoutDetails?.cashInHandAmount ?? 0);

                // Block cancellation if any payment exists
                if (paymentStatus === "paid" || cashInHand || cashInHandAmount > 0) {
                  alert("Lead cannot be canceled because payment is already made.");
                  console.log("Lead cancel blocked due to existing payment:", {
                    paymentStatus,
                    cashInHand,
                    cashInHandAmount,
                  });
                  return; // EXIT here, do NOT call the API
                }

                // Proceed with lead cancel API only if no payment exists
                try {
                  const cancelRes = await fetch(
                    `https://api.fetchtrue.com/api/checkout/cancel-lead/${checkoutDetails?._id}`,
                    { method: "PATCH" }
                  );

                  const cancelData = await cancelRes.json();

                  if (cancelRes.ok && cancelData?.success) {
                    if (typeof fetchCheckoutsDetailsById === "function") {
                      await fetchCheckoutsDetailsById(checkoutDetails?._id);
                    }
                    alert("Lead canceled successfully.");
                  } else {
                    alert("Failed to cancel lead: " + (cancelData?.message || "Unknown error"));
                    console.error("Lead cancel failed:", cancelData);
                  }
                } catch (error) {
                  console.error("Lead cancel API error:", error);
                  alert("An error occurred while canceling the lead. Please try again.");
                }
              }


              // router.push("/booking-management/all-bookings");
              await refreshBooking();

              closeModal();
              alert("Lead status updated Successfully.");

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
          // amount={checkoutDetails.totalAmount?.toString() || "000"}
          amount={
            (checkoutDetails.grandTotal && checkoutDetails.grandTotal > 0
              ? checkoutDetails.grandTotal - checkoutDetails.paidAmount
              : checkoutDetails.totalAmount - checkoutDetails.paidAmount
            )?.toString() || "000"
          }

          loading={loadingLeads}
        />

      </div>

    </div>
  );
};

export default AllBookingsDetails;
