import React, { createContext, useState } from "react";
import { getInsights } from "../services/insightService";

export const InsightContext = createContext();

export const InsightProvider = ({ children }) => {
  const [insights, setInsights] = useState([]);

  const fetchInsights = async (userId, month) => {
    const data = await getInsights(userId, month);
    setInsights(data);
  };

  return (
    <InsightContext.Provider value={{ insights, fetchInsights }}>
      {children}
    </InsightContext.Provider>
  );
};
