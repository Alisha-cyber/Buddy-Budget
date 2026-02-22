import React, { createContext, useState } from "react";
import {
  createCategory,
  getCategories,
  deleteCategory,
} from "../services/categoryService";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async (userId) => {
    const data = await getCategories(userId);
    setCategories(data);
  };

  const addCategory = async (payload) => {
    const data = await createCategory(payload);
    setCategories((prev) => [...prev, data]);
  };

  const removeCategory = async (id) => {
    await deleteCategory(id);
    setCategories((prev) => prev.filter((cat) => cat._id !== id));
  };

  return (
    <CategoryContext.Provider
      value={{ categories, fetchCategories, addCategory, removeCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
