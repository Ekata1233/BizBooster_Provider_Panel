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
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-green-100 to-green-200 p-5 shadow-md md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-white/50 rounded-xl">
          <GroupIcon className="size-6 text-green-800" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm font-medium text-green-800">Subscribed Services</span>
            <h4 className="mt-2 font-bold text-title-sm text-green-800">{subscribedServicesCount}</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon className="mr-1" />
            11.01%
          </Badge>
        </div>
      </div>

      {/* Total Servicemen */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-red-100 to-red-200 p-5 shadow-md md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-white/50 rounded-xl">
          <BoxIconLine className="size-6 text-red-800" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm font-medium text-red-800">Total Servicemen</span>
            <h4 className="mt-2 font-bold text-title-sm text-red-800">{serviceManCount}</h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon className="mr-1 text-error-500" />
            9.05%
          </Badge>
        </div>
      </div>

      {/* Total Bookings */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-indigo-100 to-indigo-200 p-5 shadow-md md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-white/50 rounded-xl">
          <GroupIcon className="size-6 text-indigo-800" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm font-medium text-indigo-800">Total Bookings</span>
            <h4 className="mt-2 font-bold text-title-sm text-indigo-800">{totalBookings}</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon className="mr-1" />
            4.23%
          </Badge>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-yellow-100 to-yellow-200 p-5 shadow-md md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-white/50 rounded-xl">
          <BoxIconLine className="size-6 text-yellow-800" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm font-medium text-yellow-800">Total Revenue</span>
            <h4 className="mt-2 font-bold text-title-sm text-yellow-800">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon className="mr-1" />
            6.88%
          </Badge>
        </div>
      </div>
    </div>
  );
};
