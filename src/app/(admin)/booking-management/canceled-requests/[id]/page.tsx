'use client';

import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

const CanceledBookingDetails = () => {

  return (
    <div>
      <PageBreadcrumb pageTitle="Canceled Booking Details" />
      <div className="space-y-6">
        <ComponentCard title="Canceled Booking Details">
          <div></div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default CanceledBookingDetails;
