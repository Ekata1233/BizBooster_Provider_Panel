'use client';

import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

const CustomizedBookingDetails = () => {

  return (
    <div>
      <PageBreadcrumb pageTitle="Customized Booking Details" />
      <div className="space-y-6">
        <ComponentCard title="Customized Booking Details">
          <div></div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default CustomizedBookingDetails;
