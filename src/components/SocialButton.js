import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";

export default function SocialButton({ children, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} activeOpacity={0.85} onPress={onPress}>
      <View>{children}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F7D6E8",
    shadowColor: "rgba(255,79,163,0.20)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
});
