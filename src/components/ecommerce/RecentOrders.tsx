"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useAuth } from "@/app/context/AuthContext";
import { useCheckout } from "@/app/context/CheckoutContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RecentOrders() {
  const { providerDetails } = useAuth();
  const {
    fetchCheckoutsByProviderId,
    checkouts,
    loadingCheckouts,
    errorCheckouts,
  } = useCheckout();
  const router = useRouter();


  const handleClick = () => {
    router.push('/booking-management/all-bookings');
  };

  useEffect(() => {
    if (providerDetails?._id) {
      fetchCheckoutsByProviderId(providerDetails._id);
    }
  }, [providerDetails?._id]);

  if (loadingCheckouts) return <p>Loading...</p>;
  if (errorCheckouts) return <p>Error occurred.</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Orders
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Filter
          </button>
          <button onClick={handleClick} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 text-start text-theme-xs text-gray-500 font-medium dark:text-gray-400">
                Customer
              </TableCell>
              <TableCell isHeader className="py-3 text-start text-theme-xs text-gray-500 font-medium dark:text-gray-400">
                Booking ID
              </TableCell>
              <TableCell isHeader className="py-3 text-start text-theme-xs text-gray-500 font-medium dark:text-gray-400">
                Amount
              </TableCell>
              <TableCell isHeader className="py-3 text-start text-theme-xs text-gray-500 font-medium dark:text-gray-400">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {checkouts.length === 0 ? (
              <TableRow>
                <TableCell className="py-6 text-center" >
                  <div className="text-gray-500 text-theme-sm dark:text-gray-400">
                   No orders found
                  </div>
                </TableCell>
              </TableRow>
            ) : (checkouts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4).map((checkout) => (
              <TableRow key={checkout._id}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {checkout.serviceCustomer?.fullName || "Unknown"}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {checkout.serviceCustomer?.email || "N/A"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {checkout.bookingId || "N/A"}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  ₹{checkout.totalAmount}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      checkout.orderStatus === "processing"
                        ? "warning"
                        : checkout.orderStatus === "completed"
                          ? "success"
                          : checkout.orderStatus === "cancelled"
                            ? "error"
                            : "primary"
                    }
                  >
                    {checkout.orderStatus}
                  </Badge>
                </TableCell>
              </TableRow>)
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
