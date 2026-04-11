import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";

export default function BudgetCard({
  category,
  navigation,
  month,
  monthIndex,
  year,
}) {
  const progress = useRef(new Animated.Value(0)).current;

  const name = category?.name || category?.category || "Category";
  const amount = Number(category?.amount || 0);
  const transactions = category?.transactions || 0;
  const percentage = Number(category?.percentage || 0);
  const transactionType = category?.transactionType || "expense";

  const isIncome = transactionType === "income";

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isIncome ? 100 : percentage,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [percentage, progress, isIncome]);

  const width = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      style={[
        styles.card,
        isIncome ? styles.cardIncome : styles.cardExpense,
      ]}
    >
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("CategoryTransactions", {
            category,
            month,
            monthIndex,
            year,
          })
        }
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{name}</Text>

          <Text style={styles.transactions}>
            {transactions} {transactions === 1 ? "transaction" : "transactions"} •{" "}
            {isIncome ? "income" : "expense"}
          </Text>
        </View>

        <View style={styles.right}>
          <Text
            style={[
              styles.amount,
              isIncome ? styles.amountIncome : styles.amountExpense,
            ]}
          >
            {isIncome ? "+" : "-"}${amount.toFixed(2)}
          </Text>

          <Text style={styles.percent}>
            {isIncome ? "income" : `${percentage}%`}
          </Text>
        </View>
      </TouchableOpacity>

      <View
        style={[
          styles.progressTrack,
          isIncome ? styles.progressTrackIncome : styles.progressTrackExpense,
        ]}
      >
        <Animated.View
          style={[
            styles.progressFill,
            { width },
            isIncome ? styles.progressFillIncome : styles.progressFillExpense,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },

  cardExpense: {
    backgroundColor: "#FFF7FA",
    borderColor: "#F3DEE7",
  },

  cardIncome: {
    backgroundColor: "#F3FFF7",
    borderColor: "#D6F5E1",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },

  transactions: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  right: {
    alignItems: "flex-end",
  },

  amount: {
    fontSize: 14,
    fontWeight: "700",
  },

  amountExpense: {
    color: "#FF4F87",
  },

  amountIncome: {
    color: "#16A34A",
  },

  percent: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  progressTrack: {
    height: 6,
    borderRadius: 999,
    marginTop: 10,
    overflow: "hidden",
  },

  progressTrackExpense: {
    backgroundColor: "#F9D9E6",
  },

  progressTrackIncome: {
    backgroundColor: "#DDF7E8",
  },

  progressFill: {
    height: 6,
    borderRadius: 999,
  },

  progressFillExpense: {
    backgroundColor: "#FF6B9A",
  },

  progressFillIncome: {
    backgroundColor: "#22C55E",
  },
});