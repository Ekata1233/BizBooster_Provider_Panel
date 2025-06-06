// app/service/[id]/page.tsx
"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useService } from "@/app/context/ServiceContext";

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const { fetchSingleService, singleService, loadingSingleService, errorSingleService } = useService();

  useEffect(() => {
    if (id) {
      fetchSingleService(id as string);
    }
  }, [id]);

  if (loadingSingleService) return <p>Loading...</p>;
  if (errorSingleService) return <p>{errorSingleService}</p>;
  if (!singleService) return <p>No service found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{singleService.serviceName}</h1>

      <img
        src={singleService.thumbnailImage}
        alt={singleService.serviceName}
        className="w-full h-60 object-cover rounded mb-4"
      />

      <p className="text-lg text-gray-700 mb-2">{singleService.serviceDetails?.overview}</p>
      <p className="font-semibold text-indigo-600 text-xl">
        ₹{singleService.discountedPrice ?? singleService.price}
      </p>

      {/* Add more detailed fields here if needed */}
    </div>
  );
};

export default ServiceDetailsPage;
