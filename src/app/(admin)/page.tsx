'use client';
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect } from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import { useModal } from "@/hooks/useModal";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

// export const metadata: Metadata = {
//   title: "Provider Panel Dashboard | BizBooster - Next.js Dashboard Template",
// description: "This is the Next.js Home for the BizBooster Dashboard Template, provided by YourCompany.",

// };

export default function Ecommerce() {
  const { providerDetails } = useAuth();
  const { openModal } = useModal();
  const router = useRouter();

  useEffect(() => {
  if (providerDetails === null) {
    router.push("/signin");
  }
}, [providerDetails, router]);

  useEffect(() => {
    // Check KYC status and open modal if incomplete
    if (providerDetails && providerDetails.kycCompleted === false) {
      openModal();
    }
  }, [providerDetails, openModal]);

  console.log("provider details : ", providerDetails);

  // const handleLogout = () => {
  //   logout();
  //   router.push("/signin"); // Redirect to signin page after logout
  // };

  return (
  <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <RecentOrders />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <RecentOrders />
      </div>
    </div>
  );
}
