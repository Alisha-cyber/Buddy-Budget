import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";

export default function ExpensePieChart({
  data = [],
  total = 0,
  remaining = 0,
  showRemaining = true,
}) {
  const chartData = data.map((item) => ({
    name: item.label,
    population: item.value,
    color: item.color,
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  }));

  return (
    <View style={styles.wrapper}>
      {/* PIE CHART */}
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={190}
          height={170}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="30"
          hasLegend={false}
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: () => "#000",
          }}
        />
      </View>

      {/* TOTAL + REMAINING */}
      <View style={styles.summary}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${total}</Text>

        {showRemaining && (
          <>
            <Text style={styles.remainingLabel}>Remaining</Text>
            <Text style={styles.remainingValue}>${remaining}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },

  chartContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  summary: {
    justifyContent: "center",
  },

  totalLabel: {
    fontSize: 15,
    color: "#6B7280",
  },

  totalValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  remainingLabel: {
    fontSize: 14,
    color: "#6B7280",
  },

  remainingValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#10B981",
  },
});
