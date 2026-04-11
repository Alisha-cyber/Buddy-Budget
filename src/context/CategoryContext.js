import React, { createContext, useContext, useState } from "react";
import {
  getCategories as getCategoriesService,
  createCategory as createCategoryService,
  deleteCategory as deleteCategoryService,
} from "../services/categoryService";

const CategoryContext = createContext(null);

export const useCategories = () => {
  const ctx = useContext(CategoryContext);
  if (!ctx) {
    throw new Error("useCategories must be used inside CategoryProvider");
  }
  return ctx;
};

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async ({ userId, type }) => {
    try {
      const data = await getCategoriesService({ userId, type });
      setCategories(data);
      return data;
    } catch (error) {
      console.log("Fetch categories error:", error);
      throw error;
    }
  };

  const addCategory = async (payload) => {
    try {
      const category = await createCategoryService(payload);
      setCategories((prev) => [...prev, category].sort((a, b) => a.name.localeCompare(b.name)));
      return category;
    } catch (error) {
      console.log("Create category error:", error);
      throw error;
    }
  };

  const removeCategory = async (id) => {
    try {
      await deleteCategoryService(id);
      setCategories((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log("Delete category error:", error);
      throw error;
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        fetchCategories,
        addCategory,
        removeCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}