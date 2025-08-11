// components/service/AllServices.tsx
"use client";

import React, { useEffect, useState } from "react";
import { PencilIcon } from "@/icons";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { useService } from "@/app/context/ServiceContext";
import { useAuth } from "@/app/context/AuthContext";

interface ProviderPrice {
    provider: { _id: string };      // adjust if you store more fields
    providerPrice: number;
    status: "approved" | "pending"; // add other statuses if you use them
}

interface Service {
    _id: string;
    serviceName: string;
    thumbnailImage: string;
    category?: { name: string };
    price?: number;
    discountedPrice?: number;
    subcategory?: unknown;
    providerPrices?: ProviderPrice[];
}

interface SubscribeState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

interface AllServicesProps {
    services: Service[];
    subscribeStates: Record<string, SubscribeState>;
    providerSubscribedIds: string[];
    onSubscribe: (serviceId: string) => void;
    onView: (serviceId: string) => void;
}

const AllServices: React.FC<AllServicesProps> = ({
    services,
    subscribeStates,
    providerSubscribedIds,
    onSubscribe,
    onView,
}) => {
    const { updateProviderPrice } = useService();
    const { provider, refreshProviderDetails } = useAuth();
    const { isOpen, openModal, closeModal } = useModal();
    const [price, setPrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    // console.log("selected service Id: ", selectedServiceId)
    const [localServices, setLocalServices] = useState<Service[]>(services);

    useEffect(() => {
        setLocalServices(services);
    }, [services]);


    const handleEdit = (id: string) => {
        const selectedPrice = localServices.find(item => item._id === id);
        setSelectedServiceId(id);
        if (selectedPrice) {
            setPrice(String(selectedPrice?.discountedPrice ?? ''));
            openModal();
        }
    };


    const handleUpdateData = async (e: React.MouseEvent<HTMLButtonElement>, selectedServiceId?: string,) => {

        // console.log("function called ")
        console.log(" service id in update funciton  : ", selectedServiceId)
        // console.log("selected provider id : ", provider?._id)
        e.preventDefault();
        if (!selectedServiceId || !provider?._id) return;



        setIsSubmitting(true);

        const updatedData = {
            providerPrices: [
                {
                    provider: provider._id,
                    providerPrice: price ? parseFloat(price) : null,
                },
            ],
        };
        
        const success = await updateProviderPrice(selectedServiceId, updatedData);

        if (success) {
            alert("Provider Price updated successfully");

            // Update local state immediately
            setLocalServices(prev =>
                prev.map(service =>
                    service._id === selectedServiceId
                        ? {
                            ...service,
                            providerPrices: [
                                ...(service.providerPrices || []).filter(p => p?.provider?._id !== provider._id),
                                {
                                    provider: { _id: provider._id },
                                    providerPrice: parseFloat(price),
                                    status: "pending",
                                },
                            ],
                        }
                        : service
                )
            );

            await refreshProviderDetails();
            closeModal();
        } else {
            alert("Failed to update price. Please try again.");
        }

        setIsSubmitting(false);
    };


    useEffect(() => {
        refreshProviderDetails();
    }, [refreshProviderDetails]);

    //   if (!providerDetails) return <div>Loading...</div>;
    return (
        <div className="space-y-6 my-3">
            <div className="border p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-4">All Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.length === 0 && (
                        <p className="text-center text-gray-500">
                            No services found for the selected filters.
                        </p>
                    )}

                    {localServices.map((service) => {

                        const state = subscribeStates[service._id] || {
                            loading: false,
                            error: null,
                            success: false,
                        };

                        const isAlreadySubscribed = providerSubscribedIds.some(
                            (subscribedService) => (subscribedService as unknown as { _id: string })._id === service._id
                        );

                        const providerEntry = service.providerPrices?.find(
                            pp => pp.provider?._id === provider?._id
                        );
                        const providerPrice = providerEntry?.providerPrice ?? null;
                        const providerStatus = providerEntry?.status ?? null;
                        // console.log("provdider status : ", providerStatus)
                        const isPendingStatus = providerPrice != null && providerStatus === "pending";
                        // ----------------------------------------------------------------

                        return (
                            <div
                                key={service._id}
                                className="border rounded-md p-3 shadow hover:shadow-lg transition h-[340px] flex flex-col justify-between"
                            >
                                <div onClick={() => onView(service._id)} className="cursor-pointer">
                                    <img
                                        src={service.thumbnailImage || "https://via.placeholder.com/150"}
                                        alt={service.serviceName}
                                        className="w-full h-40 object-cover rounded"
                                    />

                                    <h3 className="mt-3 font-semibold text-lg truncate" title={service.serviceName}>
                                        {service.serviceName}
                                    </h3>

                                    <p className="text-sm text-gray-600 mt-1 truncate" title={service.category?.name}>
                                        {service.category?.name}
                                    </p>

                                    <div className="mt-2 flex items-center justify-between">
                                        <div>
                                            {providerPrice != null ? (

                                                <>
                                                    <span className="text-gray-400 line-through mr-2 text-sm">
                                                        ₹{service.price ?? "0"}
                                                    </span>
                                                    <span className="text-gray-400 line-through mr-2 text-sm">
                                                        ₹{service.discountedPrice ?? "0"}
                                                    </span>
                                                    <span className="font-bold text-indigo-600 text-base">
                                                        ₹{providerPrice}
                                                    </span>
                                                </>
                                            ) : (

                                                <>
                                                    <span className="text-gray-400 line-through mr-2 text-sm">
                                                        ₹{service.price ?? "0"}
                                                    </span>
                                                    <span className="font-bold text-indigo-600 text-base">
                                                        ₹{service.discountedPrice ?? "0"}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <PencilIcon
                                            onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                                                e.stopPropagation();
                                                handleEdit(service._id);
                                            }}
                                            className="w-5 h-5 text-gray-500 hover:text-indigo-600"
                                        />
                                    </div>

                                </div>

                                <button
                                    onClick={(e) => {
                                        onSubscribe(service._id);
                                        handleUpdateData(e, service._id);
                                    }}

                                    disabled={
                                        state.loading ||
                                        state.success ||
                                        isAlreadySubscribed ||
                                        isPendingStatus
                                    }
                                    className={`
    w-full mt-3 font-semibold py-2 rounded
    ${isAlreadySubscribed
                                            ? "bg-red-400 cursor-not-allowed"
                                            : state.success
                                                ? "bg-green-600 cursor-not-allowed"
                                                : isPendingStatus
                                                    ? "bg-yellow-500 cursor-not-allowed"
                                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                        }
    ${state.loading ? "opacity-60 cursor-wait" : ""}
  `}
                                >
                                    {isAlreadySubscribed
                                        ? "Subscribed"
                                        : isPendingStatus
                                            ? "Pending"
                                            : state.loading
                                                ? "Subscribing..."
                                                : state.success
                                                    ? "Subscribed"
                                                    : "Subscribe"}
                                </button>

                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                        <div className="px-2 pr-14">
                            <h4 className="mb-5 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                Edit Service Price
                            </h4>
                        </div>

                        <form className="flex flex-col">
                            <div className="custom-scrollbar h-[80px] overflow-y-auto px-2 pb-3">
                                <div className="">
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 ">
                                        <div>
                                            <Label>Service Price</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={price}
                                                placeholder="Enter Price"
                                                onChange={(e) => setPrice(e.target.value)}
                                            />

                                        </div>


                                    </div>
                                </div>

                            </div>
                            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                                <Button size="sm" variant="outline" onClick={closeModal}>
                                    Close
                                </Button>
                                <button
                                    type="button"
                                    onClick={(e) => handleUpdateData(e, selectedServiceId ?? undefined)}
                                    disabled={isSubmitting}
                                    style={{
                                        padding: "0.5rem 1rem",
                                        fontSize: "14px",
                                        borderRadius: "4px",
                                        backgroundColor: "#007BFF",
                                        color: "#fff",
                                        border: "none",
                                        cursor: isSubmitting ? "not-allowed" : "pointer",
                                        opacity: isSubmitting ? 0.6 : 1,
                                    }}
                                >
                                    {isSubmitting ? "Updating..." : "Update & Subscribe"}
                                </button>

                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default AllServices;
