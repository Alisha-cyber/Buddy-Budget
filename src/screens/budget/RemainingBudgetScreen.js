import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import BudgetCard from "../../components/BudgetCard";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../hooks/useAuth";
import {
  getMonthlyBudget,
  setMonthlyBudget,
} from "../../services/budgetService";

export default function RemainingBudgetScreen({ navigation }) {
  const { user } = useAuth();

  const today = new Date();

  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [summary, setSummary] = useState(null);
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(true);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = monthIndex + 1;

  const loadBudget = async () => {
    try {
      setLoading(true);

      const data = await getMonthlyBudget(user._id, year, month);

      const categories =
        data?.categories?.map((cat) => ({
          ...cat,
          name: cat.name || cat.category || cat.categoryId,
          transactionType: cat.transactionType || "expense",
          transactions: Array.isArray(cat.transactions)
            ? cat.transactions.length
            : cat.transactions || 0,
        })) || [];

      setSummary({
        ...data,
        categories,
      });

      setBudget(data?.totalBudget?.toString() || "");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user?._id) {
        loadBudget();
      }
    }, [monthIndex, year, user?._id])
  );

  const saveBudget = async () => {
    try {
      await setMonthlyBudget({
        userId: user._id,
        month,
        year,
        totalBudget: Number(budget),
      });

      await loadBudget();
    } catch (err) {
      console.log(err);
    }
  };

  const prevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => y - 1);
    } else {
      setMonthIndex((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => y + 1);
    } else {
      setMonthIndex((m) => m + 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF4FA3" />
      </View>
    );
  }

  const totalBudget = Number(summary?.totalBudget || 0);
  const spentAmount = Number(summary?.spentAmount || 0);

  const incomeAmount =
    Number(summary?.incomeAmount) ||
    summary?.transactions
      ?.filter((t) => t.transactionType === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0) ||
    0;

  const monthlySaving = incomeAmount - spentAmount;
  const isSavingPositive = monthlySaving >= 0;

  const isOverBudget = spentAmount > totalBudget;
  const remainingAmount = Math.max(totalBudget - spentAmount, 0);
  const overBudgetAmount = isOverBudget ? spentAmount - totalBudget : 0;

  const radius = 60;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = totalBudget ? Math.min(spentAmount / totalBudget, 1) : 0;
  const spentStroke = circumference * progress;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
          >
            <Ionicons name="chevron-back" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Budget</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.monthCard}>
          <TouchableOpacity onPress={prevMonth} style={styles.monthArrow}>
            <Ionicons name="chevron-back" size={16} color="#EC4899" />
          </TouchableOpacity>

          <Text style={styles.monthText}>
            {months[monthIndex]} {year}
          </Text>

          <TouchableOpacity onPress={nextMonth} style={styles.monthArrow}>
            <Ionicons name="chevron-forward" size={16} color="#EC4899" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Monthly Budget</Text>

          <TextInput
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
            placeholder="Enter monthly budget"
            style={styles.input}
          />

          <TouchableOpacity style={styles.saveButton} onPress={saveBudget}>
            <Text style={styles.saveText}>Save Budget</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.incomeCard}>
          <Text style={styles.incomeLabel}>Monthly Income</Text>
          <Text style={styles.incomeAmount}>${incomeAmount}</Text>
          <Text style={styles.incomeSubtext}>Total income for this month</Text>
        </View>

        <View style={styles.savingCard}>
          <Text style={styles.savingLabel}>Monthly Saving</Text>
          <Text
            style={[
              styles.savingAmount,
              isSavingPositive ? styles.savingPositive : styles.savingNegative,
            ]}
          >
            ${Math.abs(monthlySaving)}
          </Text>
          <Text style={styles.savingSubtext}>
            {isSavingPositive
              ? "Income left after spending"
              : "You spent more than you earned"}
          </Text>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Budget Overview</Text>

          <View style={styles.chartWrap}>
            <Svg width={180} height={180}>
              <Circle
                cx="90"
                cy="90"
                r={radius}
                stroke="#F3E5EB"
                strokeWidth={strokeWidth}
                fill="none"
              />

              <Circle
                cx="90"
                cy="90"
                r={radius}
                stroke={isOverBudget ? "#DC2626" : "#FF6A8B"}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${spentStroke} ${circumference}`}
                rotation="-90"
                origin="90,90"
                strokeLinecap="round"
              />
            </Svg>

            <View style={styles.chartCenter}>
              <Text
                style={[
                  styles.chartLabel,
                  isOverBudget && styles.overBudgetLabel,
                ]}
              >
                {isOverBudget ? "Over Budget" : "Remaining"}
              </Text>

              <Text
                style={[
                  styles.chartAmount,
                  isOverBudget && styles.overBudgetAmount,
                ]}
              >
                ${isOverBudget ? overBudgetAmount : remainingAmount}
              </Text>
            </View>
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: isOverBudget ? "#DC2626" : "#FF6A8B" },
                ]}
              />
              <Text>Spent ${spentAmount}</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: "#9BE5C2" }]} />
              <Text>Budget ${totalBudget}</Text>
            </View>
          </View>

          {isOverBudget && (
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={16} color="#DC2626" />
              <Text style={styles.warningText}>
                You have exceeded your monthly budget by ${overBudgetAmount}.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownHeading}>Monthly Breakdown</Text>

          {summary?.categories?.length > 0 ? (
            summary.categories.map((cat, index) => (
              <BudgetCard
                key={index}
                category={cat}
                navigation={navigation}
                month={month}
                monthIndex={monthIndex}
                year={year}
              />
            ))
          ) : (
            <Text style={styles.noData}>No spending yet this month</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FDEFF5" },
  container: { padding: 20 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "center",
  },

  headerTitle: { fontSize: 20, fontWeight: "700" },

  monthCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF7FA",
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3DEE7",
  },

  monthArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
  },

  monthText: { fontSize: 15, fontWeight: "700" },

  inputCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  inputLabel: { fontSize: 14, marginBottom: 8 },

  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  saveButton: {
    backgroundColor: "#FF4FA3",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  saveText: { color: "#fff", fontWeight: "700" },

  incomeCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  incomeLabel: {
    fontSize: 14,
    marginBottom: 8,
  },

  incomeAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#16A34A",
  },

  incomeSubtext: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
  },

  savingCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  savingLabel: {
    fontSize: 14,
    marginBottom: 8,
  },

  savingAmount: {
    fontSize: 28,
    fontWeight: "800",
  },

  savingPositive: {
    color: "#16A34A",
  },

  savingNegative: {
    color: "#DC2626",
  },

  savingSubtext: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
  },

  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  chartTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  chartWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  chartCenter: {
    position: "absolute",
    alignItems: "center",
  },

  chartLabel: { fontSize: 12, color: "#888" },

  chartAmount: { fontSize: 24, fontWeight: "800" },

  overBudgetLabel: {
    color: "#DC2626",
  },

  overBudgetAmount: {
    color: "#DC2626",
  },

  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },

  legendItem: { flexDirection: "row", alignItems: "center" },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },

  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 14,
  },

  warningText: {
    marginLeft: 8,
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },

  breakdownSection: {
    marginTop: 12,
  },

  breakdownHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#344054",
    marginBottom: 10,
  },

  noData: {
    fontSize: 13,
    color: "#9CA3AF",
  },
});