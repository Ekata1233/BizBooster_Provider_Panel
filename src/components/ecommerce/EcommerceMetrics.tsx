'use client';

import React, { useEffect } from "react";
import Badge from "../ui/badge/Badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "@/icons";
import { useAuth } from "@/app/context/AuthContext";
import { useServiceMan } from "@/app/context/ServiceManContext";
import { useCheckout } from "@/app/context/CheckoutContext";
import { useProviderWallet } from "@/app/context/WalletContext";

export const EcommerceMetrics = () => {
  const { providerDetails } = useAuth();

  const {
    serviceMenByProvider,
    fetchServiceMenByProvider,
    loading: serviceManLoading,
  } = useServiceMan();

  const {
    fetchCheckoutsByProviderId,
    checkouts,
    loadingCheckouts,
  } = useCheckout();

  const {
    fetchWalletByProvider,
    loading,
  } = useProviderWallet();

  useEffect(() => {
    if (providerDetails?._id) {
      fetchServiceMenByProvider(providerDetails._id);
      fetchCheckoutsByProviderId(providerDetails._id);
      fetchWalletByProvider(providerDetails._id);
    }
  }, [providerDetails?._id]);

  // Show loading state only while fetching
  if (loading || loadingCheckouts || serviceManLoading) return <p>Loading...</p>;

  // Safe fallback values
  const subscribedServicesCount = providerDetails?.subscribedServices?.length || 0;
  const serviceManCount = Array.isArray(serviceMenByProvider) ? serviceMenByProvider.length : 0;
  const totalBookings = Array.isArray(checkouts) ? checkouts.length : 0;
  const totalRevenue = Array.isArray(checkouts)
    ? checkouts.reduce((sum, item) => sum + (item.totalAmount || 0), 0)
    : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {/* Subscribed Services */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Subscribed Services</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {subscribedServicesCount}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>

      {/* Total Servicemen */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Servicemen</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {serviceManCount}
            </h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge>
        </div>
      </div>

      {/* Total Bookings */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalBookings}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            4.23%
          </Badge>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            6.88%
          </Badge>
        </div>
      </div>
    </div>
  );
};
