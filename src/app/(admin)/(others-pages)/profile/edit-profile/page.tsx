// "use client";

// import React, { useEffect, useState } from "react";
// import { useAuth } from "@/app/context/AuthContext";
// import ComponentCard from "@/components/common/ComponentCard";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import Label from "@/components/form/Label";
// import Input from "@/components/form/input/InputField";

// export default function EditProfilePage() {
//     const { providerDetails } = useAuth();

//     const countries = [{ code: "IN", label: "+91" }]; // Extendable

//     const [fullName, setFullName] = useState(providerDetails?.fullName || "");
//     const [email, setEmail] = useState(providerDetails?.email || "");
//     const [phoneNo, setPhoneNo] = useState(providerDetails?.phoneNo || "");
//     const [storeName, setStoreName] = useState(providerDetails?.storeInfo?.storeName || "");
//     const [address, setAddress] = useState(providerDetails?.storeInfo?.address || "");
//     const [city, setCity] = useState(providerDetails?.storeInfo?.city || "");
//     const [state, setState] = useState(providerDetails?.storeInfo?.state || "");
//     const [country, setCountry] = useState(providerDetails?.storeInfo?.country || "");
//     const [storeEmail, setStoreEmail] = useState(providerDetails?.storeInfo?.storeEmail || "");
//     const [storePhone, setStorePhone] = useState(providerDetails?.storeInfo?.storePhone || "");

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         if (providerDetails) {
//             setFullName(providerDetails.fullName || "");
//             setEmail(providerDetails.email || "");
//             setPhoneNo(providerDetails.phoneNo || "");
//             setStoreName(providerDetails.storeInfo?.storeName || "");
//             setAddress(providerDetails.storeInfo?.address || "");
//             setCity(providerDetails.storeInfo?.city || "");
//             setState(providerDetails.storeInfo?.state || "");
//             setCountry(providerDetails.storeInfo?.country || "");
//             setStoreEmail(providerDetails.storeInfo?.storeEmail || "");
//             setStorePhone(providerDetails.storeInfo?.storePhone || "");
//         }
//     }, [providerDetails]);

//     const handleUpdate = async () => {
//         setLoading(true);
//         setError("");

//         try {
//             const response = await fetch(`https://api.fetchtrue.com/api/provider/${providerDetails?._id}`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     fullName,
//                     email,
//                     phoneNo,
//                     storeInfo: {
//                         storeName,
//                         address,
//                         city,
//                         state,
//                         country,
//                         storeEmail,
//                         storePhone,
//                     },
//                 }),
//             });

//             const data = await response.json();
//             console.log("Update API response:", data);
//             if (response.ok) {
//                 alert("Profile updated successfully!");
//             } else {
//                 setError("Failed to update profile.");
//             }
//         } catch (err: unknown) {
//             console.error(err);
//             setError("An error occurred while updating profile.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div>
//             <PageBreadcrumb pageTitle="Edit Profile" />

//             <div className="space-y-6">
//                 {/* Personal Info */}
//                 <ComponentCard title="Edit Profile">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <Label>Full Name</Label>
//                             <Input
//                                 placeholder="Full Name"
//                                 type="text"
//                                 value={fullName}
//                                 onChange={(e) => setFullName(e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <Label>Email</Label>
//                             <Input
//                                 placeholder="Email Address"
//                                 type="text"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <Label>Phone</Label>
//                             <Input
//                                 placeholder="+91 0000000000"
//                                 type="text"
//                                 value={phoneNo}
//                                 onChange={(e) => setPhoneNo(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                 </ComponentCard>

//                 {/* Store Info */}
//                 <ComponentCard title="Store Information">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <Label>Store Name</Label>
//                             <Input
//                                 placeholder="Store Name"
//                                 type="text"
//                                 value={storeName}
//                                 onChange={(e) => setStoreName(e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <Label>Address</Label>
//                             <Input
//                                 placeholder="Address"
//                                 type="text"
//                                 value={address}
//                                 onChange={(e) => setAddress(e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <Label>City</Label>
//                             <Input
//                                 placeholder="City"
//                                 type="text"
//                                 value={city}
//                                 onChange={(e) => setCity(e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <Label>State</Label>
//                             <Input
//                                 placeholder="State"
//                                 type="text"
//                                 value={state}
//                                 onChange={(e) => setState(e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <Label>Country</Label>
//                             <select
//                                 value={country}
//                                 onChange={(e) => setCountry(e.target.value)}
//                                 className="w-full border rounded p-2"
//                             >
//                                 {countries.map((c) => (
//                                     <option key={c.code} value={c.code}>
//                                         {c.code} ({c.label})
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <Label>Store Email</Label>
//                             <Input
//                                 placeholder="Store Email"
//                                 type="text"
//                                 value={storeEmail}
//                                 onChange={(e) => setStoreEmail(e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <Label>Store Phone</Label>
//                             <Input
//                                 placeholder="+91 0000000000"
//                                 type="text"
//                                 value={storePhone}
//                                 onChange={(e) => setStorePhone(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                 </ComponentCard>

//                 {/* Error */}
//                 {error && <p className="text-red-500">{error}</p>}

//                 {/* Save Button */}
//                 <div className="flex justify-end">
//                     <button
//                         onClick={handleUpdate}
//                         disabled={loading}
//                         className={`px-6 py-2 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//                             }`}
//                     >
//                         {loading ? "Updating..." : "Update"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

export default function EditProfilePage() {
    const { providerDetails, refreshProviderDetails } = useAuth();
    const countries = [{ code: "IN", label: "+91" }]; // Extendable

    const [fullName, setFullName] = useState(providerDetails?.fullName || "");
    const [email, setEmail] = useState(providerDetails?.email || "");
    const [phoneNo, setPhoneNo] = useState(providerDetails?.phoneNo || "");
    const [storeName, setStoreName] = useState(providerDetails?.storeInfo?.storeName || "");
    const [address, setAddress] = useState(providerDetails?.storeInfo?.address || "");
    const [city, setCity] = useState(providerDetails?.storeInfo?.city || "");
    const [state, setState] = useState(providerDetails?.storeInfo?.state || "");
    const [country, setCountry] = useState(providerDetails?.storeInfo?.country || "");
    const [storeEmail, setStoreEmail] = useState(providerDetails?.storeInfo?.storeEmail || "");
    const [storePhone, setStorePhone] = useState(providerDetails?.storeInfo?.storePhone || "");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        refreshProviderDetails();
    }, []);

    console.log("proivder detail : ", providerDetails)


    useEffect(() => {
        if (providerDetails) {
            setFullName(providerDetails.fullName || "");
            setEmail(providerDetails.email || "");
            setPhoneNo(providerDetails.phoneNo || "");
            setStoreName(providerDetails.storeInfo?.storeName || "");
            setAddress(providerDetails.storeInfo?.address || "");
            setCity(providerDetails.storeInfo?.city || "");
            setState(providerDetails.storeInfo?.state || "");
            setCountry(providerDetails.storeInfo?.country || "");
            setStoreEmail(providerDetails.storeInfo?.storeEmail || "");
            setStorePhone(providerDetails.storeInfo?.storePhone || "");
        }
    }, [providerDetails]);

    // ✅ Validation function
    const validate = () => {
        if (!fullName.trim()) return "Full Name is required.";
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return "Enter a valid email address.";
        if (!phoneNo.trim() || !/^\d{10}$/.test(phoneNo))
            return "Enter a valid 10-digit phone number.";
        if (!storeName.trim()) return "Store Name is required.";
        if (!address.trim()) return "Address is required.";
        if (!city.trim()) return "City is required.";
        if (!state.trim()) return "State is required.";
        if (!country.trim()) return "Country is required.";
        if (storeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeEmail))
            return "Enter a valid store email address.";
        if (storePhone && !/^\d{10}$/.test(storePhone))
            return "Enter a valid 10-digit store phone number.";

        return ""; // No error
    };

    const handleUpdate = async () => {
        setError("");
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `https://api.fetchtrue.com/api/provider/${providerDetails?._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fullName,
                        email,
                        phoneNo,
                        storeInfo: {
                            ...providerDetails?.storeInfo,
                            storeName,
                            address,
                            city,
                            state,
                            country,
                            storeEmail,
                            storePhone,
                        },
                    }),
                }
            );

            const data = await response.json();
            console.log("Update API response:", data);
            if (response.ok) {
                alert("Profile updated successfully!");
                await refreshProviderDetails();
            } else {
                setError("Failed to update profile.");
            }
        } catch (err: unknown) {
            console.error(err);
            setError("An error occurred while updating profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Profile" />
            <div className="m-4">
                {error && <p className="text-red-500">{error}</p>}

            </div>

            <div className="space-y-6">
                {/* Personal Info */}
                <ComponentCard title="Edit Profile">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Full Name</Label>
                            <Input
                                placeholder="Full Name"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input
                                placeholder="Email Address"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Phone</Label>
                            <Input
                                placeholder="+91 0000000000"
                                type="text"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                            />
                        </div>
                    </div>
                </ComponentCard>

                {/* Store Info */}
                <ComponentCard title="Store Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Store Name</Label>
                            <Input
                                placeholder="Store Name"
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Address</Label>
                            <Input
                                placeholder="Address"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>City</Label>
                            <Input
                                placeholder="City"
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>State</Label>
                            <Input
                                placeholder="State"
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Country</Label>
                            <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full border rounded p-2"
                            >
                                {countries.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.code} ({c.label})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label>Store Email</Label>
                            <Input
                                placeholder="Store Email"
                                type="text"
                                value={storeEmail}
                                onChange={(e) => setStoreEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Store Phone</Label>
                            <Input
                                placeholder="+91 0000000000"
                                type="text"
                                value={storePhone}
                                onChange={(e) => setStorePhone(e.target.value)}
                            />
                        </div>
                    </div>
                </ComponentCard>

                {/* Error */}
                {error && <p className="text-red-500">{error}</p>}

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className={`px-6 py-2 text-white rounded ${loading
                            ? "bg-gray-400"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
}
