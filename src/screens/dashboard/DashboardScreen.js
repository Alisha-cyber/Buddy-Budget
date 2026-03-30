import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { useAuth } from "../../hooks/useAuth";
import { getMonthlyBudget } from "../../services/budgetService";

import PieChart from "../../components/PieChart";
import ScreenWrapper from "../../components/ScreenWrapper";

const COLORS = ["#E48383", "#F2B50F", "#8E62D9", "#5AB98F", "#F1A356"];

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const displayName = user?.name || user?.email?.split("@")[0] || "Buddy";

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  useFocusEffect(
    React.useCallback(() => {
      if (user?._id) {
        loadBudget();
      }
    }, [user?._id])
  );

  const loadBudget = async () => {
    try {
      const data = await getMonthlyBudget(user._id, year, month);
      setSummary(data);
    } catch (err) {
      console.log("Dashboard budget error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FF4FA3" />
        </View>
      </ScreenWrapper>
    );
  }

  const totalSpent = summary?.spentAmount ?? 0;
  const totalBudget = summary?.totalBudget ?? 0;
  const remaining = summary?.remainingAmount ?? 0;

  const breakdown =
    summary?.categories?.map((cat, index) => ({
      label: cat.name,
      value: cat.amount,
      color: COLORS[index % COLORS.length],
    })) || [];

  const isEmpty = totalBudget === 0 && breakdown.length === 0;

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>Hi {displayName} 💗</Text>
          <Text style={styles.subtitle}>Here’s your month at a glance</Text>
        </View>

        {/* EMPTY STATE */}

        {isEmpty ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No budget yet</Text>
            <Text style={styles.emptyText}>
              Set your monthly budget to start tracking spending.
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Budget")}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#FF4FA3", "#FF1F80"]}
                style={styles.emptyButton}
              >
                <Text style={styles.buttonText}>Set Budget</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* SUMMARY */}

            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Budget</Text>
                <Text style={styles.summaryValue}>${totalBudget}</Text>
                <Text style={styles.summarySub}>This month</Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Remaining</Text>
                <Text style={styles.summaryValue}>${remaining}</Text>
                <Text style={styles.summarySub}>This month</Text>
              </View>
            </View>

            {/* PIE */}

            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>Expense Breakdown</Text>

              {breakdown.length === 0 ? (
                <View style={styles.noData}>
                  <Text style={styles.noDataText}>
                    No expenses recorded this month
                  </Text>
                </View>
              ) : (
                <>
                  <PieChart
                    data={breakdown}
                    total={totalSpent}
                    remaining={remaining}
                  />

                  <View style={styles.legend}>
                    {breakdown.map((item) => {
                      const percent = totalSpent
                        ? ((item.value / totalSpent) * 100).toFixed(1)
                        : 0;

                      return (
                        <View key={item.label} style={styles.legendRow}>
                          <View
                            style={[
                              styles.dot,
                              { backgroundColor: item.color },
                            ]}
                          />

                          <Text style={styles.legendLabel}>{item.label}</Text>

                          <Text style={styles.legendPercent}>{percent}%</Text>

                          <Text style={styles.legendAmount}>${item.value}</Text>
                        </View>
                      );
                    })}
                  </View>
                </>
              )}
            </View>
          </>
        )}

        {/* BUTTONS */}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => navigation.navigate("AddTransaction")}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#FF4FA3", "#FF1F80"]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>+ Add Transaction</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => navigation.navigate("Budget")}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#FF6A8B", "#FF3D5F"]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>◎ Set Budget</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F6CDE2",
    marginHorizontal: 4,
  },

  summaryTitle: {
    fontSize: 14,
    color: "#6B7280",
  },

  summaryValue: {
    fontSize: 26,
    fontWeight: "800",
    marginVertical: 4,
  },

  summarySub: {
    color: "#EC4899",
    fontWeight: "600",
  },

  breakdownCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F6CDE2",
  },

  breakdownTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },

  noData: {
    alignItems: "center",
    paddingVertical: 30,
  },

  noDataText: {
    color: "#6B7280",
    fontSize: 14,
  },

  legend: {
    marginTop: 10,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },

  legendLabel: {
    flex: 1,
    fontSize: 16,
  },

  legendPercent: {
    width: 70,
    textAlign: "right",
    color: "#6B7280",
  },

  legendAmount: {
    width: 70,
    textAlign: "right",
    fontWeight: "600",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 5,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },

  emptyContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F6CDE2",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },

  emptyButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
});
