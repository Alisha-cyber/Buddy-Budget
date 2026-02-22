import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import { useTransactions } from "../../context/TransactionContext";

export default function InsightsScreen() {
  const { getMonths, getMonthlySummary } = useTransactions();

  const months = getMonths;
  const defaultMonth = months[0] || "2026-01";
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const summary = useMemo(() => getMonthlySummary(selectedMonth), [selectedMonth, getMonthlySummary]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Monthly Breakdown</Text>
          <Text style={styles.subtitle}>Category insights + your real spending</Text>
        </View>

        {/* Month picker row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          {months.length === 0 ? (
            <Text style={{ color: COLORS.muted }}>No transactions yet</Text>
          ) : (
            months.map((m) => {
              const isActive = m === selectedMonth;
              return (
                <TouchableOpacity
                  key={m}
                  activeOpacity={0.9}
                  onPress={() => setSelectedMonth(m)}
                  style={[styles.monthPill, isActive && styles.monthPillActive]}
                >
                  <Text style={[styles.monthText, isActive && styles.monthTextActive]}>
                    {getMonthlySummary(m).monthTitle}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        {/* Summary cards */}
        <View style={styles.row}>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>Income</Text>
            <Text style={styles.miniValue}>${summary.income.toFixed(2)}</Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>Expense</Text>
            <Text style={styles.miniValue}>${summary.expense.toFixed(2)}</Text>
          </View>
        </View>

        <View style={[styles.bigCard, { marginTop: 12 }]}>
          <Text style={styles.bigLabel}>Net (Income - Expense)</Text>
          <Text style={styles.bigValue}>
            {summary.net >= 0 ? "+" : "-"}${Math.abs(summary.net).toFixed(2)}
          </Text>
        </View>

        {/* Category insights */}
        <Text style={styles.sectionTitle}>Category Insights</Text>

        {summary.categories.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="sparkles-outline" size={18} color={COLORS.primaryDark} />
            <Text style={styles.emptyText}>Add a few transactions to see insights here ✨</Text>
          </View>
        ) : (
          summary.categories.map((c) => (
            <View key={c.name} style={styles.categoryRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.categoryName}>{c.name}</Text>
                <Text style={styles.categoryHint}>
                  {c.count} transaction{c.count > 1 ? "s" : ""}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.categoryAmount}>-${c.expense.toFixed(2)}</Text>
              </View>
            </View>
          ))
        )}

        {/* Monthly transaction list */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>This Month’s Transactions</Text>

        {summary.transactions.length === 0 ? (
          <Text style={{ color: COLORS.muted }}>No transactions in this month yet.</Text>
        ) : (
          summary.transactions.map((t) => (
            <View key={t.id} style={styles.txRow}>
              <View style={styles.txLeft}>
                <Text style={styles.txTitle}>{t.category}</Text>
                <Text style={styles.txSub}>
                  {new Date(t.date).toLocaleDateString()} • {t.note || "—"}
                </Text>
              </View>
              <Text style={[styles.txAmount, t.type === "Income" && styles.income]}>
                {t.type === "Income" ? "+" : "-"}${Number(t.amount).toFixed(2)}
              </Text>
            </View>
          ))
        )}

        <View style={{ height: 22 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bgTop },
  container: { padding: 18, paddingTop: 16 },

  header: { marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "900", color: COLORS.text },
  subtitle: { marginTop: 4, color: COLORS.muted, fontWeight: "700" },

  monthPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    marginRight: 10,
  },
  monthPillActive: { backgroundColor: COLORS.primary },
  monthText: { fontSize: 12, fontWeight: "800", color: COLORS.text },
  monthTextActive: { color: "#fff" },

  row: { flexDirection: "row", gap: 12 },
  miniCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  miniLabel: { color: COLORS.muted, fontWeight: "800", fontSize: 12 },
  miniValue: { marginTop: 6, fontSize: 16, fontWeight: "900", color: COLORS.text },

  bigCard: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  bigLabel: { color: COLORS.muted, fontWeight: "800", fontSize: 12 },
  bigValue: { marginTop: 6, fontSize: 22, fontWeight: "900", color: COLORS.text },

  sectionTitle: { marginTop: 14, marginBottom: 10, fontWeight: "900", color: COLORS.text },

  emptyBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  emptyText: { color: COLORS.primaryDark, fontWeight: "800" },

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    marginBottom: 10,
  },
  categoryName: { fontWeight: "900", color: COLORS.text },
  categoryHint: { marginTop: 3, color: COLORS.muted, fontWeight: "700", fontSize: 12 },
  categoryAmount: { fontWeight: "900", color: COLORS.text },

  txRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    marginBottom: 10,
  },
  txLeft: { flex: 1 },
  txTitle: { fontWeight: "900", color: COLORS.text },
  txSub: { marginTop: 3, color: COLORS.muted, fontWeight: "700", fontSize: 12 },
  txAmount: { fontWeight: "900", color: COLORS.text },
  income: { color: "#2E9E66" },
});