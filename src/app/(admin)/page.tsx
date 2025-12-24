"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useMemo, useState } from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, AlertTriangle, ArrowRight } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { motion } from "framer-motion";
import TopServices from "@/components/ecommerce/TopServices";

type PendingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pendingState: {
    title: string;
    message: string;
    cta: { href: string; label: string } | null;
  } | null;
  step1Completed: boolean;
  storeInfoCompleted: boolean;
  kycCompleted: boolean;
};

// Modal wrapper for pending state
function PendingModal({
  isOpen,
  onClose,
  pendingState,
  step1Completed,
  storeInfoCompleted,
  kycCompleted,
}: PendingModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl mx-auto p-10 rounded-3xl shadow-2xl 
             bg-gradient-to-br from-blue-50 via-white to-purple-50 text-center"
      showCloseButton={false}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col items-center gap-3 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {pendingState?.cta ? (
          <AlertTriangle className="h-12 w-12 text-yellow-500 animate-bounce" />
        ) : (
          <Check className="h-12 w-12 text-green-500 animate-bounce" />
        )}
        <h2 className="text-3xl font-bold text-gray-800 drop-shadow-md">
          {pendingState?.title}
        </h2>
      </motion.div>

      {/* Message */}
      <motion.p
        className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {pendingState?.message}
      </motion.p>

      {/* CTA */}
      {pendingState?.cta && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        >
          <Link
            href={pendingState.cta.href}
            className="inline-flex items-center gap-2 rounded-xl 
                   bg-gradient-to-r from-indigo-600 to-purple-500 px-8 py-4 
                   font-semibold text-white shadow-lg hover:from-indigo-700 
                   hover:to-purple-600 transition transform hover:scale-105"
          >
            {pendingState.cta.label}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      )}

      {/* Progress Section */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <h3 className="text-sm font-semibold text-gray-500 mb-6">
          Progress Overview
        </h3>
        <div className="grid grid-cols-3 gap-6 justify-center">
          {/* Step 1 */}
          <div
            className={`rounded-2xl p-6 flex flex-col items-center justify-center shadow-md transition ${step1Completed
                ? "bg-green-100 border border-green-300 text-green-700"
                : "bg-white border border-gray-200 text-gray-400"
              }`}
          >
            <Check
              className={`h-6 w-6 mb-2 ${step1Completed ? "text-green-600" : "text-gray-400"
                }`}
            />
            <p className="text-sm font-semibold">
              {step1Completed ? "Done" : "Pending"}
            </p>
            <p className="text-xs">Registration</p>
          </div>

          {/* Step 2 */}
          <div
            className={`rounded-2xl p-6 flex flex-col items-center justify-center shadow-md transition ${storeInfoCompleted
                ? "bg-green-100 border border-green-300 text-green-700"
                : "bg-white border border-gray-200 text-gray-400"
              }`}
          >
            <Check
              className={`h-6 w-6 mb-2 ${storeInfoCompleted ? "text-green-600" : "text-gray-400"
                }`}
            />
            <p className="text-sm font-semibold">
              {storeInfoCompleted ? "Done" : "Pending"}
            </p>
            <p className="text-xs">Store Info</p>
          </div>

          {/* Step 3 */}
          <div
            className={`rounded-2xl p-6 flex flex-col items-center justify-center shadow-md transition ${kycCompleted
                ? "bg-green-100 border border-green-300 text-green-700"
                : "bg-white border border-gray-200 text-gray-400"
              }`}
          >
            <Check
              className={`h-6 w-6 mb-2 ${kycCompleted ? "text-green-600" : "text-gray-400"
                }`}
            />
            <p className="text-sm font-semibold">
              {kycCompleted ? "Done" : "Pending"}
            </p>
            <p className="text-xs">KYC</p>
          </div>
        </div>
      </motion.div>

      {/* Note */}
      <motion.p
        className="mt-8 text-xs text-gray-500 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        💡 Tip: Use the button above to complete the next step quickly.
      </motion.p>
    </Modal>
  );
}

export default function Ecommerce() {
  const { providerDetails, refreshProviderDetails, logout } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  console.log("provider details in dashboard  : ", providerDetails)

  useEffect(() => {
    if (!providerDetails) {
      router.push("/signin");
    }
    // ❌ Rejected provider → logout and redirect to /signup
    else if ((providerDetails.isRejected && !providerDetails.isApproved) || providerDetails.isDeleted) {
      logout?.(); // Clear auth
      router.push("/signup");
    }
    // 🔔 Not approved → show pending modal
    else if (!providerDetails.isApproved) {
      setIsOpen(true);
    }
  }, [providerDetails, router, logout]);

  useEffect(() => {
    refreshProviderDetails();
  }, [refreshProviderDetails]);

  const {
    isApproved = false,

    step1Completed = false,
    storeInfoCompleted = false,
    kycCompleted = false,
  } = providerDetails ?? {};

  const pendingState = useMemo(() => {
    if (providerDetails && !isApproved) {
      if (!step1Completed) {
        return {
          title: "Complete Registration",
          message: "Please complete your registration first to proceed.",
          cta: { href: "/signup", label: "Go to Registration" },
        };
      }
      if (!storeInfoCompleted) {
        return {
          title: "Store Information Pending",
          message:
            "Your registration is complete. Please fill in your store information to continue.",
          cta: { href: "/signup", label: "Complete Store Info" },
        };
      }
      if (!kycCompleted) {
        return {
          title: "KYC Pending",
          message:
            "Your store info is complete. Please upload your KYC documents.",
          cta: { href: "/signup", label: "Upload KYC Documents" },
        };
      }
      return {
        title: "Admin Approval Pending",
        message:
          "All steps are complete. Your account is under review. You’ll be notified once approved.",
        cta: null,
      };
    }
    return null;
  }, [providerDetails, isApproved, step1Completed, storeInfoCompleted, kycCompleted]);

  return (
    <>
      {/* Dashboard content */}
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
          <TopServices />
        </div>
      </div>

      {/* Show pending modal if provider exists and not approved */}
      {providerDetails && !isApproved && pendingState && (
        <PendingModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          pendingState={pendingState}
          step1Completed={step1Completed}
          storeInfoCompleted={storeInfoCompleted}
          kycCompleted={kycCompleted}
        />
      )}
    </>
  );
}
