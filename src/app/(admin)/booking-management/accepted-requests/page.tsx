'use client';

import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import BasicTableOne from '@/components/tables/BasicTableOne';
import Input from '@/components/form/input/InputField';

const AcceptedRequests = () => {
  const search = '';
  const onSearch = () => {};

  const columns = []; // placeholder
  const data = []; // placeholder

  return (
    <div>
      <PageBreadcrumb pageTitle="Accepted Requests" />
      <div className="space-y-6">
        <ComponentCard title="Accepted Requests">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search services…"
              value={search}
              onChange={onSearch}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
            />
          </div>

          {/* Placeholder message or table */}
          <p className="text-sm text-gray-500">No data to display.</p>

          {/* Optional placeholder for table */}
          {/* <BasicTableOne columns={columns} data={data} /> */}
        </ComponentCard>
      </div>
    </div>
  );
};

export default AcceptedRequests;
