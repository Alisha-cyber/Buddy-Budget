import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants/theme";

export default function ScreenWrapper({
  children,
  useGradient = true,
}) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.bgTop, // 👈 THIS FIXES WHITE TOP
      }}
      edges={["top"]}
    >
      {useGradient ? (
        <LinearGradient
          colors={[COLORS.bgTop, COLORS.bgBottom]}
          style={{ flex: 1 }}
        >
          {children}
        </LinearGradient>
      ) : (
        children
      )}
    </SafeAreaView>
  );
}
