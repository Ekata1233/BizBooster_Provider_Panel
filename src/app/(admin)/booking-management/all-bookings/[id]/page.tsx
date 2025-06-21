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
import { useLead } from '@/app/context/LeadContext';
import UpdateStatusModal from '@/components/booking-management/UpdateStatusModal';
import { Modal } from '@/components/ui/modal';

const AllBookingsDetails = () => {
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'status'>('details');

    const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPrice, setEditPrice] = useState("");
  const [additionalFields, setAdditionalFields] = useState<
    { serviceName: string; price: string; discount: string; total: string }[]
  >([]);


  const { isOpen, openModal, closeModal } = useModal();
  const { provider } = useAuth();
  const { serviceMenByProvider, fetchServiceMenByProvider } = useServiceMan();
  const { createLead, loadingLeads } = useLead();
  const visibleServiceMen = showAll ? serviceMenByProvider : serviceMenByProvider.slice(0, 2);

  const params = useParams();
  const id = params?.id as string;

  const {
    checkoutDetails,
    loadingCheckoutDetails,
    errorCheckoutDetails,
    fetchCheckoutsDetailsById,
  } = useCheckout();

  console.log("checkout details : ", checkoutDetails)

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

 const handleFieldChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedFields = [...additionalFields];
    updatedFields[index][field as keyof typeof updatedFields[0]] = value;

    const price = parseFloat(updatedFields[index].price) || 0;
    const discount = parseFloat(updatedFields[index].discount) || 0;
    updatedFields[index].total = (price - discount).toString();

    setAdditionalFields(updatedFields);
  };

  const addAdditionalRequirement = () => {
    setAdditionalFields([
      ...additionalFields,
      { serviceName: "", price: "", discount: "", total: "" },
    ]);
  };

  const handleUpdate = () => {
    const data = {
      editPrice,
      additionalRequirements: additionalFields,
    };
    console.log("Updating with:", data);
    setIsModalOpen(false);
  };


  const getStatusLabel = () => {
    if (checkoutDetails?.isCompleted) return 'Done';
    if (checkoutDetails?.orderStatus === 'processing') return 'Processing';
    return 'Pending';
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
                Booking ID: <span className="text-blue-600">{checkoutDetails.bookingId}</span>
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Status: <span className="font-medium">{getStatusLabel()}</span>
              </p>
            </div>

            <div>
              <button className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 mx-2"
              onClick={() => setIsModalOpen(true)}
              >
              Edit Lead
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mx-2">
              Download Invoice
            </button>
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
                <div className="flex justify-between border-t pt-2 mt-2 font-semibold text-base">
                  <span>Grand Total :</span>
                  <span>₹{checkoutDetails.totalAmount}</span>
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
         {isModalOpen && (
  <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[700px] m-4">
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Lead</h2>

        {/* Edit Price */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Edit Price:
          <input
            type="text"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </label>

        {/* Add First Additional Requirements Button */}
        {additionalFields.length === 0 && (
          <button
            onClick={addAdditionalRequirement}
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-sm px-3 py-2 rounded"
          >
            + Add Additional Requirements
          </button>
        )}

        {/* Scrollable Fields */}
        <div className="max-h-[50vh] overflow-y-auto pr-1">
          {additionalFields.map((field, index) => (
            <div
              key={index}
              className="mt-4 border p-3 rounded-md bg-gray-50"
            >
              <label className="block text-sm font-medium">
                Service Name:
                <input
                  type="text"
                  value={field.serviceName}
                  onChange={(e) =>
                    handleFieldChange(index, "serviceName", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </label>

              <label className="block text-sm font-medium mt-2">
                Price:
                <input
                  type="number"
                  value={field.price}
                  onChange={(e) =>
                    handleFieldChange(index, "price", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </label>

              <label className="block text-sm font-medium mt-2">
                Discount:
                <input
                  type="number"
                  value={field.discount}
                  onChange={(e) =>
                    handleFieldChange(index, "discount", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </label>

              <label className="block text-sm font-medium mt-2">
                Total:
                <input
                  type="text"
                  value={field.total}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100"
                />
              </label>

              {index === additionalFields.length - 1 && (
                <button
                  onClick={addAdditionalRequirement}
                  className="mt-4 bg-gray-200 hover:bg-gray-300 text-sm px-3 py-2 rounded"
                >
                  + Add Additional Requirements
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </Modal>
)}

      <div>
        <UpdateStatusModal
          isOpen={isOpen}
          onClose={closeModal}
          onSubmit={async (formData) => {
            try {
              await createLead(formData);
              alert("Lead status updated successfully.");
              closeModal();
            } catch (err) {
              console.error("Failed to save lead:", err);
              alert("Failed to save lead status.");
            }
          }}
          checkoutId={checkoutDetails._id}
          serviceCustomerId={checkoutDetails.serviceCustomer}
          serviceManId={checkoutDetails.serviceMan ?? ""}
          serviceId={checkoutDetails.service?._id ?? ""}
          amount={checkoutDetails.discountedPrice?.toString() || "150"}
          loading={loadingLeads}
        />

      </div>
     
    </div>
  );
};

export default AllBookingsDetails;
