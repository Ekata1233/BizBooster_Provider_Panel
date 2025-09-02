"use client";
import { useAuth } from "@/app/context/AuthContext";
import { usePayout } from "@/app/context/PayoutContext";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { providerDetails } = useAuth();
  const providerId = providerDetails?._id;

  const { addBeneficiary, payoutData, loadingPayout, errorPayout } = usePayout();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    userId: providerId || "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    branchName: "",
  });

  useEffect(() => {
  if (providerId) {
    setForm((prev) => ({ ...prev, userId: providerId }));
  }
}, [providerId]);

    console.log("providerId : ", providerId)

  console.log("form : ", form)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userId) {
      alert("User ID (provider) missing!");
      return;
    }
    await addBeneficiary(form);
    setShowForm(false);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Bank Information" />

      <div className="my-5">
        <ComponentCard title="Account Details">
          <div className="mb-4 space-y-6">
            {/* If we already have bank details from payoutData */}
            {payoutData ? (
              <>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Holder Name
                  </p>
                  <p className="text-base text-gray-600">
                    {payoutData.cashfreeResponse.beneficiary_name}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Bank Name
                    </p>
                    <p className="text-base text-gray-600">
                      {payoutData.savedBankDetails.bankName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Branch Name
                    </p>
                    <p className="text-base text-gray-600">
                      {payoutData.savedBankDetails.branchName}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Account Number
                    </p>
                    <p className="text-base text-gray-600">
                      {payoutData.savedBankDetails.accountNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      IFSC Number
                    </p>
                    <p className="text-base text-gray-600">
                      {payoutData.savedBankDetails.ifsc}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">
                No bank details added yet. Please add your bank details.
              </p>
            )}

            {/* Toggle button */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
            >
              {showForm ? "Cancel" : "Add Bank Details"}
            </button>

            {/* Form Section */}
            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium">Account Number</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    value={form.accountNumber}
                    onChange={(e) =>
                      setForm({ ...form, accountNumber: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">IFSC Code</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    value={form.ifsc}
                    onChange={(e) => setForm({ ...form, ifsc: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Bank Name</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    value={form.bankName}
                    onChange={(e) =>
                      setForm({ ...form, bankName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Branch Name</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    value={form.branchName}
                    onChange={(e) =>
                      setForm({ ...form, branchName: e.target.value })
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingPayout}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loadingPayout ? "Saving..." : "Save Bank Details"}
                </button>

                {errorPayout && (
                  <p className="text-red-500 text-sm">{errorPayout}</p>
                )}
              </form>
            )}
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default Page;
