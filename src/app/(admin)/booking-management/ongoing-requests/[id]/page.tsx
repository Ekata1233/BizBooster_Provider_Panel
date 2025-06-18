'use client';

import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

const OngoingBookingDetails = () => {

  return (
    <div>
      <PageBreadcrumb pageTitle="Ongoing Booking Details" />
      <div className="space-y-6">
        <ComponentCard title="Ongoing Booking Details">
          <div></div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default OngoingBookingDetails;
