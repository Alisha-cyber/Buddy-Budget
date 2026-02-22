import React, { createContext, useContext, useMemo, useState } from "react";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
} from "../services/transactionService";

const TransactionContext = createContext(null);

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx)
    throw new Error("useTransactions must be used inside TransactionProvider");
  return ctx;
};

/* ---------- Helpers ---------- */

const monthKey = (date) => {
  if (!date) return null;

  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");

  return `${y}-${m}`;
};

const formatMonthTitle = (key) => {
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
};

/* ---------- Provider ---------- */

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);

  /* FETCH */

  const fetchTransactions = async (params) => {
    try {
      const data = await getTransactions(params);
  
      // ALWAYS ensure array
      if (Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
      }
  
    } catch (err) {
      console.log("FETCH ERROR:", err);
      setTransactions([]);
    }
  };
  

  /* CREATE */

  const addTransaction = async (payload) => {
    try {
      const data = await createTransaction(payload);

      const newTx = data.transaction || data;

      setTransactions((prev) => [newTx, ...prev]);

      return newTx;
    } catch (err) {
      console.log("CREATE ERROR:", err);
      throw err;
    }
  };

  /* UPDATE */

  const editTransaction = async (id, payload) => {
    try {
      const data = await updateTransaction(id, payload);
      const updated = data.transaction || data;

      setTransactions((prev) =>
        prev.map((item) => (item._id === id || item.id === id ? updated : item))
      );

      return updated;
    } catch (err) {
      console.log("UPDATE ERROR:", err);
      throw err;
    }
  };

  /* DELETE */

  const removeTransaction = async (id) => {
    try {
      await deleteTransaction(id);

      setTransactions((prev) =>
        prev.filter((item) => item._id !== id && item.id !== id)
      );
    } catch (err) {
      console.log("DELETE ERROR:", err);
      throw err;
    }
  };

  /* MONTHS */

  const months = useMemo(() => {
    const keys = new Set(
      transactions.map((t) => monthKey(t.transactionDate)).filter(Boolean)
    );

    return Array.from(keys).sort().reverse();
  }, [transactions]);

  /* MONTH SUMMARY */

  const getMonthlySummary = (targetMonthKey) => {
    const monthTx = transactions.filter(
      (t) => monthKey(t.transactionDate) === targetMonthKey
    );

    let income = 0;
    let expense = 0;
    const byCategory = {};

    for (const t of monthTx) {
      const cat = t.categoryId || "Other";

      if (!byCategory[cat]) {
        byCategory[cat] = { income: 0, expense: 0, count: 0 };
      }

      byCategory[cat].count += 1;

      if (t.transactionType === "income") {
        income += Number(t.amount);
        byCategory[cat].income += Number(t.amount);
      } else {
        expense += Number(t.amount);
        byCategory[cat].expense += Number(t.amount);
      }
    }

    const net = income - expense;

    const categories = Object.entries(byCategory)
      .map(([name, v]) => ({
        name,
        expense: v.expense,
        income: v.income,
        count: v.count,
      }))
      .sort((a, b) => b.expense - a.expense);

    return {
      monthKey: targetMonthKey,
      monthTitle: formatMonthTitle(targetMonthKey),
      income,
      expense,
      net,
      categories,
      transactions: monthTx,
    };
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        fetchTransactions,
        addTransaction,
        editTransaction,
        removeTransaction,
        months,
        getMonthlySummary,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}
