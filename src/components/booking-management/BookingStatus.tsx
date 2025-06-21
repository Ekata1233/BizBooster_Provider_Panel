import { CheckCircleIcon } from '@/icons'
import React from 'react'
interface Checkout {
  // Add actual fields if you use them in the future
  [key: string]: unknown;
}
interface BookingStatusProps {
  checkout: Checkout;
}
const steps = [
    {
        title: "Booking Placed",
        time: "22-Apr-2025 10:35am",
        by: "Anika",
    },
    {
        title: "Accepted",
        time: "22-Apr-2025 10:42am",
        by: "Ellison Cardenas Trading",
    },
    {
        title: "Ongoing",
        time: "22-Apr-2025 10:43am",
        by: "Ellison Cardenas Trading",
    },
    {
        title: "Completed",
        time: "22-Apr-2025 10:43am",
        by: "Ellison Cardenas Trading",
    },
];

const BookingStatus = ({checkout}:BookingStatusProps) => {
    console.log("checkout details in status : ", checkout)
    return (
        <div>
            <div className="relative ml-6 mt-6">
                {steps.map((step, index) => (
                    <div key={index} className="relative pl-10">
                        {/* Vertical line between steps (except last) */}
                        {index !== steps.length - 1 && (
                            <span className="absolute left-4.5 top-8 w-px h-full bg-green-500"></span>
                        )}

                        {/* Step Icon */}
                        <span className="absolute left-0 top-0 bg-green-400 rounded-full p-2 z-10">
                            <CheckCircleIcon className="text-white text-lg" />
                        </span>

                        {/* Step Content */}
                        <div className="mb-8 ml-7">
                            <h6 className="text-md font-semibold text-gray-700 dark:text-white">
                                {step.title}
                            </h6>
                            <p className="text-sm text-gray-500">{step.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BookingStatus