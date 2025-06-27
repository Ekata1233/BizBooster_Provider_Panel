"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { useLead } from "@/app/context/LeadContext";
import { useCheckout } from "@/app/context/CheckoutContext";

interface EditLeadPageProps {
  isOpen: boolean;
  closeModal: () => void;
  checkoutId : string;
}

export default function EditLeadPage({ isOpen, closeModal,checkoutId }: EditLeadPageProps) {
  const [editPrice, setEditPrice] = useState("");
  const [additionalFields, setAdditionalFields] = useState<
    { serviceName: string; price: string; discount: string; total: string }[]
  >([]);
  const { updateLeadByCheckoutId } = useLead();
  console.log("edit lead",);
  
   const {
    fetchCheckoutsDetailsById,
    checkoutDetails,
    loadingCheckoutDetails,
    errorCheckoutDetails,
  } = useCheckout();

  // ⬇️ Fetch on mount or when `checkoutId` changes
 useEffect(() => {
  if (checkoutId && !checkoutDetails?._id) {
    fetchCheckoutsDetailsById(checkoutId);
  }
}, [checkoutId, checkoutDetails?._id, fetchCheckoutsDetailsById]);


  // ⬇️ Log details once fetched
  useEffect(() => {
    if (checkoutDetails) {
      console.log("Fetched Checkout Details:", checkoutDetails);
    }
  }, [checkoutDetails]);

  const addAdditionalRequirement = () => {
    setAdditionalFields([
      ...additionalFields,
      { serviceName: "", price: "", discount: "", total: "" },
    ]);
  };

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

const handleUpdate = async () => {
  try {
    const payload = {
      newAmount: parseFloat(editPrice || "0"),
      extraService: additionalFields.map((field) => ({
        serviceName: field.serviceName,
        price: parseFloat(field.price || "0"),
        discount: parseFloat(field.discount || "0"),
        total: parseFloat(field.total || "0"),
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


  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
      <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Edit Lead</h2>

        {/* Edit Price */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-white">
            Edit Price
          </label>
          <input
            type="text"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Show Add Button only if no fields yet */}
        {additionalFields.length === 0 && (
          <button
            onClick={addAdditionalRequirement}
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-sm px-3 py-2 rounded"
          >
            + Add Additional Requirements
          </button>
        )}

        {/* Additional Fields */}
        {additionalFields.length > 0 && (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 mt-4">
            {additionalFields.map((field, index) => (
              <div key={index} className="p-4 border rounded-md bg-gray-50">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-800 dark:text-white">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={field.serviceName}
                    onChange={(e) => handleFieldChange(index, "serviceName", e.target.value)}
                    className="w-full p-2 border rounded-md"
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
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-800 dark:text-white">
                    Discount
                  </label>
                  <input
                    type="number"
                    value={field.discount}
                    onChange={(e) => handleFieldChange(index, "discount", e.target.value)}
                    className="w-full p-2 border rounded-md"
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

                {index === additionalFields.length - 1 && (
                  <button
                    onClick={addAdditionalRequirement}
                    className="mt-2 bg-gray-200 hover:bg-gray-300 text-sm px-3 py-2 rounded"
                  >
                    + Add Additional Requirements
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

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
      </div>
    </Modal>
  );
}
