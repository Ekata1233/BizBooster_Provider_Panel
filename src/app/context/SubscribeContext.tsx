"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

interface SubscribeState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

interface SubscribeContextType {
    subscribeToService: (serviceId: string) => Promise<void>;
    subscribeStates: Record<string, SubscribeState>;
}

const SubscribeContext = createContext<SubscribeContextType | undefined>(undefined);

interface SubscribeProviderProps {
    children: ReactNode;
}

export const SubscribeProvider: React.FC<SubscribeProviderProps> = ({ children }) => {
    const { provider, token, refreshProviderDetails } = useAuth();

    const [subscribeStates, setSubscribeStates] = useState<Record<string, SubscribeState>>({});

    const API_URL = "https://biz-booster.vercel.app/api/provider/subscribe";

    const subscribeToService = async (serviceId: string) => {
        if (!provider?._id) {
            throw new Error("User is not authenticated");
        }

        const currentState = subscribeStates[serviceId];
        if (currentState?.loading) return;

        setSubscribeStates((prev) => ({
            ...prev,
            [serviceId]: { loading: true, error: null, success: false },
        }));

        try {
            const headers = {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            await axios.post(
                API_URL,
                {
                    providerId: provider._id,
                    serviceId,
                },
                { headers }
            );

            await refreshProviderDetails();

            setSubscribeStates((prev) => ({
                ...prev,
                [serviceId]: { loading: false, error: null, success: true },
            }));
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || error.message || "Error occurred";

            setSubscribeStates((prev) => ({
                ...prev,
                [serviceId]: {
                    loading: false,
                    error: errorMessage,
                    success: false,
                },
            }));

            // 🔥 THROW the error so it can be caught in the component
            throw new Error(errorMessage);
        }
    };

    return (
        <SubscribeContext.Provider value={{ subscribeToService, subscribeStates }}>
            {children}
        </SubscribeContext.Provider>
    );
};

export const useSubscribe = () => {
    const context = useContext(SubscribeContext);
    if (!context) {
        throw new Error("useSubscribe must be used within a SubscribeProvider");
    }
    return context;
};
