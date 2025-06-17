'use client';

import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import BasicTableOne from '@/components/tables/BasicTableOne';
import Input from '@/components/form/input/InputField';

const CompletedRequests = () => {
  const search = '';
  const onSearch = () => {};

  const columns = []; // Table column definitions placeholder
  const data = []; // Table data placeholder

  return (
    <div>
      <PageBreadcrumb pageTitle="Completed Requests" />
      <div className="space-y-6">
        <ComponentCard title="Completed Requests">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search services…"
              value={search}
              onChange={onSearch}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
            />
          </div>

          {/* Placeholder text */}
          <p className="text-sm text-gray-500">No data to display.</p>

          {/* To show an empty table instead, uncomment below */}
          {/* <BasicTableOne columns={columns} data={data} /> */}
        </ComponentCard>
      </div>
    </div>
  );
};

export default CompletedRequests;
