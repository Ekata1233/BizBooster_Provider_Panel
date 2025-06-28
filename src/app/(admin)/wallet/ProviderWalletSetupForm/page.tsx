"use client";

import { useAuth } from "@/app/context/AuthContext";
import React, { useState } from "react";

const ProviderWalletSetupForm: React.FC = () => {
    const { providerDetails } = useAuth();
    const providerId = providerDetails?._id;
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        bankAccount: "",
        ifsc: "",
        upiId: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("https://biz-booster.vercel.app/api/provider/wallet/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ providerId, ...formData }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setMessage({ type: "success", text: data.message });
        } catch (error) {
            console.log("error")
            // setMessage({ type: "error", text: error.message || "Failed to setup wallet" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">Setup Wallet for Provider</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    name="bankAccount"
                    placeholder="Bank Account Number"
                    value={formData.bankAccount}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    name="ifsc"
                    placeholder="IFSC Code"
                    value={formData.ifsc}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    name="upiId"
                    placeholder="Optional UPI ID"
                    value={formData.upiId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>

                {message && (
                    <p className={`mt-2 text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                        {message.text}
                    </p>
                )}
            </form>
        </div>
    );
};

export default ProviderWalletSetupForm;
