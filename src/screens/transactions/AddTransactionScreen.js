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
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import { useTransactions } from "../../context/TransactionContext";
import { useAuth } from "../../hooks/useAuth";
import ScreenWrapper from "../../components/ScreenWrapper";
import { getMonthlyBudget } from "../../services/budgetService";

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
  const { user } = useAuth();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [notes, setNotes] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      setErrorMessage("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);

      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      const budgetData = await getMonthlyBudget(user._id, year, month);
      const totalBudget = Number(budgetData?.totalBudget || 0);

      if (totalBudget <= 0) {
        setLoading(false);
        setShowBudgetModal(true);
        return;
      }

      await addTransaction({
        userId: user._id,
        categoryId: selectedCategory,
        amount: Number(amount),
        transactionType: type.toLowerCase(),
        note: notes,
        transactionDate: new Date().toISOString().split("T")[0],
      });

      resetForm();
      setShowSuccessModal(true);
    } catch (err) {
      setErrorMessage("Failed to save transaction.");
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
          showsVerticalScrollIndicator={false}
        >
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

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color="#B42318"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountBig}>{formattedAmount}</Text>

            <View style={styles.amountInputRow}>
              <Text style={styles.dollar}>$</Text>
              <TextInput
                value={amount}
                onChangeText={(t) => {
                  setErrorMessage("");
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

          <Text style={styles.sectionTitle}>Notes</Text>
          <View style={styles.notesBox}>
            <TextInput
              value={notes}
              onChangeText={(t) => {
                setErrorMessage("");
                setNotes(t);
              }}
              placeholder="Add a note..."
              placeholderTextColor={"rgba(0,0,0,0.25)"}
              style={styles.notesInput}
              multiline
            />
          </View>

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

        <Modal
          visible={showBudgetModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowBudgetModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalIconWrap}>
                <Ionicons name="wallet-outline" size={28} color="#DB2777" />
              </View>

              <Text style={styles.modalTitle}>Set Budget First</Text>
              <Text style={styles.modalSubtitle}>
                Please set your monthly budget before adding a transaction. This
                helps BuddyBudget track your spending properly.
              </Text>

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowBudgetModal(false)}
                >
                  <Text style={styles.modalCancelText}>Not now</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={() => {
                    setShowBudgetModal(false);
                    navigation.navigate("Budget");
                  }}
                >
                  <Text style={styles.modalPrimaryText}>Set Budget</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showSuccessModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={[styles.modalIconWrap, styles.successIconWrap]}>
                <Ionicons name="checkmark" size={28} color="#16A34A" />
              </View>

              <Text style={styles.modalTitle}>Transaction Saved</Text>
              <Text style={styles.modalSubtitle}>
                Your transaction was added successfully.
              </Text>

              <TouchableOpacity
                style={styles.modalPrimaryBtnSingle}
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.goBack();
                }}
              >
                <Text style={styles.modalPrimaryText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3F2",
    borderWidth: 1,
    borderColor: "#FECDCA",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 12,
  },
  errorText: {
    color: "#B42318",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },

  amountCard: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },
  amountLabel: { fontWeight: "900", fontSize: 12 },
  amountBig: { fontSize: 34, fontWeight: "900", marginTop: 8 },
  amountInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(31, 41, 55, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 22,
    alignItems: "center",
  },
  modalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  successIconWrap: {
    backgroundColor: "#DCFCE7",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
  },
  modalSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    textAlign: "center",
  },
  modalButtonRow: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
  },
  modalCancelBtn: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#FCECF3",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5C8D8",
  },
  modalCancelText: {
    fontWeight: "700",
    color: "#D94C8A",
    fontSize: 15,
  },
  modalPrimaryBtn: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#F8C9DA",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  modalPrimaryBtnSingle: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#F8C9DA",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  modalPrimaryText: {
    fontWeight: "700",
    color: "#253046",
    fontSize: 15,
  },
});