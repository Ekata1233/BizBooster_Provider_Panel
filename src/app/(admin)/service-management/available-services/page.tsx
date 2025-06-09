"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useCategory } from "@/app/context/CategoryContext";
import { ModuleType, useModule } from "@/app/context/ModuleContext";
import { useService } from "@/app/context/ServiceContext";
import { useSubcategory } from "@/app/context/SubCategoryContext";
import { useSubscribe } from "@/app/context/SubscribeContext";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import AllServices from "@/components/service/AllServices";
import { ChevronDownIcon } from "@/icons";
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
    const { subscribeToService, subscribeStates } = useSubscribe();


    const { modules, loadingModules, errorModules } = useModule();
    const { categories, loadingCategories, errorCategories } = useCategory();
    const { subcategories, loadingSubcategories, errorSubcategories } = useSubcategory();
    const { services, loadingServices, errorServices, fetchSingleService } = useService();
<<<<<<< HEAD
    const { providerDetails } = useAuth();
=======
    const { providerDetails, token,refreshProviderDetails  } = useAuth();
>>>>>>> c31c36e0dbe15a6be6c5b16378071157247baa18

    console.log("Provider details : ", providerDetails)
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


    const filteredServices = services.filter(service => {

        if (selectedCategory && service.category?._id !== selectedCategory) return false;

        if (selectedSubcategory && service.subcategory?._id !== selectedSubcategory) return false;

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
                    </div>
                </ComponentCard>
            </div>

            {/* <div className="space-y-6 my-3">
                <ComponentCard title="All Services">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.length === 0 && (
                            <p className="text-center text-gray-500">No services found for the selected filters.</p>
                        )}

                        {filteredServices.map((service) => {
                            const state = subscribeStates[service._id] || {
                                loading: false,
                                error: null,
                                success: false,
                            };
                            return (
                                <div
                                    key={service._id}
                                    className="border rounded-md p-3 shadow hover:shadow-lg transition h-[340px] flex flex-col justify-between"
                                >
                                    <div
                                        onClick={() => handleClick(service._id)}
                                        className="cursor-pointer"
                                    >
                                        <img
                                            src={service.thumbnailImage || "https://via.placeholder.com/150"}
                                            alt={service.serviceName}
                                            className="w-full h-40 object-cover rounded"
                                        />

                                        <h3 className="mt-3 font-semibold text-lg truncate" title={service.serviceName}>
                                            {service.serviceName}
                                        </h3>

                                        <p
                                            className="text-sm text-gray-600 mt-1 truncate"
                                            title={service.category?.name}
                                        >
                                            {service.category?.name}
                                        </p>

                                        <div className="mt-2 flex items-center justify-between">
                                            <div>
                                                <span className="text-gray-400 line-through mr-2 text-sm">
                                                    ₹{service.price ?? "0"}
                                                </span>
                                                <span className="font-bold text-indigo-600 text-base">
                                                    ₹{service.discountedPrice ?? "0"}
                                                </span>
                                            </div>
                                            <PencilIcon className="w-5 h-5 text-gray-500 hover:text-indigo-600" />
                                        </div>


                                    </div>

                                    
                                   
                                    {(() => {
                                        const isAlreadySubscribed = providerDetails?.data?.subscribedServices?.includes(service._id);
                                        const debugInfo = {
                                            serviceId: service._id,
                                            serviceName: service.serviceName,
                                            isAlreadySubscribed,
                                            state,
                                        };
                                        console.log("🔍 DEBUG - Service Button Render Info:", debugInfo);

                                        return (
                                            <button
                                                onClick={() => handleSubscribeClick(service._id)}
                                                disabled={state.loading || state.success || isAlreadySubscribed}
                                                className={`w-full mt-3 font-semibold py-2 rounded
        ${isAlreadySubscribed
                                                        ? "bg-red-400 cursor-not-allowed"
                                                        : state.success
                                                            ? "bg-green-600 cursor-not-allowed"
                                                            : "bg-indigo-600 hover:bg-indigo-700 text-white"}
        ${state.loading ? "opacity-60 cursor-wait" : ""}
      `}
                                            >
                                                {isAlreadySubscribed
                                                    ? "Subscribed "
                                                    : state.loading
                                                        ? "Subscribing..."
                                                        : state.success
                                                            ? "Subscribed"
                                                            : "Subscribe"}
                                            </button>
                                        );
                                    })()}


                                </div>
                            )
                        })}

                    </div>
                </ComponentCard>
            </div> */}

            <AllServices
                services={filteredServices}
                subscribeStates={subscribeStates}
                providerSubscribedIds={providerDetails?.subscribedServices || []}
                onSubscribe={handleSubscribeClick}
                onView={handleClick}
            />

        </div>
    );
};

export default Page;
