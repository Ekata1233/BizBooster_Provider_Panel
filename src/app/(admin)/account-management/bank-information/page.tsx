"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { usePayout } from "@/app/context/PayoutContext";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

const BankInfoPage = () => {
  const { providerDetails } = useAuth();
  const providerId = providerDetails?._id;

  const {
    addBeneficiary,
    fetchBankDetails,
    payoutData,
    bankDetailsList,
    loadingPayout,
    errorPayout,
  } = usePayout();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    providerId: providerId || "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    branchName: "",
  });

  // ✅ Fetch bank details when providerId is available
  useEffect(() => {
    if (providerId) {
      setForm((prev) => ({ ...prev, providerId }));
      fetchBankDetails(providerId); // <-- FIXED: pass providerId
    }
  }, [providerId]);

  // ✅ Handle add/update submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.providerId) {
      alert("Provider ID missing!");
      return;
    }

    await addBeneficiary(form);
    setShowForm(false);
  };

  const bankDetails =
    payoutData?.savedBankDetails || (bankDetailsList.length > 0 ? bankDetailsList[0] : null);

  return (
    <div>
      <PageBreadcrumb pageTitle="Bank Information" />

      <div className="my-5">
        <ComponentCard title="Account Details">
          <div className="space-y-6">
            {/* ✅ Display existing bank details */}
            {loadingPayout && (
              <p className="text-gray-500 italic">Loading bank details...</p>
            )}

            {!loadingPayout && bankDetails ? (
              <>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Bank Name
                  </p>
                  <p className="text-base text-gray-600">
                    {bankDetails.bankName}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Branch Name
                    </p>
                    <p className="text-base text-gray-600">
                      {bankDetails.branchName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Account Number
                    </p>
                    <p className="text-base text-gray-600">
                      {bankDetails.accountNumber}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    IFSC Code
                  </p>
                  <p className="text-base text-gray-600">{bankDetails.ifsc}</p>
                </div>

                <button
                  onClick={() => setShowForm(!showForm)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                >
                  {showForm ? "Cancel" : "Update Bank Details"}
                </button>
              </>
            ) : !loadingPayout && (
              <>
                <p className="text-gray-500">
                  No bank details added yet. Please add your bank details.
                </p>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                >
                  {showForm ? "Cancel" : "Add Bank Details"}
                </button>
              </>
            )}

            {/* ✅ Add / Update Form */}
            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium">
                    Account Number
                  </label>
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

export default BankInfoPage;
