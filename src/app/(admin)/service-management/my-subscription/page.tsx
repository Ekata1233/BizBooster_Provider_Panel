// 'use client';

// import React, { useEffect, useState, ChangeEvent } from 'react';
// import { useAuth } from '@/app/context/AuthContext';
// import PageBreadcrumb from '@/components/common/PageBreadCrumb';
// import ComponentCard from '@/components/common/ComponentCard';
// import BasicTableOne from '@/components/tables/BasicTableOne';
// import { usePathname } from 'next/navigation';
// import { useService } from '@/app/context/ServiceContext';

// interface TableData {
//   id: string;
//   serviceName: string;
//   categoryName: string;
//   subCategoryName: string;
//   discountedPrice: number | null;
//   providerPrice: number | null;
//   status: string;
// }

// const MySubscriptionPage = () => {
//   const { providerDetails, refreshProviderDetails } = useAuth();
//   const pathname = usePathname();
//   const { services }=useService();
//   const [tableData, setTableData] = useState<TableData[]>([]);
//   const [search, setSearch] = useState('');
//   const [filteredData, setFilteredData] = useState<TableData[]>([]);
//   const [unsubscribing, setUnsubscribing] = useState<string | null>(null);

//   console.log('provider details f:', providerDetails);
//   console.log("updates price",services);
  
//   // ✅ Refresh provider details when page loads or path changes
//   useEffect(() => {
//     refreshProviderDetails();
//   }, [pathname]);

//   // ✅ Map subscribedServices to table format
//   useEffect(() => {
//     if (providerDetails?.subscribedServices?.length) {
//       const mapped = providerDetails.subscribedServices.map((srv: any) => ({
//         id: srv._id,
//         serviceName: srv.serviceName || '—',
//         categoryName: srv.categoryName || '—', // placeholder
//         subCategoryName: srv.subCategoryName || '—', // placeholder
//         discountedPrice: srv.discountedPrice ?? null,
//         providerPrice: srv.providerPrice ?? null,
//         status: 'Subscribed',
//       }));
//       setTableData(mapped);
//       setFilteredData(mapped);
//     }
//   }, [providerDetails]);

//   // ✅ Search filter
//   useEffect(() => {
//     if (!search.trim()) {
//       setFilteredData(tableData);
//     } else {
//       const lowerSearch = search.toLowerCase();
//       setFilteredData(
//         tableData.filter((item) =>
//           item.serviceName.toLowerCase().includes(lowerSearch)
//         )
//       );
//     }
//   }, [search, tableData]);

//   const handleUnsubscribe = async (serviceId: string) => {
//     try {
//       setUnsubscribing(serviceId);
//       await fetch(`/api/provider/unsubscribe/${serviceId}`, { method: 'DELETE' });
//       await refreshProviderDetails(); // ✅ Update without refresh
//     } catch (error) {
//       console.error('Error unsubscribing:', error);
//     } finally {
//       setUnsubscribing(null);
//     }
//   };

//   const columns = [
//     { header: 'Service Name', accessor: 'serviceName' },
//     // { header: 'Category', accessor: 'categoryName' },
//     // { header: 'Subcategory', accessor: 'subCategoryName' },
//     {
//       header: 'Price',
//       accessor: 'discountedPrice',
//       cell: (row: { discountedPrice: number | null }) =>
//         row.discountedPrice != null ? `₹${row.discountedPrice}` : '—',
//     },
//     {
//       header: 'Provider Price',
//       accessor: 'providerPrice',
//       cell: (row: { providerPrice: number | null }) =>
//         row.providerPrice != null ? `₹${row.providerPrice}` : '—',
//     },
//     {
//       header: 'Action',
//       accessor: 'action',
//       render: (row: TableData) => (
//         <button
//           onClick={() => handleUnsubscribe(row.id)}
//           disabled={unsubscribing === row.id}
//           className={`${
//             unsubscribing === row.id
//               ? 'bg-gray-400'
//               : 'bg-red-500 hover:bg-red-600'
//           } text-white px-4 py-2 rounded-md transition duration-200`}
//         >
//           {unsubscribing === row.id ? 'Unsubscribing…' : 'Unsubscribe'}
//         </button>
//       ),
//     },
//   ];

//   return (
//     <>
//       <PageBreadcrumb pageTitle="My Subscription" />
//       <div className="space-y-6">
//         <ComponentCard title="Subscribed Services">
//           <div className="mb-4">
//             <input
//               type="text"
//               placeholder="Search services..."
//               value={search}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setSearch(e.target.value)
//               }
//               className="border px-3 py-2 rounded-md w-full"
//             />
//           </div>
//           <BasicTableOne columns={columns} data={filteredData} />
//         </ComponentCard>
//       </div>
//     </>
//   );
// };

// export default MySubscriptionPage;


import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page