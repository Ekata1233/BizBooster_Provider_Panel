"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useService } from "@/app/context/ServiceContext";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Review {
  _id: string;
  service: string;
  rating: number;
}

export default function TopServices() {
  const { services, loadingServices, errorServices } = useService();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [topServices, setTopServices] = useState<
    {
      _id: string;
      serviceName: string;
      categoryName: string;
      discountedPrice: number;
      avgRating: number;
      thumbnailImage: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("https://api.fetchtrue.com/api/service/review");
         console.log("Fetched Reviews:", res.data.reviews); // 🔍 log reviews response
        setReviews(res.data.reviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (!services || services.length === 0) return;
    if (!reviews || reviews.length === 0) return;
 console.log("All Services:", services); // 🔍 log services from context
    console.log("All Reviews:", reviews);
    // Group reviews by serviceId
    const reviewMap: Record<string, number[]> = {};
    reviews.forEach((r) => {
      if (!reviewMap[r.service]) reviewMap[r.service] = [];
      reviewMap[r.service].push(r.rating);
    });

    // Calculate avg rating for each service
    const serviceWithRating = services.map((s) => {
      const ratings = reviewMap[s._id] || [];
      const avg =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
      return {
        _id: s._id,
        serviceName: s.serviceName,
        categoryName: s.category?.name || "N/A",
        discountedPrice: s.discountedPrice,
        avgRating: avg,
        thumbnailImage: s.thumbnailImage,
      };
    });

    // Sort by avg rating and pick top 4
    const sorted = serviceWithRating
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 4);

    setTopServices(sorted);
  }, [services, reviews]);

  if (loadingServices) return <p>Loading services...</p>;
  if (errorServices) return <p>{errorServices}</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Top Services
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Filter
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs text-gray-500 font-medium dark:text-gray-400"
              >
                Service
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs text-gray-500 font-medium dark:text-gray-400"
              >
                Amount
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs text-gray-500 font-medium dark:text-gray-400"
              >
                Rating ⭐
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {topServices.map((s) => (
              <TableRow key={s._id}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">

                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md bg-gray-100">
                      <Image
                        width={50}
                        height={50}
                        src={s.thumbnailImage || "/images/fallback.png"}
                        alt={s.serviceName}
                        className="h-[50px] w-[50px] object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {s.serviceName}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {s.categoryName}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  ₹{s.discountedPrice}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {s.avgRating.toFixed(1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
