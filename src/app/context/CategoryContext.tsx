"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

// Define the type for a category item
export interface CategoryType {
  _id: string;
  name: string;
  module: {
    _id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown; // For any other dynamic fields
}

// Define the shape of the context
interface CategoryContextType {
  categories: CategoryType[];
  loadingCategories: boolean;
  errorCategories: string | null;
  refetchCategories: () => void;
}

// Create the context
const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

// Provider component
interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({
  children,
}) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);
   const { providerDetails } = useAuth();

   useEffect(() => {
    const moduleId = providerDetails?.storeInfo?.module;
    if (!moduleId) return;

    axios
      .get(`https://api.fetchtrue.com/api/category?moduleId=${moduleId}`)
      .then(res => {
        if (res.data.success) {
          setCategories(res.data.data);
        }
      })
      .catch(console.error);
  }, [providerDetails?.storeInfo?.module]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await axios.get(
        "https://api.fetchtrue.com/api/category"
      );
      setCategories(res.data?.data || []);
      setErrorCategories(null);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setErrorCategories("Something went wrong while fetching categories.");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loadingCategories,
        errorCategories,
        refetchCategories: fetchCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook for using category context
export const useCategory = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};
