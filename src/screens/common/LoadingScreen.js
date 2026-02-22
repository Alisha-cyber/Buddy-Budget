import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ff4da6" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe6f0",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    color: "#ff3399",
    fontWeight: "600",
  },
});
