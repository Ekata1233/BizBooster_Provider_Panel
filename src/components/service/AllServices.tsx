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
    provider: { _id: string };
   
    providerPrice: number;
    providerMRP?: number;
    providerDiscount?: number;
    status: "approved" | "pending";
}

interface Service {
    _id: string;
    serviceName: string;
    thumbnailImage: string;
    category?: { name: string };
    price?: number;
    discountedPrice?: number;
    discount?: number;
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

    const [price, setPrice] = useState("");
    const [mrp, setMrp] = useState("");
    const [discount, setDiscount] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    const [localServices, setLocalServices] = useState<Service[]>(services);
    console.log("All Services : ", services);

    // ✅ Automatically calculate Provider Service Price when MRP & Discount change
    useEffect(() => {
        if (mrp && discount) {
            const mrpValue = parseFloat(mrp);
            const discountValue = parseFloat(discount);
            if (!isNaN(mrpValue) && !isNaN(discountValue)) {
                const calculatedPrice = mrpValue - (mrpValue * discountValue / 100);
                setPrice(calculatedPrice.toFixed(2));
            }
        }
    }, [mrp, discount]);

    useEffect(() => {
        setLocalServices(services);
    }, [services]);

    const handleEdit = (id: string) => {
        const selectedPrice = localServices.find(item => item._id === id);
        setSelectedServiceId(id);
        console.log("provider entry :", selectedPrice);

        if (selectedPrice) {
            setPrice(String(selectedPrice?.discountedPrice ?? ""));
            setMrp(String(selectedPrice?.price ?? ""));
            setDiscount(String(selectedPrice?.discount ?? ""));
            openModal();
        }
    };

    const handleUpdateData = async (
        e: React.MouseEvent<HTMLButtonElement>,
        selectedServiceId?: string,
        isDirectSubscribe = false // ✅ New flag
    ) => {
        e.preventDefault();
        if (!selectedServiceId || !provider?._id) return;

        setIsSubmitting(true);

        const updatedData = {
            providerPrices: [
                {
                    provider: provider._id,
                    providerPrice: price ? parseFloat(price) : null,
                    providerMRP: mrp ? parseFloat(mrp) : null,
                    providerDiscount: discount ? parseFloat(discount) : null,
                    status: isDirectSubscribe ? "approved" : "pending", // ✅ Decide status
                },
            ],
        };


        const success = await updateProviderPrice(selectedServiceId, updatedData);

        if (success) {
            alert(
                isDirectSubscribe
                    ? "Service subscribed successfully."
                    : "Provider Price updated successfully. Waiting for admin approval."
            );

            setLocalServices(prev =>
                prev.map(s =>
                    s._id === selectedServiceId
                        ? {
                            ...s,
                            providerPrices: [
                                ...(s.providerPrices || []).filter(
                                    p => p?.provider?._id !== provider._id
                                ),
                                {
                                    provider: { _id: provider._id },
                                    providerPrice: parseFloat(price),
                                    providerMRP: mrp ? parseFloat(mrp) : undefined,
                                    providerDiscount: discount ? parseFloat(discount) : undefined,
                                    status: isDirectSubscribe ? "approved" : "pending", // ✅ Update local too
                                },
                            ],
                        }
                        : s
                )
            );

            if (!providerSubscribedIds.includes(selectedServiceId)) {
                providerSubscribedIds.push(selectedServiceId);
            }

            await refreshProviderDetails();
            closeModal();
        }

        setIsSubmitting(false);
    };


    useEffect(() => {
        refreshProviderDetails();
    }, [services, refreshProviderDetails]);

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

                    {localServices.map(service => {
                        const state = subscribeStates[service._id] || {
                            loading: false,
                            error: null,
                            success: false,
                        };

                        const providerEntry = service.providerPrices?.find(
                            pp => pp.provider?._id === provider?._id
                        );
                        const providerPrice = providerEntry?.providerPrice ?? null;
                        const providerMRP = providerEntry?.providerMRP ?? null;
                        const providerDiscount = providerEntry?.providerDiscount ?? null;

                        const providerStatus = providerEntry?.status ?? null;

                        const isPendingStatus =
                            providerPrice != null && providerStatus === "pending";
                        const isApprovedStatus =
                            providerPrice != null && providerStatus === "approved";

                        return (
                            <div
                                key={service._id}
                                className="border rounded-md p-3 shadow hover:shadow-lg transition h-[360px] flex flex-col justify-between"
                            >
                                <div
                                    onClick={() => onView(service._id)}
                                    className="cursor-pointer"
                                >
                                    <img
                                        src={
                                            service.thumbnailImage ||
                                            "https://via.placeholder.com/150"
                                        }
                                        alt={service.serviceName}
                                        className="w-full h-40 object-cover rounded"
                                    />

                                    <h3
                                        className="mt-3 font-semibold text-lg truncate"
                                        title={service.serviceName}
                                    >
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
                                            {providerPrice != null ? (
                                                <>
                                                    {/* First line - Original prices */}
                                                    <div>
                                                        <span className="text-gray-400 line-through mr-2 text-sm">
                                                            ₹{service.price ?? "0"}
                                                        </span>
                                                        <span className="text-gray-400 line-through mr-2 text-sm">
                                                            ₹{service.discountedPrice ?? "0"}
                                                        </span>
                                                    </div>
                                                    {/* Second line - Provider prices */}
                                                    <div>
                                                        <span className="mr-2 text-gray-400 line-through mr-2 text-sm">
                                                            ₹{providerMRP}
                                                        </span>
                                                        <span className="mr-2 text-sm text-green-600">
                                                            {providerDiscount}% off
                                                        </span>
                                                        <span className="font-bold text-indigo-600 text-base">
                                                            ₹{providerPrice}
                                                        </span>
                                                    </div>
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
                                    onClick={e => {
                                        onSubscribe(service._id);
                                        handleUpdateData(e, service._id, true); // ✅ Direct subscribe
                                    }}
                                    disabled={state.loading || isApprovedStatus || isPendingStatus}
                                    className={`
        w-full mt-3 font-semibold py-2 rounded
        ${isApprovedStatus
                                            ? "bg-red-400 cursor-not-allowed"
                                            : isPendingStatus
                                                ? "bg-yellow-500 cursor-not-allowed"
                                                : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                        }
        ${state.loading ? "opacity-60 cursor-wait" : ""}
    `}
                                >
                                    {isApprovedStatus
                                        ? "Subscribed"
                                        : isPendingStatus
                                            ? "Pending"
                                            : state.loading
                                                ? "Subscribing..."
                                                : "Subscribe"}
                                </button>

                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal for Editing Price */}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full max-w-[700px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-5 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Subscribed Edit Service Price
                        </h4>
                    </div>

                    <form className="flex flex-col">
                        <div className="px-2 pb-3">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                                <div>
                                    <Label>Provider Service MRP</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={mrp}
                                        placeholder="Enter MRP"
                                        onChange={e => setMrp(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Provider Service Discount</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={discount}
                                        placeholder="Enter Discount"
                                        onChange={e => setDiscount(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Provider Service Price</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={price}
                                        placeholder="Enter Price"
                                        onChange={e => setPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>
                            <button
                                type="button"
                                onClick={e =>
                                    handleUpdateData(e, selectedServiceId ?? undefined)
                                }
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
    );
};

export default AllServices;
