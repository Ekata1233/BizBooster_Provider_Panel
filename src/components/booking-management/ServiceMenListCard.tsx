"use client";

import { useCheckout } from "@/app/context/CheckoutContext";
import React, { useState, useEffect, useRef } from "react";

type ServiceMan = {
  _id: string;
  name: string;
  lastName: string;
  phoneNo: string;
  generalImage?: string;
  businessInformation?: {
    identityType?: string;
    identityNumber?: string;
  };
};

type ServiceMenListCardProps = {
  checkoutId?: string;
  visibleServiceMen: ServiceMan[];
  totalServiceMen: number;
  showAll: boolean;
  disableAssign?: boolean;
  setShowAll: React.Dispatch<React.SetStateAction<boolean>>;
};

const ServiceMenListCard = ({
  checkoutId,
  visibleServiceMen,
  totalServiceMen,
  showAll,
  setShowAll,
  disableAssign = false,
}: ServiceMenListCardProps) => {
  const [selectedManId, setSelectedManId] = useState<string | null>(null);
  const [assignedManId, setAssignedManId] = useState<string | null>(null);

  const { checkoutDetails, fetchCheckoutsDetailsById, updateCheckoutById } =
    useCheckout();

  // Prevent duplicate API calls across mounts/renders for a given checkoutId
  const isCalledRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!checkoutId) return;

    // If we already have checkoutDetails for this checkoutId, don't fetch again
    if (
      checkoutDetails &&
      // adjust depending on how checkoutDetails shape is; commonly _id or id
      (checkoutDetails._id === checkoutId || checkoutDetails.id === checkoutId)
    ) {
      // mark called so other mounts won't refetch
      isCalledRef.current[checkoutId] = true;
      console.log("➡️ Checkout details already present in context, skipping fetch.");
      return;
    }

    // If we've already called for this checkoutId, skip
    if (isCalledRef.current[checkoutId]) {
      console.log("➡️ Fetch already called for this checkoutId previously, skipping.");
      return;
    }

    const fetchData = async () => {
      try {
        // mark as called immediately to avoid race conditions or double requests
        isCalledRef.current[checkoutId] = true;
        await fetchCheckoutsDetailsById(checkoutId);
        console.log("✅ Checkout Details Fetched Successfully for", checkoutId);
      } catch (error) {
        // on error, clear the flag so a retry can happen later if desired
        isCalledRef.current[checkoutId] = false;
        console.error("❌ Error fetching checkout details:", error);
      }
    };

    fetchData();

    // No cleanup necessary here. We purposely do not reset the flag on unmount,
    // so StrictMode remount won't refetch repeatedly in dev.
  }, [checkoutId, checkoutDetails /* intentionally not including fetchCheckoutsDetailsById to avoid instability */]);

  // Log checkout details and set assigned service man if present
  useEffect(() => {
    if (checkoutDetails) {
      console.log("✅ Checkout Details Data:", checkoutDetails);
      if (checkoutDetails?.serviceMan) {
        setAssignedManId(checkoutDetails.serviceMan);
      }
    }
  }, [checkoutDetails]);

  // Assign serviceman handler
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
      const res = await updateCheckoutById(checkoutId, {
        serviceMan: selectedManId,
      });
      alert("Service Man Assigned successfully");
      console.log("✅ Updated Checkout:", res);

      const assignedManData = visibleServiceMen.find(
        (man) => man._id === selectedManId
      );
      console.log("✅ Assigned Service Man Data:", assignedManData);

      setAssignedManId(selectedManId);
    } catch (err) {
      alert("Service Man not assigned");
      console.error("Failed to assign service man", err);
    }
  };

  // Display assigned serviceman if already set
  const serviceMenToDisplay = assignedManId
    ? visibleServiceMen.filter((man) => man._id === assignedManId)
    : visibleServiceMen;

  return (
    <div className="px-8 py-6 bg-gray-100 m-3 rounded-xl">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
        Service Man Information
      </h4>
      <hr className="my-4 border-gray-300 dark:border-gray-700" />

      {checkoutDetails && checkoutDetails.isAccepted === false ? (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg mb-4">
          <p className="text-sm font-medium">
            ⚠️ Please accept the lead first before assigning a serviceman.
          </p>
        </div>
      ) : checkoutDetails?.isCompleted && !checkoutDetails?.serviceMan ? (
        // ✅ Show message only if completed and no serviceman assigned
        <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg mb-4">
          <p className="text-sm font-medium">
            ⚠️ This checkout is completed, but no serviceman was assigned.
          </p>
        </div>
      ) : (
        <>
          {serviceMenToDisplay.map((man: ServiceMan, index: number) => (
            <div key={index} className="flex items-center gap-5 mb-6">
              <div className="flex items-center gap-2">
                {/* Only show checkbox if no serviceman is assigned */}
                {!assignedManId && (
                  <input
                    type="checkbox"
                    checked={selectedManId === man._id}
                    onChange={() => setSelectedManId(man._id)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                )}
                <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100">
                  <img
                    src={man.generalImage || "/default-profile.png"}
                    alt={man.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-1 ms-2">
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  <strong>Name:</strong> {man.name} {man.lastName}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  <strong>Phone:</strong> {man.phoneNo}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  <strong>Address:</strong>{" "}
                  {man.businessInformation?.identityType || "N/A"} -{" "}
                  {man.businessInformation?.identityNumber || "N/A"}
                </p>
              </div>
            </div>
          ))}

          {/* Show "Show More" only if serviceman is not yet assigned */}
          {!showAll && totalServiceMen > 2 && !assignedManId && (
            <button
              onClick={() => setShowAll(true)}
              className="text-blue-600 hover:underline text-sm mt-2"
            >
              Show More
            </button>
          )}

          {/* Assign button only when no serviceman is assigned */}
          {!assignedManId && (
            <div className="text-center">
              <button
                onClick={handleAssign}
                className="bg-blue-500 text-white px-7 my-3 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Assign Serviceman
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ServiceMenListCard;
