"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";

export default function UserMetaCard() {
  const { providerDetails, refreshProviderDetails } = useAuth();
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const userId = providerDetails?._id;

  useEffect(() => {
    refreshProviderDetails();
  }, [refreshProviderDetails]);

  // ✅ Initialize state from providerDetails directly
  useEffect(() => {
    if (providerDetails?.isStoreOpen !== undefined) {
      setIsActive(providerDetails.isStoreOpen);
    }
  }, [providerDetails?.isStoreOpen]);

  // ✅ Toggle store open/close
  const handleToggle = async () => {
    if (loading || !userId) return;

    setLoading(true);
    try {
      const res = await fetch(`https://biz-booster.vercel.app/api/provider/store-status/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        setIsActive(data.isStoreOpen);
      } else {
        console.error("Toggle failed:", data?.message || "Unknown error");
      }
    } catch (err) {
      console.error("Error toggling store:", err);
    } finally {
      setLoading(false);
    }
  };


  console.log("Provider details : ", providerDetails);



  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={
                  providerDetails?.storeInfo?.logo ||
                  "/images/default-logo.png"
                }
                alt="user"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {providerDetails?.fullName || "Provider Name"} | {providerDetails?.providerId || "Provider Id"}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {providerDetails?.email || "user@example.com"}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {providerDetails?.storeInfo?.state || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <label className="text-sm font-semibold text-blue-600 dark:text-blue-600 tracking-wide uppercase whitespace-nowrap">
              STORE STATUS
            </label>
            <div className="relative flex items-center gap-2">
              <button
                onClick={handleToggle}
                disabled={loading}
                className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-300 border-2 ${isActive
                  ? "bg-gradient-to-r from-green-400 to-green-600 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"
                  : "bg-gray-300 border-gray-400"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`absolute left-0 top-0 w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isActive ? "translate-x-8" : ""
                    }`}
                ></span>
              </button>

              {loading && (
                <span className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                  Updating...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>


    </>
  );
}
