"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useCategory } from "@/app/context/CategoryContext";
import { ModuleType, useModule } from "@/app/context/ModuleContext";
import { useService } from "@/app/context/ServiceContext";
import { useSubcategory } from "@/app/context/SubCategoryContext";
import { useSubscribe } from "@/app/context/SubscribeContext";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import AllServices from "@/components/service/AllServices";
import { ChevronDownIcon} from "@/icons";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";

interface OptionType {
    value: string;
    label: string;
}

const Page = () => {
    const router = useRouter();
    const [selectedModule, setSelectedModule] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { subscribeToService, subscribeStates } = useSubscribe();

    const { modules, loadingModules, errorModules } = useModule();
    const { categories, loadingCategories, errorCategories } = useCategory();
    const { subcategories, loadingSubcategories, errorSubcategories } = useSubcategory();
    const { services, loadingServices, errorServices, fetchSingleService } = useService();
  
    const { providerDetails,refreshProviderDetails  } = useAuth();

    // 🔹 Module Options
    const modulesOptions: OptionType[] = modules.map((mod: ModuleType) => ({
        value: mod._id,
        label: mod.name,
    }));

    // 🔹 Filtered Category Options based on selected module
    const categoryOptions: OptionType[] = useMemo(() => {
        if (!selectedModule) return [];
        return categories
            .filter((cat) => cat.module._id === selectedModule)
            .map((cat) => ({
                value: cat._id,
                label: cat.name,
            }));
    }, [selectedModule, categories]);

    const subcategoryOptions: OptionType[] = useMemo(() => {
        if (!selectedCategory) return [];
        return subcategories
            .filter((sub) => sub.category._id === selectedCategory)
            .map((sub) => ({
                value: sub._id,
                label: sub.name,
            }));
    }, [selectedCategory, subcategories]);


    // 🔹 Handlers
    const handleModuleChange = (value: string) => {
        setSelectedModule(value);
        setSelectedCategory('');
        setSelectedSubcategory('');
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setSelectedSubcategory('');
    };

    const handleSubcategoryChange = (value: string) => {
        setSelectedSubcategory(value);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredServices = services.filter(service => {
        if (selectedCategory && service.category?._id !== selectedCategory) return false;

        if (selectedSubcategory && service.subcategory?._id !== selectedSubcategory) return false;

        if (searchQuery && !service.serviceName.toLowerCase().includes(searchQuery.toLowerCase())) return false;

        return true;
    });

    

    const handleClick = async (id: string) => {
        await fetchSingleService(id);
        router.push(`/service-management/available-services/${id}`);
    };

    const handleSubscribeClick = async (serviceId: string) => {
        try {
            await subscribeToService(serviceId);
            alert("Subscribed successfully!");
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(`Subscription failed: ${error.message}`);
            } else {
                alert(`Subscription failed: ${String(error)}`);
            }
        }
    };

      useEffect(() => {
        refreshProviderDetails();
      }, [refreshProviderDetails]);

      if (!providerDetails) return <div>Loading...</div>;

    if (loadingModules || loadingCategories || loadingSubcategories || loadingServices) return <p>Loading...</p>;
    if (errorModules) return <p>{errorModules}</p>;
    if (errorCategories) return <p>{errorCategories}</p>;
    if (errorSubcategories) return <p>{errorSubcategories}</p>;
    if (errorServices) return <p>{errorServices}</p>;
    return (
        <div>
            <PageBreadcrumb pageTitle="Available Services" />
            <div className="space-y-6">
                <ComponentCard title="Service Filter">
                    <div className="space-y-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 md:gap-6">
                        {/* Module Dropdown */}
                        <div>
                            <Label>Select Module</Label>
                            <div className="relative">
                                <Select
                                    options={modulesOptions}
                                    placeholder="Select Module"
                                    onChange={handleModuleChange}
                                    className="dark:bg-dark-900"
                                    value={selectedModule}
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>

                        {/* Category Dropdown */}
                        <div>
                            <Label>Select Category</Label>
                            <div className="relative">
                                <Select
                                    options={categoryOptions}
                                    placeholder="Select Category"
                                    onChange={handleCategoryChange}
                                    className="dark:bg-dark-900"
                                    value={selectedCategory}
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>

                        {/* Subcategory Dropdown */}
                        <div>
                            <Label>Select Subcategory</Label>
                            <div className="relative">
                                <Select
                                    options={subcategoryOptions}
                                    placeholder="Select Subcategory"
                                    onChange={handleSubcategoryChange}
                                    className="dark:bg-dark-900"
                                    value={selectedSubcategory}
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div>
                            <Label>Search Services</Label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Search by service name"
                                    className="w-full px-4 py-2 border rounded-md dark:bg-dark-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    {/* <SearchIcon /> */}
                                </span>
                            </div>
                        </div>
                    </div>
                </ComponentCard>
            </div>

            <AllServices
                services={filteredServices}
                subscribeStates={subscribeStates}
                // providerSubscribedIds={providerDetails?.subscribedServices || []}
                onSubscribe={handleSubscribeClick}
                onView={handleClick}
            />
        </div>
    );
};

export default Page;