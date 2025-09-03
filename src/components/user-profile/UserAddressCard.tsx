"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";

interface Location {
  type: string;
  coordinates: [number, number];
}

interface StoreInfo {
  storeName?: string;
  storeEmail?: string;
  storePhone?: string;
  address?: string;
  city?: string;
  country?: string;
  state?: string;
  officeNo?: string;
  tax?: string;
  zone?: string;
  location?: Location;
  logo?: string;
  cover?: string;
}

interface ProviderDetails {
  storeInfo?: StoreInfo;
  kyc?: Record<string, string[]>;
}

function renderLocation(location?: Location) {
  if (!location) return "-";
  return (
    <>
      <p>Type: {location.type}</p>
      <p>Longitude: {location.coordinates[0]}</p>
      <p>Latitude: {location.coordinates[1]}</p>
    </>
  );
}

function renderImageArray(data?: string[]) {
  if (!data || data.length === 0) return <p className="text-sm text-gray-400">No files</p>;
  return data.map((url, index) => (
    <Image
      key={index}
      src={url}
      alt={`Document ${index + 1}`}
      width={100}
      height={100}
      className="rounded border border-gray-200 object-contain max-h-24"
    />
  ));
}

export default function UserAddressCard() {
  const { providerDetails: provider } = useAuth() as { providerDetails?: ProviderDetails };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Store Information Section */}
      <div className="border rounded-lg p-6 shadow-sm bg-gradient-to-br  to-white">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
          Store Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Store Name", value: provider?.storeInfo?.storeName },
            { label: "Address", value: provider?.storeInfo?.address },
            { label: "City", value: provider?.storeInfo?.city },
            { label: "State", value: provider?.storeInfo?.state },
            { label: "Country", value: provider?.storeInfo?.country },
            { label: "Store Email", value: provider?.storeInfo?.storeEmail },
            { label: "Store Phone", value: provider?.storeInfo?.storePhone },
            { label: "Zone", value: provider?.storeInfo?.zone },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <p className="text-sm text-gray-500 whitespace-nowrap">{item.label}:</p>
              <p className="font-medium">{item.value || "-"}</p>
            </div>
          ))}

          {/* Location */}
          {/* <div className="flex items-start gap-2">
            <p className="text-sm text-gray-500 whitespace-nowrap">Location:</p>
            <div className="font-medium">{renderLocation(provider?.storeInfo?.location)}</div>
          </div> */}
        </div>

        {provider?.storeInfo?.cover && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Store Cover Image</p>
            <Image
              src={provider.storeInfo.cover}
              alt="Store Cover"
              width={250}
              height={140}
              className="rounded border border-gray-200"
            />
          </div>
        )}
      </div>

      {/* KYC Documents Section */}
      <div className="border rounded-lg p-6 shadow-sm bg-gradient-to-br to-white">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
          KYC Documents
        </h2>
        <div className="space-y-4">
          {[
            { label: "GST Documents", data: provider?.kyc?.GST },
            { label: "Aadhaar Card", data: provider?.kyc?.aadhaarCard },
            { label: "PAN Card", data: provider?.kyc?.panCard },
            { label: "Other Documents", data: provider?.kyc?.other },
            { label: "Store Documents", data: provider?.kyc?.storeDocument },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <p className="text-sm text-gray-500 font-semibold w-40">{item.label}</p>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                {renderImageArray(item.data)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
