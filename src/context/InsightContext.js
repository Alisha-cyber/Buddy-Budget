import React, { createContext, useContext, useState } from "react";
import { getInsights, markInsightRead } from "../services/insightService";

const InsightContext = createContext(null);

export const useInsights = () => {
  const ctx = useContext(InsightContext);
  if (!ctx) throw new Error("useInsights must be used inside InsightProvider");
  return ctx;
};

export function InsightProvider({ children }) {
  const [insights, setInsights] = useState([]);

  const fetchInsights = async (userId) => {
    const data = await getInsights(userId);
    setInsights(data);
    return data;
  };

  const markRead = async (id) => {
    const updated = await markInsightRead(id);
    setInsights((prev) =>
      prev.map((item) => (item._id === id ? updated : item))
    );
  };

  return (
    <InsightContext.Provider
      value={{
        insights,
        fetchInsights,
        markRead,
      }}
    >
      {children}
    </InsightContext.Provider>
  );
}