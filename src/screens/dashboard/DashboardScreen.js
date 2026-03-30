import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../hooks/useAuth";
import { getMonthlyBudget } from "../../services/budgetService";

import PieChart from "../../components/PieChart";
import ScreenWrapper from "../../components/ScreenWrapper";

const CHART_COLORS = ["#E48383", "#F2B50F", "#8E62D9", "#5AB98F", "#F1A356"];

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
      setLoading(true);
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

  const totalSpent = Number(summary?.spentAmount ?? 0);
  const totalBudget = Number(summary?.totalBudget ?? 0);
  const remaining = Number(summary?.remainingAmount ?? 0);

  const breakdown =
    summary?.categories?.map((cat, index) => ({
      label: cat.name,
      value: Number(cat.amount || 0),
      color: CHART_COLORS[index % CHART_COLORS.length],
    })) || [];

  const isEmpty = totalBudget === 0 && breakdown.length === 0;

  const spentPercent =
    totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  const topCategory =
    breakdown.length > 0
      ? [...breakdown].sort((a, b) => b.value - a.value)[0]
      : null;

  const budgetStatus =
    totalBudget === 0
      ? "No budget set"
      : remaining <= 0
      ? "Budget exceeded"
      : spentPercent >= 90
      ? "Almost at limit"
      : spentPercent >= 60
      ? "Keep an eye on spending"
      : "You’re on track";

  const budgetStatusColor =
    totalBudget === 0
      ? "#6B7280"
      : remaining <= 0
      ? "#DC2626"
      : spentPercent >= 90
      ? "#D97706"
      : spentPercent >= 60
      ? "#F59E0B"
      : "#16A34A";

  const insightText =
    totalBudget === 0
      ? "Set a budget to unlock smarter spending insights."
      : breakdown.length === 0
      ? "No expenses yet this month. You’re starting clean."
      : topCategory
      ? `${topCategory.label} is your highest spending category so far.`
      : "Your monthly spending is being tracked.";

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <LinearGradient
          colors={["#FFF7FA", "#FDEFF5"]}
          style={styles.heroCard}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.heroTextWrap}>
              <Text style={styles.title}>Hi {displayName} 💗</Text>
              <Text style={styles.subtitle}>Here’s your month at a glance</Text>
            </View>

            <View style={styles.avatarBubble}>
              <Text style={styles.avatarText}>
                {(displayName || "B").charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View
              style={[styles.statusDot, { backgroundColor: budgetStatusColor }]}
            />
            <Text style={[styles.statusText, { color: budgetStatusColor }]}>
              {budgetStatus}
            </Text>
          </View>

          {totalBudget > 0 && (
            <>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${spentPercent}%`,
                      backgroundColor: budgetStatusColor,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressLabel}>
                {spentPercent.toFixed(1)}% of budget used
              </Text>
            </>
          )}
        </LinearGradient>

        {isEmpty ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="wallet-outline" size={30} color="#FF4FA3" />
            </View>

            <Text style={styles.emptyTitle}>No budget yet</Text>
            <Text style={styles.emptyText}>
              Set your monthly budget to start tracking spending and insights.
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
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Budget</Text>
                <Text style={styles.summaryValue}>${totalBudget}</Text>
                <Text style={styles.summarySub}>This month</Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Spent</Text>
                <Text style={styles.summaryValue}>${totalSpent}</Text>
                <Text style={styles.summarySub}>This month</Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Remaining</Text>
                <Text style={styles.summaryValue}>${remaining}</Text>
                <Text style={styles.summarySub}>This month</Text>
              </View>
            </View>

            <View style={styles.insightCard}>
              <View style={styles.insightIconWrap}>
                <Ionicons name="sparkles-outline" size={18} color="#DB2777" />
              </View>

              <View style={styles.insightTextWrap}>
                <Text style={styles.insightTitle}>Quick Insight</Text>
                <Text style={styles.insightText}>{insightText}</Text>
              </View>
            </View>

            {topCategory && (
              <View style={styles.topCategoryCard}>
                <View>
                  <Text style={styles.topCategoryLabel}>Top Spending</Text>
                  <Text style={styles.topCategoryName}>{topCategory.label}</Text>
                </View>

                <View style={styles.topCategoryAmountWrap}>
                  <Text style={styles.topCategoryAmount}>
                    ${topCategory.value}
                  </Text>
                </View>
              </View>
            )}

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
    paddingBottom: 40,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  heroCard: {
    borderRadius: 26,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#F6D7E7",
    shadowColor: "#FF4FA3",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroTextWrap: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
  },

  avatarBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F9C8DA",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  statusText: {
    fontSize: 14,
    fontWeight: "700",
  },

  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: "#F3E8EE",
    borderRadius: 999,
    marginTop: 12,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  progressLabel: {
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#F6CDE2",
    marginHorizontal: 4,
    shadowColor: "#FF4FA3",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  summaryTitle: {
    fontSize: 13,
    color: "#6B7280",
  },

  summaryValue: {
    fontSize: 22,
    fontWeight: "900",
    marginVertical: 6,
    color: "#111827",
  },

  summarySub: {
    color: "#FF4FA3",
    fontWeight: "700",
    fontSize: 12,
  },

  insightCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F6CDE2",
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#FF4FA3",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  insightIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },

  insightTextWrap: {
    flex: 1,
  },

  insightTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },

  insightText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },

  topCategoryCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F6CDE2",
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#FF4FA3",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  topCategoryLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },

  topCategoryName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  topCategoryAmountWrap: {
    backgroundColor: "#FFF1F5",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
  },

  topCategoryAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#DB2777",
  },

  breakdownCard: {
    backgroundColor: "#fff",
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F6CDE2",
    shadowColor: "#FF4FA3",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  breakdownTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 14,
    color: "#111827",
  },

  noData: {
    alignItems: "center",
    paddingVertical: 40,
  },

  noDataText: {
    color: "#6B7280",
    fontSize: 14,
  },

  legend: {
    marginTop: 14,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },

  legendLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },

  legendPercent: {
    width: 70,
    textAlign: "right",
    color: "#9CA3AF",
    fontSize: 13,
  },

  legendAmount: {
    width: 70,
    textAlign: "right",
    fontWeight: "700",
    fontSize: 14,
    color: "#111827",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 26,
  },

  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 22,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#FF4FA3",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    textAlign: "center",
  },

  emptyContainer: {
    backgroundColor: "#fff",
    borderRadius: 26,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F6CDE2",
    shadowColor: "#FF4FA3",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  emptyIconWrap: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
    color: "#111827",
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
    shadowColor: "#FF4FA3",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
});