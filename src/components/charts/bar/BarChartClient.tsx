'use client';

import dynamic from 'next/dynamic';

const BarChartOne = dynamic(
  () => import('./BarChartOne'),
  { 
    ssr: false,
    loading: () => <p>Loading chart...</p> // Optional loading fallback
  }
);

export default function BarChartClient() {
  return <BarChartOne />;
}