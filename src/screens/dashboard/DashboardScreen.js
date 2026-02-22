import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PieChart from "../../components/PieChart";
import SpendCard from "../../components/SpendCard";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";
import { useTransactions } from "../../context/TransactionContext";
import { useAuth } from "../../hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenWrapper from "../../components/ScreenWrapper";

const PIE_COLORS = [
  "#FF4FA3",
  "#FF7BBE",
  "#FFA7D7",
  "#FFD1EA",
  "#F78ACB",
  "#E75480",
  "#C71585",
];

export default function DashboardScreen() {
  const { fetchTransactions, months, getMonthlySummary } = useTransactions();
  const { user, logout } = useAuth();
  const displayName = user?.name || user?.email?.split("@")[0] || "Buddy";

  // Fetch from backend on mount
  useEffect(() => {
    fetchTransactions({ userId: user.userId });
  }, []);

  const currentMonth = months?.[0];

  const summary = currentMonth ? getMonthlySummary(currentMonth) : null;

  const totalSpent = summary?.expense ?? 0;
  const totalIncome = summary?.income ?? 0;

  const remaining = totalIncome - totalSpent;
  const breakdown =
    summary?.categories
      ?.filter((c) => c.expense > 0)
      ?.map((cat, index) => ({
        label: cat.name,
        value: cat.expense,
        color: PIE_COLORS[index % PIE_COLORS.length],
      })) || [];

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.hello}>Hi {user?.name || "User"} 💗</Text>
            <Text style={styles.subtitle}>Here’s your month at a glance</Text>
          </View>

          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Monthly Spend Card */}
        <SpendCard
          title="Monthly Spend"
          value={`$${totalSpent.toFixed(0)}`}
          subtitle={`Remaining: $${remaining.toFixed(0)}`}
          rightPill={summary?.monthTitle || "No Data"}
        />

        <View style={{ height: 16 }} />

        {/* Small Summary Cards */}
        <View style={styles.rowCards}>
          <View style={[styles.smallCard, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.smallTitle}>Total Income</Text>
            <Text style={styles.smallValue}>${totalIncome.toFixed(0)}</Text>
            <Text style={styles.smallHint}>This month</Text>
          </View>

          <View style={[styles.smallCard, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.smallTitle}>Transactions</Text>
            <Text style={styles.smallValue}>
              {summary?.transactions?.length || 0}
            </Text>
            <Text style={styles.smallHint}>This month</Text>
          </View>
        </View>

        <View style={{ height: 18 }} />

        {/* Breakdown Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending Breakdown</Text>
            <Text style={styles.sectionTag}>Monthly</Text>
          </View>

          {breakdown.length > 0 ? (
            <View style={styles.breakdownRow}>
              <PieChart
                size={180}
                strokeWidth={24}
                data={breakdown}
                centerTitle="Spent"
                centerValue={`$${totalSpent.toFixed(0)}`}
                subtitle="This month"
              />

              <View style={styles.legend}>
                {breakdown.map((item) => (
                  <View key={item.label} style={styles.legendRow}>
                    <View
                      style={[styles.dot, { backgroundColor: item.color }]}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.legendLabel}>{item.label}</Text>
                    </View>
                    <Text style={styles.legendValue}>
                      ${item.value.toFixed(0)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.noData}>No spending data for this month.</Text>
          )}
        </View>

        <View style={{ height: 18 }} />

        {/* Tip Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Smart Tip 💡</Text>
          <Text style={styles.tipText}>
            Try setting a weekly limit for your top spending category. Small
            caps create big savings over time ✨
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    padding: SPACING.l,
    paddingTop: 26,
  },
  header: { marginBottom: 16 },
  hello: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.muted,
  },

  rowCards: {
    flexDirection: "row",
  },
  smallCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: "#F6CDE2",
    ...SHADOW.card,
  },
  smallTitle: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "700",
  },
  smallValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
  },
  smallHint: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: "700",
  },

  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.l,
    borderWidth: 1,
    borderColor: "#F6CDE2",
    ...SHADOW.card,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
  },
  sectionTag: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primaryDark,
    backgroundColor: "#FFE0F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#F6CDE2",
  },

  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  legend: {
    flex: 1,
    marginLeft: 14,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#F8E6F1",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 10,
  },
  legendLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },
  legendValue: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.text,
  },
  tipText: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 18,
  },
  noData: {
    fontSize: 14,
    color: COLORS.muted,
  },
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F6CDE2",
  },

  logoutText: {
    fontWeight: "800",
    color: "#E53935",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F6CDE2",
    alignSelf: "flex-start", // optional safety
  },
});
