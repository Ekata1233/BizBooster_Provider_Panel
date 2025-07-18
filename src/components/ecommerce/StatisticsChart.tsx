"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import ChartTab from "../common/ChartTab";
import { useAuth } from "@/app/context/AuthContext";
import { useProviderWallet } from "@/app/context/WalletContext";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const { providerDetails } = useAuth();
  const { fetchWalletByProvider, wallet } = useProviderWallet();

const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
  {
    name: "Earnings",
    data: [],
  },
]);


  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (providerDetails?._id) {
      fetchWalletByProvider(providerDetails._id);
    }
  }, [providerDetails?._id]);

  useEffect(() => {
    if (wallet && wallet.transactions?.length > 0) {
      const earningsMap = new Map<string, number>();

      // Aggregate credits by month
      wallet.transactions.forEach((txn) => {
        if (txn.type === "credit") {
          const date = new Date(txn.createdAt);
          const month = date.toLocaleString("default", { month: "short" }); // Jan, Feb...
          earningsMap.set(month, (earningsMap.get(month) || 0) + txn.amount);
        }
      });

      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      const data = months.map((month) => earningsMap.get(month) || 0);
      setCategories(months);
      setSeries([
        {
          name: "Earnings",
          data,
        },
      ]);
    }
  }, [wallet]);

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      curve: "straight",
      width: [2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      x: { format: "dd MMM yyyy" },
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: { fontSize: "0px" },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Monthly earnings from wallet credits
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
