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
  const amount = category?.amount || 0;
  const transactions = category?.transactions || 0;
  const percentage = Number(category?.percentage || 0);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: percentage,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [percentage, progress]);

  const width = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.card}>
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
        <View style={styles.left}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.transactions}>
            {transactions} {transactions === 1 ? "transaction" : "transactions"}
          </Text>
        </View>

        <View style={styles.right}>
          <Text style={styles.amount}>${Number(amount).toFixed(2)}</Text>
          <Text style={styles.percent}>{percentage}%</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF7FA",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F3DEE7",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  transactions: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  right: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  amount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF4F87",
  },
  percent: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#F9D9E6",
    borderRadius: 999,
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    backgroundColor: "#FF6B9A",
    borderRadius: 999,
  },
});