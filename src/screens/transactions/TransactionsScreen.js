import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { COLORS, SPACING } from "../../constants/theme";
import { useTransactions } from "../../context/TransactionContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function TransactionsScreen() {
  const { transactions, fetchTransactions } = useTransactions([]);
  const [selectedType, setSelectedType] = useState("all"); // all | income | expense
  const [selectedMonth, setSelectedMonth] = useState("all"); // all or YYYY-MM
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.categoryId));
    return ["all", ...Array.from(set)];
  }, [transactions]);

  // Fetch transactions from API
  useEffect(() => {
    fetchTransactions({ userId: user.userId });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions({ userId: user.userId });
    setRefreshing(false);
  };

  // Get available months dynamically
  const availableMonths = useMemo(() => {
    const months = new Set(
      transactions.map((t) => {
        const d = new Date(t.transactionDate);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      })
    );
    return Array.from(months).sort().reverse();
  }, [transactions]);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    let data = [...transactions];

    // Filter by type
    if (selectedType !== "all") {
      data = data.filter((t) => t.transactionType === selectedType);
    }

    // Filter by category
    if (selectedCategory !== "all") {
      data = data.filter((t) => t.categoryId === selectedCategory);
    }

    // Filter by date (exact day match)
    if (selectedDate) {
      const selected = new Date(selectedDate).toDateString();
      data = data.filter(
        (t) => new Date(t.transactionDate).toDateString() === selected
      );
    }

    // Sort newest first
    data.sort(
      (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
    );

    return data;
  }, [transactions, selectedType, selectedCategory, selectedDate]);

  const renderItem = ({ item }) => {
    const isIncome = item.transactionType === "income";

    return (

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.category}>{item.categoryId}</Text>

          <Text
            style={[styles.amount, { color: isIncome ? "#1DB954" : "#E53935" }]}
          >
            {isIncome ? "+" : "-"}${item.amount}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.note}>{item.note || "No note"}</Text>
          <Text style={styles.date}>
            {new Date(item.transactionDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

    );
  };

  return (
    <ScreenWrapper>

    <View style={styles.container}>
      {/* TYPE FILTER */}
      <View style={styles.filterRow}>
        {["all", "income", "expense"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterBtn,
              selectedType === type && styles.filterActive,
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text
              style={[
                styles.filterText,
                selectedType === type && styles.filterTextActive,
              ]}
            >
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Filter */}
      <TouchableOpacity
        style={styles.filterBtn}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.filterText}>
          {selectedDate
            ? new Date(selectedDate).toLocaleDateString()
            : "Choose Date"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedDate ? new Date(selectedDate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      <View style={styles.filterRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterBtn,
              selectedCategory === cat && styles.filterActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === cat && styles.filterTextActive,
              ]}
            >
              {cat.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.filterBtn, { backgroundColor: "#ddd" }]}
        onPress={() => {
          setSelectedType("all");
          setSelectedCategory("all");
          setSelectedDate(null);
        }}
      >
        <Text style={styles.filterText}>Reset Filters</Text>
      </TouchableOpacity>


      {/* TRANSACTION LIST */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No transactions found.</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
    </ScreenWrapper>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.l,
    backgroundColor: "#FCE4EC",
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },

  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
  },

  filterActive: {
    backgroundColor: COLORS.primary,
  },

  filterText: {
    fontWeight: "700",
    color: "#333",
  },

  filterTextActive: {
    color: "#fff",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  category: {
    fontWeight: "800",
    fontSize: 15,
  },

  amount: {
    fontWeight: "900",
    fontSize: 16,
  },

  note: {
    color: "#666",
    marginTop: 6,
  },

  date: {
    color: "#999",
    marginTop: 6,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
  },
});
