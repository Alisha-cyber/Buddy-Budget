import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import { useTransactions } from "../../context/TransactionContext";
import { useAuth } from "../../hooks/useAuth";
import ScreenWrapper from "../../components/ScreenWrapper";

const CATEGORY_PRESETS = [
  { key: "Food", icon: "restaurant-outline", accent: "#FFD36A" },
  { key: "Shopping", icon: "bag-handle-outline", accent: "#CDB7FF" },
  { key: "Transport", icon: "car-outline", accent: "#B6F2D1" },
  { key: "Housing", icon: "home-outline", accent: "#FFB7C9" },
];

const MORE_CATEGORIES = [
  "Bills",
  "Health",
  "Entertainment",
  "Education",
  "Subscriptions",
  "Travel",
  "Gifts",
  "Other",
];

export default function AddTransactionScreen({ navigation }) {
  const { addTransaction } = useTransactions();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [notes, setNotes] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const resetForm = () => {
    setAmount("");
    setType("Expense");
    setSelectedCategory("Food");
    setNotes("");
    setShowMore(false);
  };

  const formattedAmount = useMemo(() => {
    const n = Number(amount);
    if (!amount || Number.isNaN(n)) return "$0.00";
    return `$${n.toFixed(2)}`;
  }, [amount]);

  const onSave = async () => {
    if (!amount || Number(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);

      await addTransaction({
        userId: user.userId, // from auth context
        categoryId: selectedCategory, // TEMP until you create category route
        amount: Number(amount),
        transactionType: type.toLowerCase(), // "expense" or "income"
        note: notes,
        transactionDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      });

      Alert.alert("Success 🎉", "Transaction added successfully!", [
        {
          text: "OK",
          onPress: () => {
            resetForm(); // reset page
            navigation.goBack(); // optional: go back
          },
        },
      ]);
    } catch (err) {
      Alert.alert("Error", "Failed to save transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>

    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={18} color={COLORS.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Add Transaction</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Amount */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountBig}>{formattedAmount}</Text>

          <View style={styles.amountInputRow}>
            <Text style={styles.dollar}>$</Text>
            <TextInput
              value={amount}
              onChangeText={(t) => {
                const cleaned = t.replace(/[^0-9.]/g, "");
                const parts = cleaned.split(".");
                const safe =
                  parts.length <= 2
                    ? cleaned
                    : `${parts[0]}.${parts.slice(1).join("")}`;
                setAmount(safe);
              }}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={"rgba(0,0,0,0.25)"}
              style={styles.amountInput}
            />
          </View>
        </View>

        {/* Type Toggle */}
        <View style={styles.toggleWrap}>
          {["Income", "Expense"].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.toggleBtn, type === t && styles.toggleActive]}
              onPress={() => setType(t)}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.toggleText,
                  type === t && styles.toggleTextActive,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category */}
        <Text style={styles.sectionTitle}>Category</Text>

        <View style={styles.chipsRow}>
          {CATEGORY_PRESETS.map((c) => {
            const isActive = selectedCategory === c.key;
            return (
              <TouchableOpacity
                key={c.key}
                activeOpacity={0.9}
                onPress={() => {
                  setSelectedCategory(c.key);
                  setShowMore(false);
                }}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <View style={[styles.chipIcon, { backgroundColor: c.accent }]}>
                  <Ionicons name={c.icon} size={16} color="#222" />
                </View>
                <Text style={styles.chipText}>{c.key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Dropdown */}
        <TouchableOpacity
          onPress={() => setShowMore((p) => !p)}
          style={styles.dropdown}
        >
          <View style={styles.dropdownLeft}>
            <Ionicons
              name="pricetag-outline"
              size={16}
              color={COLORS.primaryDark}
            />
            <Text style={styles.dropdownText}>{selectedCategory}</Text>
          </View>

          <Ionicons
            name={showMore ? "chevron-up" : "chevron-down"}
            size={18}
            color={COLORS.muted}
          />
        </TouchableOpacity>

        {showMore && (
          <View style={styles.moreWrap}>
            {MORE_CATEGORIES.map((name) => {
              const isActive = selectedCategory === name;
              return (
                <TouchableOpacity
                  key={name}
                  style={[styles.moreItem, isActive && styles.moreItemActive]}
                  onPress={() => {
                    setSelectedCategory(name);
                    setShowMore(false);
                  }}
                >
                  <Text
                    style={[styles.moreText, isActive && styles.moreTextActive]}
                  >
                    {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Notes */}
        <Text style={styles.sectionTitle}>Notes</Text>
        <View style={styles.notesBox}>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add a note..."
            placeholderTextColor={"rgba(0,0,0,0.25)"}
            style={styles.notesInput}
            multiline
          />
        </View>

        {/* Save */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.saveBtn, loading && { opacity: 0.6 }]}
          onPress={onSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? "Saving..." : "Save Transaction"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 26 }} />
      </ScrollView>
    </KeyboardAvoidingView>
    </ScreenWrapper>

  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bgTop },
  container: { padding: 18, paddingTop: 16 },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "900", color: COLORS.text },

  amountCard: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },
  amountLabel: { fontWeight: "900", fontSize: 12 },
  amountBig: { fontSize: 34, fontWeight: "900", marginTop: 8 },
  amountInputRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  dollar: { fontSize: 16, fontWeight: "900", marginRight: 6 },
  amountInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.65)",
  },

  toggleWrap: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 18,
    padding: 4,
    marginBottom: 14,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleText: { fontWeight: "900", color: COLORS.muted },
  toggleTextActive: { color: "#fff" },

  sectionTitle: { fontWeight: "900", marginBottom: 8 },

  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    width: "47%",
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  chipActive: { borderWidth: 2, borderColor: COLORS.primary },
  chipIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  chipText: { fontWeight: "900" },

  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.75)",
    marginBottom: 10,
  },
  dropdownLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  dropdownText: { fontWeight: "900" },

  moreWrap: {
    padding: 10,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  moreItem: {
    padding: 10,
    borderRadius: 14,
    marginBottom: 8,
  },
  moreItemActive: { backgroundColor: COLORS.primary },
  moreText: { fontWeight: "900" },
  moreTextActive: { color: "#fff" },

  notesBox: {
    borderRadius: 18,
    padding: 12,
    minHeight: 110,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  notesInput: { minHeight: 90 },

  saveBtn: {
    paddingVertical: 14,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "900" },
});
