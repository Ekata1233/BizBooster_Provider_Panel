import React from 'react';

type CustomerInfo = {
  fullName: string;
  phone: string;
  address: string;
  city?: string;
  state: string;
};

type CustomerInfoCardProps = {
  serviceCustomer: CustomerInfo | null;
  loading: boolean;
  error: string | null; // kept for props compatibility, but not shown
};

const CustomerInfoCard = ({ serviceCustomer, loading }: CustomerInfoCardProps) => (
  <div className="px-8 py-6 bg-gray-100 m-3 rounded-xl">
    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Customer Information</h4>
    <hr className="my-4 border-gray-300 dark:border-gray-700" />
    
    {loading && (
      <p className="text-sm text-gray-600 dark:text-gray-400">Loading customer info...</p>
    )}

    {!loading && serviceCustomer ? (
      <div className="flex items-center gap-5">
        <div className="space-y-1">
          <p className="text-sm text-gray-700 dark:text-gray-200"><strong>Name:</strong> {serviceCustomer.fullName}</p>
          <p className="text-sm text-gray-700 dark:text-gray-200"><strong>Phone:</strong> {serviceCustomer.phone}</p>
          <p className="text-sm text-gray-700 dark:text-gray-200">
            <strong>Address:</strong> {serviceCustomer.address}, {serviceCustomer.city}, {serviceCustomer.state}
          </p>
        </div>
      </div>
    ) : (
      !loading && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          ⚠️ Service customer not found.
        </p>
      )
    )}
  </div>
);

export default CustomerInfoCard;
