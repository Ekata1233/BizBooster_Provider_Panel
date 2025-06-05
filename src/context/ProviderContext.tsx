// "use client";

// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import axios from "axios";

// type ProviderDetails = {
//   _id: string;
//   fullName: string;
//   phoneNo: string;
//   email: string;
//   password?: string;
//   referredBy?: string | null;
//   isDeleted?: boolean;
//   isVerified?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
//   kyc?: {
//     GST?: string[];
//     aadhaarCard?: string[];
//     panCard?: string[];
//     storeDocument?: string[];
//     other?: string[];
//   };
//   storeInfo?: {
//     address?: string;
//     city?: string;
//     state?: string;
//     country?: string;
//     cover?: string;
//     logo?: string;
//     location?: { type: string; coordinates: number[] };
//     officeNo?: string;
//     storeEmail?: string;
//     storeName?: string;
//     storePhone?: string;
//     tax?: string;
//     zone?: string;
//   };
//   module?: {
//     _id: string;
//     name: string;
//     image: string;
//     isDeleted?: boolean;
//     createdAt?: string;
//     updatedAt?: string;
//   };
// };

// type ProviderContextType = {
//   providerDetails: ProviderDetails | null;
//   setProviderDetails: React.Dispatch<React.SetStateAction<ProviderDetails | null>>;
// };

// const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

// interface ProviderProviderProps {
//   children: ReactNode;
//   loggedInProviderId: string | null;
// }

// export const ProviderProvider = ({ children, loggedInProviderId }: ProviderProviderProps) => {
//   const [providerDetails, setProviderDetails] = useState<ProviderDetails | null>(null);

//   useEffect(() => {
//     if (!loggedInProviderId) {
//       setProviderDetails(null);
//       return;
//     }

//     const fetchProvider = async () => {
//       try {
//         const response = await axios.get<ProviderDetails>(
//           `https://biz-booster.vercel.app/api/provider/${loggedInProviderId}`
//         );
//         setProviderDetails(response.data);
//       } catch (error) {
//         console.error("Failed to fetch provider details:", error);
//         setProviderDetails(null);
//       }
//     };
// console.log(providerDetails);

//     fetchProvider();
//   }, [loggedInProviderId]);

//   return (
//     <ProviderContext.Provider value={{ providerDetails, setProviderDetails }}>
//       {children}
//     </ProviderContext.Provider>
//   );
// };

// export const useProvider = () => {
//   const context = useContext(ProviderContext);
//   if (!context) throw new Error("useProvider must be used within ProviderProvider");
//   return context;
// };
