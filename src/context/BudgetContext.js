import React, { createContext, useState } from "react";
import { setMonthlyBudget, getMonthlyBudget } from "../services/budgetService";

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budget, setBudget] = useState(null);

  const fetchBudget = async (userId, month) => {
    const data = await getMonthlyBudget(userId, month);
    setBudget(data);
  };

  const saveBudget = async (payload) => {
    const data = await setMonthlyBudget(payload);
    setBudget(data.budget);
  };

  return (
    <BudgetContext.Provider value={{ budget, fetchBudget, saveBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};
