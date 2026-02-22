import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

const ICONS = {
  Food: { lib: "MaterialCommunityIcons", name: "silverware-fork-knife" },
  Shopping: { lib: "Ionicons", name: "bag-outline" },
  Transport: { lib: "Ionicons", name: "car-outline" },
  Housing: { lib: "Ionicons", name: "home-outline" },
};

export default function CategoryChip({ label, selected, onPress, tint }) {
  const icon = ICONS[label];

  const IconComp =
    icon?.lib === "MaterialCommunityIcons" ? MaterialCommunityIcons : Ionicons;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: selected ? tint : COLORS.white },
        selected && styles.selectedShadow,
      ]}
    >
      {icon ? (
        <IconComp
          name={icon.name}
          size={18}
          color={selected ? COLORS.text : COLORS.primaryDark}
        />
      ) : null}
      <Text style={[styles.label, selected && { color: COLORS.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  selectedShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: "600",
  },
});