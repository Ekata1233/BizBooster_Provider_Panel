import React from 'react'

const ServiceMenListCard = ({ visibleServiceMen, totalServiceMen, showAll, setShowAll }: any) => (
  <div className="px-8 py-6 bg-gray-100 m-3 rounded-xl">
    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Service Man Information</h4>
    <hr className="my-4 border-gray-300 dark:border-gray-700" />
    {visibleServiceMen.map((man: any, index: number) => (
      <div key={index} className="flex items-center gap-5 mb-6">
        <img
          src={man.generalImage || "/default-profile.png"}
          alt={man.name}
          className="w-16 h-16 rounded-full object-cover border border-gray-300"
        />
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
  </div>
);


export default ServiceMenListCard