import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React from 'react'

const page = () => {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bank Information" />

      <div className="my-5">
        <ComponentCard title="Account Details">
          <div className="mb-4 space-y-6">
            {/* Row 1: Holder Name */}
            <div>
              <p className="text-sm font-semibold text-gray-900">Holder Name</p>
              <p className="text-base text-gray-600">Rahul Sharma</p>
            </div>

            {/* Row 2: Bank Name + Branch Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-900">Bank Name</p>
                <p className="text-base text-gray-600">
                  International Chartered Bank
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Branch Name</p>
                <p className="text-base text-gray-600">London</p>
              </div>
            </div>

            {/* Row 3: Account Number + IFSC Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-900">Account Number</p>
                <p className="text-base text-gray-600">1234567890</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">IFSC Number</p>
                <p className="text-base text-gray-600">ICBK0001234</p>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  )
}

export default page
