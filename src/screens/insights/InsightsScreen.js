import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { useInsights } from "../../context/InsightContext";

export default function InsightsScreen() {
  const { user } = useAuth();
  const { insights, fetchInsights, markRead } = useInsights();

  useFocusEffect(
    React.useCallback(() => {
      if (user?._id) {
        fetchInsights(user._id);
      }
    }, [user?._id])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.unreadCard]}
      activeOpacity={0.9}
      onPress={() => markRead(item._id)}
    >
      <View style={styles.row}>
        <Ionicons name="sparkles-outline" size={18} color="#DB2777" />
        <Text style={styles.title}>{item.title}</Text>
      </View>

      <Text style={styles.message}>{item.message}</Text>

      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={insights}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          <Text style={styles.empty}>No insights yet.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FDEFF5",
  },
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3DEE7",
  },
  unreadCard: {
    borderColor: "#FF4FA3",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  message: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    color: "#9CA3AF",
  },
  empty: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 40,
  },
});