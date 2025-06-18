'use client';

import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

const CompletedBookingDetails = () => {

  return (
    <div>
      <PageBreadcrumb pageTitle="Completed Booking Details" />
      <div className="space-y-6">
        <ComponentCard title="Completed Booking Details">
          <div></div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default CompletedBookingDetails;
