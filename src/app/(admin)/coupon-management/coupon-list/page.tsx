'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import BasicTableOne from '@/components/tables/BasicTableOne';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import StatCard from '@/components/common/StatCard';
import {
  TrashBinIcon,
  UserIcon,
  ArrowUpIcon,
  // PencilIcon,
  EyeIcon,
} from '@/icons';
import { useCategory } from '@/app/context/CategoryContext';
import { Coupon, useCoupon } from '@/app/context/CouponContext';

/* -------------------------------------------------------------------------- */
/* 🔖 Types                                                                    */
/* -------------------------------------------------------------------------- */

export type CouponTypeEnum = 'default' | 'firstBooking' | 'customerWise';
export type DiscountTypeEnum = 'Category Wise' | 'Service Wise' | 'Mixed';
export type DiscountAmountTypeEnum = 'Fixed Amount' | 'Percentage';
export type DiscountCostBearerEnum = 'Provider' | 'Admin';

export interface CouponType {
  _id: string;
  couponType: CouponTypeEnum;
  couponCode: string;
  discountType: DiscountTypeEnum;
  discountAmountType: DiscountAmountTypeEnum;
  discountCostBearer: DiscountCostBearerEnum;
  discountTitle: string;
  amount?: number;
  maxDiscount?: number;
  minPurchase: number;
  limitPerUser: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  zone?: {
    _id: string;
    name: string;
  };
  category?: {
    _id: string;
    name: string;
  };
  service?: {
    _id: string;
    serviceName: string;
  };
  customer?: {
    _id: string;
    fullName: string;
  };
  createdAt?: string;
  updatedAt?: string;
  couponAppliesTo?: string;
}

export interface TableData {
  id: string;
  srNo: number;
  couponCode: string;
  couponType: string;
  discountTitle: string;
  discount: string;
  appliesTo: string;
  validity: string;
  status: 'Active' | 'Expired' | 'Pending' | 'Inactive'| 'Deleted';
  isActive?: boolean;
}

const getCouponStatus = (c: Coupon): TableData['status'] => {
   if (c.isDeleted === true) return 'Deleted';
  if (c.isApprove === false) return 'Pending';
  if (c.isApprove === true && c.isActive === true) return 'Active';
  if (c.isActive === false) return 'Expired';
  return 'Inactive'; // fallback / safety
};

/* -------------------------------------------------------------------------- */
/* 🔖 Component                                                               */
/* -------------------------------------------------------------------------- */

const CouponList: React.FC = () => {
  const { coupons, deleteCoupon } = useCoupon();
  const { categories } = useCategory();
  const [search, setSearch] = useState<string>('');
  const [rows, setRows] = useState<TableData[]>([]);
  const [allRows, setAllRows] = useState<TableData[]>([]);
  const [message, setMessage] = useState<string>('');

  console.log("coupons : ", coupons)
  /* ------------------------------------------------------------------------ */
  /* 🧠 Memoized Helpers                                                      */
  /* ------------------------------------------------------------------------ */

  const categoryMap = useMemo<Record<string, string>>(
    () => Object.fromEntries(categories.map(c => [c._id, c.name])),
    [categories]
  );

  const formatValidity = (c: Coupon): string =>
    `${new Date(c.startDate).toLocaleDateString()} – ${new Date(
      c.endDate
    ).toLocaleDateString()}`;

  const formatDiscount = (c: Coupon): string =>
    c.discountAmountType === 'Percentage'
      ? `${c.amount ?? 0}%${
          c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ''
        }`
      : `₹${c.amount ?? 0}`;

  const formatAppliesTo = (c: Coupon): string => {
    if (c.category) return categoryMap[c.category._id] ?? c.category.name;
    if (c.service) return c.service.serviceName;
    if (c.couponType === 'customerWise') return 'Customer';
    return c.zone?.name ?? '-';
  };

  /* ------------------------------------------------------------------------ */
  /* 📦 Map Coupons to Table Rows                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const mapped: TableData[] = coupons.map((c, index) => ({
      id: c._id,
      srNo: index + 1,
      couponCode: c.couponCode,
      couponType: c.couponType,
      discountTitle: c.discountTitle,
      discount: formatDiscount(c),
      appliesTo: formatAppliesTo(c),
      validity: formatValidity(c),
      status: getCouponStatus(c),
       isActive: c.isActive,
    }));

    setAllRows(mapped);
    setRows(mapped);
    setMessage('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coupons, categoryMap]);

  /* ------------------------------------------------------------------------ */
  /* 🔍 Search Logic                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!search.trim()) {
      setRows(allRows);
      setMessage('');
      return;
    }

    const searchTerm = search.toLowerCase();

    const filtered = allRows.filter(row =>
      Object.values(row)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm)
    );

    setRows(filtered);
    setMessage(filtered.length === 0 ? 'No coupons match your search.' : '');
  }, [search, allRows]);

  /* ------------------------------------------------------------------------ */
  /* 🗑️ Delete Action                                                        */
  /* ------------------------------------------------------------------------ */

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm('Delete this coupon?')) return;

    try {
      await deleteCoupon(id);
      alert('Coupon deleted successfully.');
    } catch (error) {
      console.error(error);
      alert('Failed to delete coupon.');
    }
  };

  /* ------------------------------------------------------------------------ */
  /* 📊 Table Columns                                                         */
  /* ------------------------------------------------------------------------ */

  const columns = [
    { header: 'Sr No.', accessor: 'srNo' },
    { header: 'Code', accessor: 'couponCode' },
    { header: 'Type', accessor: 'couponType' },
    { header: 'Title', accessor: 'discountTitle' },
    { header: 'Discount', accessor: 'discount' },
    { header: 'Validity', accessor: 'validity' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row: TableData) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold
            ${
              row.status === 'Expired'
                ? 'text-red-600 bg-red-100 border border-red-300'
                : 'text-green-600 bg-green-100 border border-green-300'
            }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row: TableData) => (
        <div className="flex gap-2">
          {/* <Link
            href={`/coupons-management/coupons-list/update-coupon/${row.id}`}
          >
            <button className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white">
              <PencilIcon />
            </button>
          </Link> */}

          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
          >
            <TrashBinIcon />
          </button>

          <Link href={`/coupon-management/coupon-list/${row.id}`}>
            <button className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white">
              <EyeIcon />
            </button>
          </Link>
        </div>
      ),
    },
  ];

  /* ------------------------------------------------------------------------ */
  /* 🧩 Render                                                                */
  /* ------------------------------------------------------------------------ */

  return (
    <div>
      <PageBreadcrumb pageTitle="Coupons" />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4 my-5">
          <ComponentCard title="Search & Filter">
            <Label>Search Coupons</Label>
            <Input
              placeholder="Search by any keyword"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </ComponentCard>
        </div>

        <div className="w-full lg:w-1/4 my-5">
          <StatCard
            title="Total Coupons"
            value={coupons.length}
            icon={UserIcon}
            badgeColor="success"
            badgeValue="0.00%"
            badgeIcon={ArrowUpIcon}
          />
        </div>
      </div>

      <ComponentCard title="All Coupons">
        {message ? (
          <p className="text-red-500 text-center my-4">{message}</p>
        ) : (
          <BasicTableOne columns={columns} data={rows} />
        )}
      </ComponentCard>
    </div>
  );
};

export default CouponList;
