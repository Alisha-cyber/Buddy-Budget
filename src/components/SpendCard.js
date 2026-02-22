import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS, SHADOW, SPACING } from "../constants/theme";

export default function SpendCard({
  title = "Title",
  value = "$0",
  subtitle = "",
  rightPill = "",
}) {
  return (
    <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>

        {rightPill ? (
          <View style={styles.pill}>
            <Text style={styles.pillText}>{rightPill}</Text>
          </View>
        ) : null}
      </View>

      {/* Main Value */}
      <Text style={styles.value}>
        {value}
      </Text>

      {/* Subtitle */}
      {subtitle ? (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.l,
    borderWidth: 1,
    borderColor: "#F6CDE2",
    ...SHADOW.card,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.muted,
  },

  value: {
    marginTop: 10,
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primaryDark,
  },

  pill: {
    backgroundColor: "#FFE0F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#F6CDE2",
  },

  pillText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },
});
