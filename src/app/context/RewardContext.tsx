"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export interface Reward {
  _id?: string;
  user: string;
  rewardName: string;
  rewardPhoto?: string;
  rewardDescription?: string;
  disclaimer?: string;
  isAdminApproved?: boolean;
  isClaimSettled?: boolean;
  isClaimRequest?: boolean;
}

interface RewardContextProps {
  rewards: Reward[];
  fetchRewards: () => Promise<void>;
  createReward: (data: FormData) => Promise<void>;
  updateReward: (id: string, data: FormData) => Promise<void>;
  deleteReward: (id: string) => Promise<void>;
}

const RewardContext = createContext<RewardContextProps | null>(null);
export const useReward = () => useContext(RewardContext)!;

export const RewardProvider = ({ children }: { children: React.ReactNode }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);

  const fetchRewards = async () => {
    const res = await axios.get("/api/rewards");
    setRewards(res.data.data);
  };

  const createReward = async (data: FormData) => {
    await axios.post("/api/rewards", data);
    await fetchRewards();
  };

  const updateReward = async (id: string, data: FormData) => {
    await axios.put(`/api/rewards/${id}`, data);
    await fetchRewards();
  };

  const deleteReward = async (id: string) => {
    await axios.delete(`/api/rewards/${id}`);
    await fetchRewards();
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  return (
    <RewardContext.Provider
      value={{ rewards, fetchRewards, createReward, updateReward, deleteReward }}
    >
      {children}
    </RewardContext.Provider>
  );
};
