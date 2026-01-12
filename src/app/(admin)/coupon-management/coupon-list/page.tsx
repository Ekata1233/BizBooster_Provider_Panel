import ComponentCard from '@/components/common/ComponentCard'
import PageBreadCrumb from '@/components/common/PageBreadCrumb'
import React from 'react'

const page = () => {
  return (
    <div>
      <PageBreadCrumb pageTitle="Coupon List" />
      <div className="space-y-6">
        <ComponentCard title="Coupon List">
          <div></div>
          {/* <BasicTableOne /> */}
        </ComponentCard>
      </div>
    </div>
  )
}

export default page