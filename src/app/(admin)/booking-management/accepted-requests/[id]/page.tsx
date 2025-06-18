'use client';

import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

const AcceptedBookingDetails = () => {

  return (
    <div>
      <PageBreadcrumb pageTitle="Accepted Booking Details" />
      <div className="space-y-6">
        <ComponentCard title="Accepted Booking Details">
          <div></div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default AcceptedBookingDetails;
