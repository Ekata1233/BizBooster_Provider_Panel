"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

// Define the Service type (you can expand this based on your API response structure)
// export interface ServiceType {
//     _id: string;
//     name: string;
// }

interface RowData {
    title: string;
    description: string;
}

type FAQ = {
    question: string;
    answer: string;
};

type WhyChoose = {
    _id?: string;
};

export type ServiceDetails = {
    benefits: string;
    overview: string;
    highlight: File[] | FileList | null;
    document: string;
    howItWorks: string;
    terms: string;
    faqs: FAQ[];
    rows: RowData[];
    whyChoose: WhyChoose[];
    termsAndConditions?: string;
};

interface ExtraSection {
    title: string;
    description: string;
}


interface FranchiseDetails {
    overview: string;
    commission: string;
    howItWorks: string;
    termsAndConditions: string;
    extraSections?: ExtraSection[];
}

export interface Service {
    _id: string;
    serviceName: string;
    thumbnailImage: string;
    bannerImages: string[];
    category: { _id: string, name: string };
    subcategory: { _id: string, name: string };
    price: number;
    discountedPrice: number;
    tags?: string[];
    serviceDetails: ServiceDetails;
    franchiseDetails: FranchiseDetails;
    isDeleted: boolean;
}

interface ServiceContextType {
    services: Service[];
    loadingServices: boolean;
    errorServices: string | null;
    refetchServices: () => void;

    singleService: Service | null;
    loadingSingleService: boolean;
    errorSingleService: string | null;
    fetchSingleService: (id: string) => Promise<void>;

    updateProviderPrice: (id: string, data: unknown) => Promise<boolean>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

interface ServiceProviderProps {
    children: ReactNode;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [loadingServices, setLoadingServices] = useState<boolean>(true);
    const [errorServices, setErrorServices] = useState<string | null>(null);

    const [singleService, setSingleService] = useState<Service | null>(null);
    const [loadingSingleService, setLoadingSingleService] = useState<boolean>(false);
    const [errorSingleService, setErrorSingleService] = useState<string | null>(null);

    const fetchServices = async () => {
        setLoadingServices(true);
        try {
            const res = await axios.get("https://biz-booster.vercel.app/api/service");
            setServices(res.data?.data || []);
            setErrorServices(null);
        } catch (err) {
            console.error("Failed to fetch services:", err);
            setErrorServices("Something went wrong while fetching services.");
        } finally {
            setLoadingServices(false);
        }
    };

    const fetchSingleService = async (id: string) => {
        setLoadingSingleService(true);
        try {
            const res = await axios.get(`https://biz-booster.vercel.app/api/service/${id}`);
            setSingleService(res.data?.data || null);
            setErrorSingleService(null);
        } catch (err) {
            console.error("Failed to fetch single service:", err);
            setErrorSingleService("Something went wrong while fetching single service.");
        } finally {
            setLoadingSingleService(false);
        }
    };

    const updateProviderPrice = async (id: string, data: unknown): Promise<boolean> => {
        try {
            const res = await axios.put(`https://biz-booster.vercel.app/api/service/provider-price/${id}`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log("Update success:", res.data);
            return true;
        } catch (err) {
            console.error("Error updating provider price:", err);
            return false;
        }
    };


    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <ServiceContext.Provider
            value={{
                services,
                loadingServices,
                errorServices,
                refetchServices: fetchServices,
                singleService,
                loadingSingleService,
                errorSingleService,
                fetchSingleService,
                updateProviderPrice,
            }}
        >
            {children}
        </ServiceContext.Provider>
    );
};

export const useService = (): ServiceContextType => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error("useService must be used within a ServiceProvider");
    }
    return context;
};
