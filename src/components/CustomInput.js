import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export default function CustomInput(props) {
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        style={styles.input}
        placeholderTextColor="#F2A8CD"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  input: {
    fontSize: 15,
    color: COLORS.darkText,
  },
});
