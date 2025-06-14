'use client';
import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

// export const metadata: Metadata = {
//   title: "Provider Panel Dashboard | BizBooster - Next.js Dashboard Template",
// description: "This is the Next.js Home for the BizBooster Dashboard Template, provided by YourCompany.",

// };

export default function Ecommerce() {
  const { providerDetails, logout } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();

  useEffect(() => {
    // Check KYC status and open modal if incomplete
    if (providerDetails && providerDetails.kycCompleted === false) {
      openModal();
    }
  }, [providerDetails, openModal]);

  console.log("provider details : ", providerDetails);

  const handleLogout = () => {
    logout();
    router.push("/signin"); // Redirect to signin page after logout
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>

      <div>
        <Modal isOpen={isOpen} onClose={closeModal}  showCloseButton={false} className="max-w-[600px] m-4">
          <div className="relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
            <div className="px-2 pr-10">
              <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                KYC Pending
              </h4>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Your KYC is pending. Please complete the KYC to proceed.
              </p>

              <div className="flex flex-col items-start gap-4">
                {/* Registration Button */}
                <Link href="/signup">
                  <button className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 transition">
                    Go to Registration Page
                  </button>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 font-medium text-red-700 rounded-lg border border-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-white/5 dark:hover:text-red-300 transition"
                >
                  <svg
                    className="fill-red-500 group-hover:fill-red-700 dark:group-hover:fill-red-300"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497V14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497V5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501H14.3507V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609H18.5007C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609V18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484H16.0007C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484H5.81528L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                      fill="currentColor"
                    />
                  </svg>
                  Sign out
                </button>

              </div>

            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
