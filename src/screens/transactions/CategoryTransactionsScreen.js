import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "../../context/TransactionContext";
import { useAuth } from "../../hooks/useAuth";

export default function CategoryTransactionsScreen({ route, navigation }) {
  const { category, monthIndex, year } = route.params || {};
  const { user } = useAuth();
  const { transactions = [], fetchTransactions } = useTransactions();

  const [sortBy, setSortBy] = useState("date_desc");

  const categoryName =
    category?.name || category?.category || category || "Category";

  useEffect(() => {
    if (user?._id) {
      fetchTransactions({ userId: user._id });
    }
  }, [user?._id, fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    const data = (transactions || []).filter((tx) => {
      if (!tx?.transactionDate) return false;

      const txDate = new Date(tx.transactionDate);

      return (
        tx.categoryId === categoryName &&
        txDate.getMonth() === monthIndex &&
        txDate.getFullYear() === year
      );
    });

    data.sort((a, b) => {
      if (sortBy === "date_desc") {
        return new Date(b.transactionDate) - new Date(a.transactionDate);
      }

      if (sortBy === "date_asc") {
        return new Date(a.transactionDate) - new Date(b.transactionDate);
      }

      if (sortBy === "amount_low") {
        return Number(a.amount || 0) - Number(b.amount || 0);
      }

      if (sortBy === "amount_high") {
        return Number(b.amount || 0) - Number(a.amount || 0);
      }

      return 0;
    });

    return data;
  }, [transactions, categoryName, monthIndex, year, sortBy]);

  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, item) => sum + Number(item?.amount || 0),
      0
    );
  }, [filteredTransactions]);

  const monthLabel = useMemo(() => {
    return new Date(year, monthIndex).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  }, [monthIndex, year]);

  const sortOptions = [
    { key: "date_desc", label: "Newest" },
    { key: "date_asc", label: "Oldest" },
    { key: "amount_low", label: "Low-High" },
    { key: "amount_high", label: "High-Low" },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() =>
        navigation.navigate("EditTransaction", {
          transaction: item,
        })
      }
    >
      <View style={styles.rowTop}>
        <Text style={styles.amount}>
          ${Number(item?.amount || 0).toFixed(2)}
        </Text>
        <Text style={styles.date}>
          {new Date(item.transactionDate).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.note}>
        {item?.note?.trim() ? item.note : "No note"}
      </Text>

      <View style={styles.editRow}>
        <Ionicons name="create-outline" size={14} color="#FF4F87" />
        <Text style={styles.editText}>Tap to edit</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.topTitle}>{categoryName}</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.container}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>{categoryName}</Text>
          <Text style={styles.headerSub}>{monthLabel}</Text>

          <View style={styles.headerStats}>
            <View style={styles.statBoxLeft}>
              <Text style={styles.statLabel}>Total Spent</Text>
              <Text style={styles.statValue}>${totalAmount.toFixed(2)}</Text>
            </View>

            <View style={styles.statBoxRight}>
              <Text style={styles.statLabel}>Transactions</Text>
              <Text style={styles.statValue}>
                {filteredTransactions.length}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sortRow}>
          {sortOptions.map((option) => {
            const active = sortBy === option.key;

            return (
              <TouchableOpacity
                key={option.key}
                style={[styles.sortBtn, active && styles.sortBtnActive]}
                onPress={() => setSortBy(option.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.sortText, active && styles.sortTextActive]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={filteredTransactions}
          keyExtractor={(item, index) =>
            item?._id || `${categoryName}-${index}`
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No transactions found.</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FDEFF5",
  },

  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  headerSpacer: {
    width: 36,
    height: 36,
  },

  topTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3DEE7",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  headerSub: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  headerStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  statBoxLeft: {
    flex: 1,
    backgroundColor: "#FFF7FA",
    borderRadius: 14,
    padding: 12,
    marginRight: 8,
  },

  statBoxRight: {
    flex: 1,
    backgroundColor: "#FFF7FA",
    borderRadius: 14,
    padding: 12,
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  statValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "700",
    color: "#FF4F87",
  },

  sortRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },

  sortBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "#FFF7FA",
    borderWidth: 1,
    borderColor: "#F3DEE7",
    marginRight: 8,
    marginBottom: 8,
  },

  sortBtnActive: {
    backgroundColor: "#FF4FA3",
    borderColor: "#FF4FA3",
  },

  sortText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },

  sortTextActive: {
    color: "#fff",
  },

  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#FFF7FA",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F3DEE7",
  },

  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF4F87",
  },

  date: {
    fontSize: 12,
    color: "#6B7280",
  },

  note: {
    fontSize: 13,
    color: "#374151",
  },

  editRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  editText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#FF4F87",
    fontWeight: "600",
  },

  emptyText: {
    marginTop: 20,
    textAlign: "center",
    color: "#9CA3AF",
  },
});