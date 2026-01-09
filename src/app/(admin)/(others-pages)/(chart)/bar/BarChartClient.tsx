"use client";

import dynamic from "next/dynamic";

const BarChartOne = dynamic(
  () => import("../bar-chart/"),
  { ssr: false }
);

export default function BarChartClient() {
  return <BarChartOne />;
}
