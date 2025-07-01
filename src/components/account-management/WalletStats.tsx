"use client";
import React from "react";
import StatCard from "@/components/common/StatCard";
import { ArrowUpIcon, CalenderIcon, DollarLineIcon, UserIcon } from "@/icons";

interface WalletStatsProps {
  wallet: {
    receivableBalance: number;
    cashInHand: number;
    withdrawableBalance: number;
    pendingWithdraw: number;
    alreadyWithdrawn: number;
    totalEarning: number;
  };
}

const WalletStats: React.FC<WalletStatsProps> = ({ wallet }) => {
  const stats = [
    {
      title: "Receivable Balance",
      value: wallet.receivableBalance.toFixed(2),
      icon: UserIcon,
    },
    {
      title: "Cash in Hand",
      value: wallet.cashInHand.toFixed(2),
      icon: CalenderIcon,
    },
    {
      title: "Withdrawable Balance",
      value: wallet.withdrawableBalance.toFixed(2),
      icon: DollarLineIcon,
    },
    {
      title: "Pending Withdraw",
      value: wallet.pendingWithdraw.toFixed(2),
      icon: UserIcon,
    },
    {
      title: "Already Withdrawn",
      value: wallet.alreadyWithdrawn.toFixed(2),
      icon: CalenderIcon,
    },
    {
      title: "Total Earning",
      value: wallet.totalEarning.toFixed(2),
      icon: DollarLineIcon,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 my-5">
        {stats.slice(0, 3).map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            badgeColor="success"
            badgeValue="0.00%"
            badgeIcon={ArrowUpIcon}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 my-5">
        {stats.slice(3).map((stat, index) => (
          <StatCard
            key={index + 3}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            badgeColor="success"
            badgeValue="0.00%"
            badgeIcon={ArrowUpIcon}
          />
        ))}
      </div>
    </>
  );
};

export default WalletStats;
