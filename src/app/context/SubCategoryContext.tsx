"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";

// Define the type for a subcategory item
export interface SubcategoryType {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; 
}

// Define the shape of the context
interface SubcategoryContextType {
  subcategories: SubcategoryType[];
  loadingSubcategories: boolean;
  errorSubcategories: string | null;
  refetchSubcategories: () => void;
}

// Create the context
const SubcategoryContext = createContext<SubcategoryContextType | undefined>(
  undefined
);

// Provider component
interface SubcategoryProviderProps {
  children: ReactNode;
}

export const SubcategoryProvider: React.FC<SubcategoryProviderProps> = ({
  children,
}) => {
  const [subcategories, setSubcategories] = useState<SubcategoryType[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState<boolean>(true);
  const [errorSubcategories, setErrorSubcategories] = useState<string | null>(null);

  const fetchSubcategories = async () => {
    setLoadingSubcategories(true);
    try {
      const res = await axios.get(
        "https://biz-booster.vercel.app/api/subcategory"
      );
      setSubcategories(res.data?.data || []);
      setErrorSubcategories(null);
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
      setErrorSubcategories("Something went wrong while fetching subcategories.");
    } finally {
      setLoadingSubcategories(false);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  return (
    <SubcategoryContext.Provider
      value={{
        subcategories,
        loadingSubcategories,
        errorSubcategories,
        refetchSubcategories: fetchSubcategories,
      }}
    >
      {children}
    </SubcategoryContext.Provider>
  );
};

// Custom hook for using subcategory context
export const useSubcategory = (): SubcategoryContextType => {
  const context = useContext(SubcategoryContext);
  if (!context) {
    throw new Error("useSubcategory must be used within a SubcategoryProvider");
  }
  return context;
};
