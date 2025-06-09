// components/service/AllServices.tsx
"use client";

import React, { useEffect } from "react";
import { PencilIcon } from "@/icons";

interface Service {
  _id: string;
  serviceName: string;
  thumbnailImage: string;
  category?: { name: string };
  price?: number;
  discountedPrice?: number;
  subcategory?: any;
}

interface SubscribeState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface AllServicesProps {
  services: Service[];
  subscribeStates: Record<string, SubscribeState>;
  providerSubscribedIds: string[];
  onSubscribe: (serviceId: string) => void;
  onView: (serviceId: string) => void;
}

const AllServices: React.FC<AllServicesProps> = ({
  services,
  subscribeStates,
  providerSubscribedIds,
  onSubscribe,
  onView,
}) => {
  /* ---------- NEW: log only subscribed services ---------- */
  useEffect(() => {
    const subscribedServices = services.filter((srv) =>
      providerSubscribedIds.includes(srv._id)
    );
    console.log("Subscribed services ➜", subscribedServices);
  }, [services, providerSubscribedIds]);
  /* ------------------------------------------------------- */

  return (
    <div className="space-y-6 my-3">
      <div className="border p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">All Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 && (
            <p className="text-center text-gray-500">
              No services found for the selected filters.
            </p>
          )}

          {services.map((service) => {
            const state = subscribeStates[service._id] || {
              loading: false,
              error: null,
              success: false,
            };

            const isAlreadySubscribed = providerSubscribedIds.includes(
              service._id
            );

            return (
              <div
                key={service._id}
                className="border rounded-md p-3 shadow hover:shadow-lg transition h-[340px] flex flex-col justify-between"
              >
                <div
                  onClick={() => onView(service._id)}
                  className="cursor-pointer"
                >
                  <img
                    src={
                      service.thumbnailImage || "https://via.placeholder.com/150"
                    }
                    alt={service.serviceName}
                    className="w-full h-40 object-cover rounded"
                  />

                  <h3
                    className="mt-3 font-semibold text-lg truncate"
                    title={service.serviceName}
                  >
                    {service.serviceName}
                  </h3>

                  <p
                    className="text-sm text-gray-600 mt-1 truncate"
                    title={service.category?.name}
                  >
                    {service.category?.name}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 line-through mr-2 text-sm">
                        ₹{service.price ?? "0"}
                      </span>
                      <span className="font-bold text-indigo-600 text-base">
                        ₹{service.discountedPrice ?? "0"}
                      </span>
                    </div>
                    <PencilIcon className="w-5 h-5 text-gray-500 hover:text-indigo-600" />
                  </div>
                </div>

                <button
                  onClick={() => onSubscribe(service._id)}
                  disabled={
                    state.loading || state.success || isAlreadySubscribed
                  }
                  className={`w-full mt-3 font-semibold py-2 rounded
                  ${
                    isAlreadySubscribed
                      ? "bg-red-400 cursor-not-allowed"
                      : state.success
                      ? "bg-green-600 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }
                  ${state.loading ? "opacity-60 cursor-wait" : ""}
                `}
                >
                  {isAlreadySubscribed
                    ? "Subscribed"
                    : state.loading
                    ? "Subscribing..."
                    : state.success
                    ? "Subscribed"
                    : "Subscribe"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllServices;
