import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { getMonthlyBudget } from "../../services/budgetService";

const COLORS = ["#E48383", "#F2B50F", "#8E62D9", "#5AB98F", "#F1A356"];

export default function MonthlyBreakdownScreen({ navigation }) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    new Date().getMonth()
  );
  const [months, setMonths] = useState([]);
  const [budgetData, setBudgetData] = useState(null);

  const year = new Date().getFullYear();

  // Generate past 12 months dynamically
  useEffect(() => {
    const monthNames = [
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

    const pastMonths = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      pastMonths.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
    }

    setMonths(pastMonths.reverse());
  }, []);

  // Load budget data for the selected month
  const loadBudget = async (monthIndex) => {
    try {
      setLoading(true);
      const selectedMonth = monthIndex + 1; // JS months are 0-indexed
      const data = await getMonthlyBudget(user._id, year, selectedMonth);
      setBudgetData(data);
    } catch (err) {
      console.log("Error fetching monthly budget", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever the month changes
  useEffect(() => {
    if (user?._id) loadBudget(currentMonthIndex);
  }, [currentMonthIndex, user?._id]);

  const goPrevMonth = () => {
    if (currentMonthIndex > 0) setCurrentMonthIndex(currentMonthIndex - 1);
  };

  const goNextMonth = () => {
    if (currentMonthIndex < months.length - 1)
      setCurrentMonthIndex(currentMonthIndex + 1);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FF4FA3" />
        </View>
      </SafeAreaView>
    );
  }

  const breakdownData =
    budgetData?.categories?.map((cat, index) => ({
      id: cat._id,
      title: cat.name,
      transactions: cat.transactions?.length || 0,
      amount: cat.amount,
      percentage: budgetData.totalBudget
        ? ((cat.amount / budgetData.totalBudget) * 100).toFixed(1)
        : 0,
      color: COLORS[index % COLORS.length],
    })) || [];

  const totalAmount = budgetData?.spentAmount || 0;
  const currentMonth = months[currentMonthIndex] || "";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={20} color="#6B7280" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Monthly Breakdown</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Month Selector */}
          <View style={styles.monthCard}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={goPrevMonth}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={16} color="#EC4899" />
            </TouchableOpacity>

            <View style={styles.monthTextWrap}>
              <Text style={styles.monthText}>{currentMonth}</Text>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.arrowButton}
              onPress={goNextMonth}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-forward" size={16} color="#EC4899" />
            </TouchableOpacity>
          </View>

          {/* Breakdown Items */}
          {breakdownData.map((item) => (
            <View key={item.id} style={styles.breakdownCard}>
              <View style={styles.rowTop}>
                <View style={styles.leftSection}>
                  <View
                    style={[styles.iconCircle, { backgroundColor: item.color }]}
                  />
                  <View style={styles.textWrap}>
                    <Text style={styles.categoryTitle}>{item.title}</Text>
                    <Text style={styles.transactionText}>
                      {item.transactions}{" "}
                      {item.transactions === 1 ? "transaction" : "transactions"}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightSection}>
                  <Text style={styles.amountText}>
                    ${item.amount.toFixed(2)}
                  </Text>
                  <Text style={styles.percentText}>{item.percentage}%</Text>
                </View>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${item.percentage}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FDEFF5" },
  container: { flex: 1, backgroundColor: "#FDEFF5" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 10,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFF8FB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3DCE7",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#28313D" },
  headerSpacer: { width: 30, height: 30 },
  scrollContent: { paddingHorizontal: 14, paddingBottom: 28 },
  monthCard: {
    backgroundColor: "#FFF8FB",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F4DFE8",
  },
  arrowButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FCE7F3",
    justifyContent: "center",
    alignItems: "center",
  },
  monthTextWrap: { flex: 1, alignItems: "center" },
  monthText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 2,
  },
  totalLabel: { fontSize: 10, color: "#B3A1AA", fontWeight: "600" },
  totalAmount: {
    fontSize: 11,
    color: "#EC4899",
    fontWeight: "700",
    marginTop: 1,
  },
  breakdownCard: {
    backgroundColor: "#FFF8FB",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F4DFE8",
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textWrap: { flex: 1 },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 2,
  },
  transactionText: { fontSize: 11, color: "#9CA3AF", fontWeight: "500" },
  rightSection: { alignItems: "flex-end", marginLeft: 10 },
  amountText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF4F87",
    marginBottom: 3,
  },
  percentText: { fontSize: 11, fontWeight: "700", color: "#A1A1AA" },
  progressTrack: {
    width: "100%",
    height: 6,
    backgroundColor: "#F8D9E7",
    borderRadius: 999,
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF6B9A",
    borderRadius: 999,
  },
});
