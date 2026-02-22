import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants/colors";

export default function CustomButton({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapper}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primary2]}
        style={styles.button}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: 20, overflow: "hidden" },
  button: { paddingVertical: 16, alignItems: "center" },
  text: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
