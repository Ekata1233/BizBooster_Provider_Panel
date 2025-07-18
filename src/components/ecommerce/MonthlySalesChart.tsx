'use client';

import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { MoreDotIcon } from '@/icons';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { useEffect, useState } from 'react';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { useAuth } from '@/app/context/AuthContext';
import { useProviderWallet } from '@/app/context/WalletContext';


const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export default function MonthlySalesChart() {
  const [isOpen, setIsOpen] = useState(false);
  const { providerDetails } = useAuth();
  const { fetchWalletByProvider, wallet, loading, error } = useProviderWallet();

  useEffect(() => {
    if (providerDetails?._id) {
      fetchWalletByProvider(providerDetails._id);
    }
  }, [providerDetails?._id]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // Prepare monthly data
  const monthlyCredits = Array(12).fill(0); // Jan to Dec

  wallet?.transactions?.forEach((txn) => {
    if (txn.type === 'credit') {
      const month = new Date(txn.createdAt).getMonth(); // 0 = Jan, 11 = Dec
      monthlyCredits[month] += txn.amount;
    }
  });

  const options: ApexOptions = {
    colors: ['#465fff'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'bar',
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '39%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Outfit',
    },
    yaxis: { title: { text: undefined } },
    grid: {
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (val: number) => `₹${val}`,
      },
    },
  };

  const series = [
    {
      name: 'Monthly Credits',
      data: monthlyCredits,
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error occurred.</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem onItemClick={closeDropdown}>View More</DropdownItem>
            <DropdownItem onItemClick={closeDropdown}>Delete</DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={180}
          />
        </div>
      </div>
    </div>
  );
}
