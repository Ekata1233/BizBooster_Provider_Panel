"use client"
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

export interface ModuleType {
    _id: string;
    name: string;
}

interface ModuleContextType {
    modules: ModuleType[];
    loadingModules: boolean;
    errorModules: string | null;
    refetchModules: () => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

interface ModuleProviderProps {
    children: ReactNode;
}

export const ModuleProvider: React.FC<ModuleProviderProps> = ({ children }) => {
    const [modules, setModules] = useState<ModuleType[]>([]);
    const [loadingModules, setLoadingModules] = useState<boolean>(true);
    const [errorModules, setErrorModules] = useState<string | null>(null);

    const fetchModules = async () => {
        setLoadingModules(true);
        try {
            const res = await axios.get("https://api.fetchtrue.com/api/modules");
            setModules(res.data?.data || []);
            setErrorModules(null);
        } catch (err) {
            console.error("Failed to fetch modules:", err);
            setErrorModules("Something went wrong while fetching modules.");
        } finally {
            setLoadingModules(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    return (
        <ModuleContext.Provider
            value={{
                modules,
                loadingModules,
                errorModules,
                refetchModules: fetchModules,
            }}
        >
            {children}
        </ModuleContext.Provider>
    );
};

export const useModule = (): ModuleContextType => {
    const context = useContext(ModuleContext);
    if (!context) {
        throw new Error("useModule must be used within a ModuleProvider");
    }
    return context;
};
