import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React from 'react'

const page = () => {
    return (
        <div>
            <PageBreadcrumb pageTitle="My Subscription" />
            <div className="space-y-6">
                <ComponentCard title="-">
                    <div></div>
                </ComponentCard>
            </div>
            <div className="space-y-6">
                <ComponentCard title="-">
                    <div></div>
                </ComponentCard>
            </div>
        </div>
    )
}

export default page