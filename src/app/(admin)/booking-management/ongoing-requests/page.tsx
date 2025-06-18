'use client';

import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import BasicTableOne from '@/components/tables/BasicTableOne';
import Input from '@/components/form/input/InputField';

const OngoingRequests = () => {
  const search = '';
  const onSearch = () => {};

  const columns = []; // Placeholder for table column definitions
  const data = []; // Placeholder for table data

  return (
    <div>
      <PageBreadcrumb pageTitle="Ongoing Requests" />
      <div className="space-y-6">
        <ComponentCard title="Ongoing Requests">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search services…"
              value={search}
              onChange={onSearch}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
            />
          </div>

          {/* Display empty state or placeholder table */}
          <p className="text-sm text-gray-500">No data to display.</p>

          {/* Optional: Uncomment if you want an empty table rendered */}
          {/* <BasicTableOne columns={columns} data={data} /> */}
        </ComponentCard>
      </div>
    </div>
  );
};

export default OngoingRequests;
