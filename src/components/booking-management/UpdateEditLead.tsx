"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { LeadType, useLead } from "@/app/context/LeadContext";
import { useCheckout } from "@/app/context/CheckoutContext";

interface EditLeadPageProps {
  isOpen: boolean;
  closeModal: () => void;
  checkoutId: string;
}

export default function EditLeadPage({ isOpen, closeModal, checkoutId }: EditLeadPageProps) {
  const [additionalFields, setAdditionalFields] = useState<
    { serviceName: string; price: string; discount: string; total: string }[]
  >([{ serviceName: "", price: "", discount: "", total: "" }]); // Initialize with one field
  const [loadingLead, setLoadingLead] = useState(true);
  const { updateLeadByCheckoutId, getLeadByCheckoutId } = useLead();
  const [lead, setLead] = useState<LeadType | null>(null);

  useEffect(() => {
    const fetchLead = async () => {
      if (!checkoutId) return;

      try {
        setLoadingLead(true);
        const fetchedLead = await getLeadByCheckoutId(checkoutId);

        if (!fetchedLead) {
          console.warn("No lead found for ID:", checkoutId);
          return;
        }

        setLead(fetchedLead);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          (error as { response?: { status?: number } }).response?.status === 404
        ) {
          console.warn("Lead not found (404) for ID:", checkoutId);
        } else {
          const errorMessage =
            typeof error === "object" &&
              error !== null &&
              "message" in error
              ? (error as { message?: string }).message
              : String(error);
          console.error("Error fetching lead:", errorMessage);
        }
      } finally {
        setLoadingLead(false);
      }
    };

    fetchLead();
  }, [checkoutId]);

  const {
    // checkoutDetails,
    loadingCheckoutDetails,
    errorCheckoutDetails,
  } = useCheckout();

  const handleFieldChange = (
    index: number,
    field: "serviceName" | "price" | "discount" | "total",
    value: string
  ) => {
    const newFields = [...additionalFields];
    newFields[index][field] = value;

    const price = parseFloat(newFields[index].price || "0");
    const discount = parseFloat(newFields[index].discount || "0");
    newFields[index].total = (price - discount).toFixed(2);

    setAdditionalFields(newFields);
  };

  const removeField = (index: number) => {
    const newFields = [...additionalFields];
    newFields.splice(index, 1);
    setAdditionalFields(newFields);
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        extraService: additionalFields.map((field) => ({
          serviceName: field.serviceName,
          price: parseFloat(field.price || "0"),
          discount: parseFloat(field.discount || "0"),
          total: parseFloat(field.total || "0"),
          commission: "0",
          isLeadApproved: false,
        })),
      };

      const result = await updateLeadByCheckoutId(checkoutId, payload);

      if (result.data) {
        alert("Lead updated successfully!");
      } else {
        alert(result.errorMessage || "Failed to update lead.");
      }

      closeModal();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Something went wrong while updating the lead.");
    }
  };

  if (loadingCheckoutDetails) {
    return <div>Loading...</div>;
  }

  if (errorCheckoutDetails) {
    return <div className="text-red-500">Something went wrong while loading data.</div>;
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
      <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Edit Lead</h2>

        {loadingLead ? (
          <div className="text-sm text-gray-500">Loading lead form...</div>
        ) : lead === null ? (
          <div className="mb-4 p-4 bg-red-100 text-red-800 text-sm rounded-md border border-red-300">
            Please update the lead status
          </div>
        ) : (
          <>
            {/* Additional Fields - Always shown with at least one field */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {additionalFields.map((field, index) => (
                <div key={index} className="p-4 border rounded-md bg-gray-50 relative">
                  {index > 0 && (
                    <button
                      onClick={() => removeField(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-800 dark:text-white">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={field.serviceName}
                      onChange={(e) => handleFieldChange(index, "serviceName", e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter service name"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-800 dark:text-white">
                      Price
                    </label>
                    <input
                      type="number"
                      value={field.price}
                      onChange={(e) => handleFieldChange(index, "price", e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter price"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-800 dark:text-white">
                      Discount (Only Rs.)
                    </label>
                    <input
                      type="number"
                      value={field.discount}
                      onChange={(e) => handleFieldChange(index, "discount", e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter discount"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-800 dark:text-white">
                      Total
                    </label>
                    <input
                      type="text"
                      value={field.total}
                      disabled
                      className="w-full p-2 border rounded-md bg-gray-100"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Additional Requirements Button - Always shown */}
            {/* <button
              onClick={addAdditionalRequirement}
              className="mt-4 bg-gray-200 hover:bg-gray-300 text-sm px-3 py-2 rounded w-full"
            >
              + Add Additional Requirements
            </button> */}

            {/* Action Buttons */}
            <div className="flex justify-end mt-6">
              <button
                className="px-6 py-2 mr-2 rounded-md bg-gray-400 text-white hover:bg-gray-500"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}