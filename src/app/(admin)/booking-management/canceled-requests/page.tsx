'use client';

import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import BasicTableOne from '@/components/tables/BasicTableOne';
import Input from '@/components/form/input/InputField';

const CanceledRequests = () => {
  const search = '';
  const onSearch = () => {};

  const columns = []; // Placeholder for table headers
  const data = []; // Placeholder for empty table rows

  return (
    <div>
      <PageBreadcrumb pageTitle="Canceled Request" />
      <div className="space-y-6">
        <ComponentCard title="Canceled Request">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search services…"
              value={search}
              onChange={onSearch}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
            />
          </div>

          {/* Placeholder content */}
          <p className="text-sm text-gray-500">No data to display.</p>

          {/* Uncomment to show a blank table instead of the message */}
          {/* <BasicTableOne columns={columns} data={data} /> */}
        </ComponentCard>
      </div>
    </div>
  );
};

export default CanceledRequests;
