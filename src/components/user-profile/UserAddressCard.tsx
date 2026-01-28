// "use client";

// import React from "react";
// import Image from "next/image";
// import { useAuth } from "@/app/context/AuthContext";
// import { useModal } from "@/hooks/useModal";
// import TextArea from "../form/input/TextArea";

// interface Location {
//   type: string;
//   coordinates: [number, number];
// }

// interface StoreInfo {
//   storeName?: string;
//   storeEmail?: string;
//   storePhone?: string;
//   address?: string;
//   city?: string;
//   country?: string;
//   state?: string;
//   officeNo?: string;
//   tax?: string;
//   zone?: string;
//   location?: Location;
//   logo?: string;
//   cover?: string;
//   aboutUs?: string;
// }

// interface ProviderDetails {
//   storeInfo?: StoreInfo;
//   kyc?: Record<string, string[]>;
//   _id: string;
// }



// function renderImageArray(data?: string[]) {
//   if (!data || data.length === 0) return <p className="text-sm text-gray-400">No files</p>;
//   return data.map((url, index) => (
//     <Image
//       key={index}
//       src={url}
//       alt={`Document ${index + 1}`}
//       width={100}
//       height={100}
//       className="rounded border border-gray-200 object-contain max-h-24"
//     />
//   ));
// }



// export default function UserAddressCard() {
//   const { providerDetails: provider } = useAuth() as { providerDetails?: ProviderDetails };
//     const { isOpen, openModal, closeModal } = useModal();

//     const handleSave = () =>{
// (update about us api)
//     }

//     const handleEdit = () => {
//     (open modal )
// }

//   console.log("proivder id : ", provider?._id);

//   return (
//     <div className="grid grid-cols-1 gap-6">
//       {/* Store Information Section */}
//       <div className="border rounded-lg p-6 shadow-sm bg-gradient-to-br  to-white">
//         <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
//           Store Information
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {[
//             { label: "Store Name", value: provider?.storeInfo?.storeName },
//             { label: "Address", value: provider?.storeInfo?.address },
//             { label: "City", value: provider?.storeInfo?.city },
//             { label: "State", value: provider?.storeInfo?.state },
//             { label: "Country", value: provider?.storeInfo?.country },
//             { label: "Store Email", value: provider?.storeInfo?.storeEmail },
//             { label: "Store Phone", value: provider?.storeInfo?.storePhone },
//           ].map((item, index) => (
//             <div key={index} className="flex items-center gap-2">
//               <p className="text-sm text-gray-500 whitespace-nowrap">{item.label}:</p>
//               <p className="font-medium">{item.value || "-"}</p>
//             </div>
//           ))}

//           {/* Location */}
//           {/* <div className="flex items-start gap-2">
//             <p className="text-sm text-gray-500 whitespace-nowrap">Location:</p>
//             <div className="font-medium">{renderLocation(provider?.storeInfo?.location)}</div>
//           </div> */}
//         </div>

//         {provider?.storeInfo?.cover && (
//           <div className="mt-4">
//             <p className="text-sm text-gray-500">Store Cover Image</p>
//             <Image
//               src={provider.storeInfo.cover}
//               alt="Store Cover"
//               width={250}
//               height={140}
//               className="rounded border border-gray-200"
//             />
//           </div>
//         )}
//       </div>

//       {/* KYC Documents Section */}
//       <div className="border rounded-lg p-6 shadow-sm bg-gradient-to-br to-white">
//         <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
//           KYC Documents
//         </h2>
//         <div className="space-y-4">
//           {[
//             { label: "GST Documents", data: provider?.kyc?.GST },
//             { label: "Aadhaar Card", data: provider?.kyc?.aadhaarCard },
//             { label: "PAN Card", data: provider?.kyc?.panCard },
//             { label: "Other Documents", data: provider?.kyc?.other },
//             { label: "Store Documents", data: provider?.kyc?.storeDocument },
//           ].map((item, index) => (
//             <div key={index} className="flex items-center space-x-4">
//               <p className="text-sm text-gray-500 font-semibold w-40">{item.label}</p>
//               <div className="flex-1 flex flex-wrap items-center gap-2">
//                 {renderImageArray(item.data)}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="border rounded-lg p-6 shadow-sm bg-gradient-to-br to-white">
//         {/* Header row: About Us + Edit button */}
//         <div className="flex items-center justify-between mb-4 pb-2 border-b">
//           <h2 className="text-xl font-semibold">About Us</h2>
//           <button
//             onClick={handleEdit}
//             className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
//           >
//             <svg
//               className="fill-current"
//               width="18"
//               height="18"
//               viewBox="0 0 18 18"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
//               />
//             </svg>
//             Edit
//           </button>
//         </div>

//         {/* About us content */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="flex items-center gap-2">
//             <p className="text-sm text-gray-500 whitespace-nowrap">
//               {provider?.storeInfo?.aboutUs || '-'}
//             </p>
//           </div>
//         </div>
//       </div>


//        <Modal
//       >
//         <div className="fixed top-0 left-0 flex flex-col justify-between w-full h-screen p-6 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900 lg:p-10">
//           <div>
//             <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
//               Update About Us
//             </h4>

//            <div>
//             <TextArea> </TextArea>
//            </div>
//           </div>
//           <div className="flex items-center justify-end w-full gap-3 mt-8">
//             <Button size="sm" variant="outline" onClick={}>
//               Close
//             </Button>
//             <Button size="sm" onClick={handleSave}>
//               Update Changes
//             </Button>
//           </div>
//         </div>
//       </Modal>

//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { useModal } from "@/hooks/useModal";
import TextArea from "../form/input/TextArea";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

interface Location {
  type: string;
  coordinates: [number, number];
}

interface StoreInfo {
  storeName?: string;
  storeEmail?: string;
  storePhone?: string;
  address?: string;
  city?: string;
  country?: string;
  state?: string;
  officeNo?: string;
  tax?: string;
  zone?: string;
  location?: Location;
  logo?: string;
  cover?: string;
  aboutUs?: string;
 tags?: string[];
  totalProjects? : number;
  totalExperience? : number;
}

interface ProviderDetails {
  storeInfo?: StoreInfo;
  kyc?: Record<string, string[]>;
  _id: string;
}

function renderImageArray(data?: string[]) {
  if (!data || data.length === 0)
    return <p className="text-sm text-gray-400">No files</p>;

  return data.map((url, index) => {
    const ext = url.split(".").pop()?.toLowerCase();

    // If it's an image
    if (ext && ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
      return (
        <Image
          key={index}
          src={url}
          alt={`Document ${index + 1}`}
          width={100}
          height={100}
          className="rounded border border-gray-200 object-contain max-h-24"
        />
      );
    }

    // If it's a PDF (or other non-image files)
    return (
      <a
        key={index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 underline"
      >
        PDF Document {index + 1}
      </a>
    );
  });
}

function TagsView({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) {
    return <span className="text-gray-400">-</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
function isValidAboutUs(text: string) {
  // Trim whitespace
  const trimmed = text.trim();

  // Return false if empty
  if (!trimmed) return false;

  // Regex: must contain at least one letter (a-z or A-Z)
  const hasLetter = /[a-zA-Z]/.test(trimmed);

  // Only valid if it contains at least one letter
  return hasLetter;
}


export default function UserAddressCard() {
  const { providerDetails: provider } = useAuth() as {
    providerDetails?: ProviderDetails;
  };

  const { isOpen, openModal, closeModal } = useModal();
  const [aboutUs, setAboutUs] = useState(provider?.storeInfo?.aboutUs || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleEdit = () => {
    setAboutUs(provider?.storeInfo?.aboutUs || "");
    openModal();
  };

  const handleSave = async () => {
    if (!provider?._id) {
      setMessage("Provider ID not found.");
      return;
    }

     if (!isValidAboutUs(aboutUs)) {
    setMessage("❌ Please enter some meaningful text (letters required).");
    return;
  }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.patch(
        `https://api.fetchtrue.com/api/provider/about-us/${provider._id}`,
        { aboutUs },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setMessage("✅ About Us updated successfully!");
        alert("✅ About Us updated successfully!");

        closeModal();
        window.location.reload(); // reload to refresh updated data (optional)
      } else {
        setMessage(`❌ ${res.data.message}`);
      }
    } catch (err) {
  if (axios.isAxiosError(err)) {
    setMessage(
      err.response?.data?.message || "Something went wrong while updating."
    );
  } else if (err instanceof Error) {
    setMessage(err.message);
  } else {
    setMessage("Something went wrong while updating.");
  }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Store Information Section */}
      <div className="border rounded-lg p-6 shadow-sm bg-gradient-to-br to-white">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
          Store Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Store Name", value: provider?.storeInfo?.storeName },
            { label: "Address", value: provider?.storeInfo?.address },
            { label: "City", value: provider?.storeInfo?.city },
            { label: "State", value: provider?.storeInfo?.state },
            { label: "Country", value: provider?.storeInfo?.country },
            { label: "Store Email", value: provider?.storeInfo?.storeEmail },
            { label: "Store Phone", value: provider?.storeInfo?.storePhone },
            // { label: "Tags", value: provider?.storeInfo?.tags },
            { label: "Total Projects", value: provider?.storeInfo?.totalProjects },
            { label: "Total Year of Experience", value: provider?.storeInfo?.totalExperience },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <p className="text-sm text-gray-500 whitespace-nowrap">
                {item.label}:
              </p>
              <p className="font-medium">{item.value || "-"}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1 my-4">
  <p className="text-sm text-gray-500">Tags:</p>
  <TagsView tags={provider?.storeInfo?.tags} />
</div>


        {provider?.storeInfo?.cover && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Store Cover Image</p>
            <Image
              src={provider.storeInfo.cover}
              alt="Store Cover"
              width={250}
              height={140}
              className="rounded border border-gray-200"
            />
          </div>
        )}
      </div>

      {/* KYC Documents Section */}
      <div className="border rounded-lg p-6 shadow-sm bg-gradient-to-br to-white">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
          KYC Documents
        </h2>
        <div className="space-y-4">
          {[
            { label: "GST Documents", data: provider?.kyc?.GST },
            { label: "Aadhaar Card", data: provider?.kyc?.aadhaarCard },
            { label: "PAN Card", data: provider?.kyc?.panCard },
            { label: "Other Documents", data: provider?.kyc?.other },
            { label: "Store Documents", data: provider?.kyc?.storeDocument },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <p className="text-sm text-gray-500 font-semibold w-40">
                {item.label}
              </p>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                {renderImageArray(item.data)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Us Section */}
      <div className="border rounded-lg p-6 shadow-sm bg-gradient-to-br to-white">
        <div className="flex items-center justify-between mb-4 pb-2 border-b">
          <h2 className="text-xl font-semibold">About Us</h2>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z"
              />
            </svg>
            Edit
          </button>
        </div>

        <p className="text-sm text-gray-600 whitespace-pre-line">
          {provider?.storeInfo?.aboutUs || "No About Us information provided."}
        </p>
      </div>

      {/* Modal for Editing */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
        <div className="flex flex-col  w-full max-w-[600px] gap-6 p-6 ">
          <h4 className="font-semibold text-gray-00 text-lg">
            Update About Us
          </h4>

          <TextArea
            value={aboutUs}
            onChange={(value: string) => setAboutUs(value)} 
            rows={6}
            placeholder="Write about your store..."
            className="text-gray-900 dark:text-gray-100"
          />


          {message && (
            <p
              className={`text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-500"
                }`}
            >
              {message}
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Update Changes"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
