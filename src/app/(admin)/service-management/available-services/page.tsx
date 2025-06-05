"use client";

import { useCategory } from "@/app/context/CategoryContext";
import { ModuleType, useModule } from "@/app/context/ModuleContext";
import { useSubcategory } from "@/app/context/SubCategoryContext";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import React, { useState, useMemo } from "react";

interface OptionType {
  value: string;
  label: string;
}

const Page = () => {
const [selectedModule, setSelectedModule] = useState<string>('');
const [selectedCategory, setSelectedCategory] = useState<string>('');
const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');


  const { modules, loadingModules, errorModules } = useModule();
  const { categories, loadingCategories, errorCategories } = useCategory();
  const { subcategories, loadingSubcategories, errorSubcategories } = useSubcategory();

  if (loadingModules || loadingCategories || loadingSubcategories) return <p>Loading...</p>;
  if (errorModules) return <p>{errorModules}</p>;
  if (errorCategories) return <p>{errorCategories}</p>;
  if (errorSubcategories) return <p>{errorSubcategories}</p>;

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

      <div className="space-y-6 my-3">
        <ComponentCard title="All Services">
          <div>
            {/* You can render services here based on selected module/category/subcategory */}
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default Page;
