import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";

export default function CategoryTransactionsScreen({ route }) {
  const { category, monthIndex, year } = route.params || {};

  const categoryName = category?.name || "Category";

  const transactions = useMemo(() => {
    const items = Array.isArray(category?.items) ? category.items : [];

    return items.filter((item) => {
      if (!item?.transactionDate) return false;

      const txDate = new Date(item.transactionDate);

      return (
        txDate.getMonth() === monthIndex &&
        txDate.getFullYear() === year
      );
    });
  }, [category, monthIndex, year]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowTop}>
        <Text style={styles.amount}>${Number(item?.amount || 0).toFixed(2)}</Text>
        <Text style={styles.date}>
          {new Date(item.transactionDate).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.note}>
        {item?.note?.trim() ? item.note : "No note"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>{categoryName}</Text>
        <Text style={styles.subheading}>
          {transactions.length}{" "}
          {transactions.length === 1 ? "transaction" : "transactions"}
        </Text>

        <FlatList
          data={transactions}
          keyExtractor={(item, index) => item?._id || `${categoryName}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No transactions found.</Text>
          }
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
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  subheading: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
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
  emptyText: {
    marginTop: 20,
    textAlign: "center",
    color: "#9CA3AF",
  },
});