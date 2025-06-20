import { useCheckout } from '@/app/context/CheckoutContext';
import React, { useState } from 'react'

const ServiceMenListCard = ({ checkoutId, visibleServiceMen, totalServiceMen, showAll, setShowAll }: any) => {
  const [selectedManId, setSelectedManId] = useState<string | null>(null);
  const {
    checkoutDetails,
    updateCheckoutById, loadingUpdate, errorUpdate
  } = useCheckout();

  const handleAssign = async () => {
    if (!checkoutId) {
      console.error("No checkout ID found");
      return;
    }
    if (!selectedManId) {
      console.error("No service Man ID found");
      return;

    }
     try {
    const res = await updateCheckoutById(checkoutId, { serviceMan: selectedManId });
    alert("Service Man Assigned successfully");
  } catch (err) {
    alert("Service Man not assigned");
    console.error("Failed to assign service man", err);
  }
  };
  return (
    <div className="px-8 py-6 bg-gray-100 m-3 rounded-xl">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Service Man Information</h4>
      <hr className="my-4 border-gray-300 dark:border-gray-700" />
      {visibleServiceMen.map((man: any, index: number) => (
        <div key={index} className="flex items-center gap-5 mb-6">
          <div>
            <input
              type="checkbox"
              checked={selectedManId === man._id}
              onChange={() => setSelectedManId(man._id)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <img
              src={man.generalImage || "/default-profile.png"}
              alt={man.name}
              className="w-14 h-12 rounded-full object-cover border border-gray-300"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-700 dark:text-gray-200"><strong>Name:</strong> {man.name} {man.lastName}</p>
            <p className="text-sm text-gray-700 dark:text-gray-200"><strong>Phone:</strong> {man.phoneNo}</p>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              <strong>Address:</strong> {man.businessInformation?.identityType || 'N/A'} - {man.businessInformation?.identityNumber || 'N/A'}
            </p>
          </div>
        </div>
      ))}
      {!showAll && totalServiceMen > 2 && (
        <button onClick={() => setShowAll(true)} className="text-blue-600 hover:underline text-sm mt-2">
          Show More
        </button>
      )}
      <div className='text-center'>
        <button onClick={handleAssign} className="bg-blue-500 text-white px-7 my-3 py-2 rounded-md hover:bg-blue-600 transition duration-200">
          Assign Serviceman
        </button>
      </div>
    </div>
  )
};


export default ServiceMenListCard