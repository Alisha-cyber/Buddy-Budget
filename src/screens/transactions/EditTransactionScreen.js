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
import ScreenWrapper from "../../components/ScreenWrapper";

const CATEGORY_PRESETS = [
  "Food",
  "Shopping",
  "Transport",
  "Housing",
  "Bills",
  "Health",
  "Entertainment",
  "Education",
  "Subscriptions",
  "Travel",
  "Gifts",
  "Other",
];

export default function EditTransactionScreen({ route, navigation }) {
  const { transaction } = route.params || {};
  const { updateTransaction, deleteTransaction } = useTransactions();

  const [amount, setAmount] = useState(String(transaction?.amount || ""));
  const [selectedCategory, setSelectedCategory] = useState(
    transaction?.categoryId || "Food"
  );
  const [notes, setNotes] = useState(transaction?.note || "");
  const [loading, setLoading] = useState(false);

  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [showUpdateSuccessModal, setShowUpdateSuccessModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorText, setErrorText] = useState("Something went wrong.");

  const formattedAmount = useMemo(() => {
    const n = Number(amount);
    if (!amount || Number.isNaN(n)) return "$0.00";
    return `$${n.toFixed(2)}`;
  }, [amount]);

  const handleUpdate = async () => {
    if (!amount || Number(amount) <= 0) {
      setShowInvalidModal(true);
      return;
    }

    try {
      setLoading(true);

      await updateTransaction(transaction._id, {
        amount: Number(amount),
        categoryId: selectedCategory,
        note: notes,
      });

      setShowUpdateSuccessModal(true);
    } catch (error) {
      setErrorText("Failed to update transaction.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirmModal(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setShowDeleteConfirmModal(false);

      await deleteTransaction(transaction._id);

      setShowDeleteSuccessModal(true);
    } catch (error) {
      setErrorText("Failed to delete transaction.");
      setShowErrorModal(true);
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
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={18} color={COLORS.text} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Edit Transaction</Text>
            <View style={{ width: 36 }} />
          </View>

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

          <Text style={styles.sectionTitle}>Category</Text>

          <View style={styles.categoryWrap}>
            {CATEGORY_PRESETS.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryChip,
                    active && styles.categoryChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      active && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

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

          <TouchableOpacity
            style={[styles.saveBtn, loading && { opacity: 0.6 }]}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Text style={styles.saveText}>
              {loading ? "Saving..." : "Update Transaction"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteBtn, loading && { opacity: 0.6 }]}
            onPress={confirmDelete}
            disabled={loading}
          >
            <Text style={styles.deleteText}>Delete Transaction</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          visible={showInvalidModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowInvalidModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.warningIconWrap}>
                <Ionicons name="alert-circle-outline" size={28} color="#D97706" />
              </View>

              <Text style={styles.modalTitle}>Invalid Amount</Text>
              <Text style={styles.modalSubtitle}>
                Please enter a valid amount greater than zero.
              </Text>

              <TouchableOpacity
                style={styles.modalPrimaryBtnSingle}
                onPress={() => setShowInvalidModal(false)}
              >
                <Text style={styles.modalPrimaryText}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showUpdateSuccessModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowUpdateSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.successIconWrap}>
                <Ionicons name="checkmark" size={28} color="#16A34A" />
              </View>

              <Text style={styles.modalTitle}>Transaction Updated</Text>
              <Text style={styles.modalSubtitle}>
                Your transaction has been updated successfully.
              </Text>

              <TouchableOpacity
                style={styles.modalPrimaryBtnSingle}
                onPress={() => {
                  setShowUpdateSuccessModal(false);
                  navigation.goBack();
                }}
              >
                <Text style={styles.modalPrimaryText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showDeleteConfirmModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDeleteConfirmModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.deleteIconWrap}>
                <Ionicons name="trash-outline" size={28} color="#DC2626" />
              </View>

              <Text style={styles.modalTitle}>Delete Transaction?</Text>
              <Text style={styles.modalSubtitle}>
                This action cannot be undone. Are you sure you want to delete this
                transaction?
              </Text>

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowDeleteConfirmModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalDeleteBtn}
                  onPress={handleDelete}
                >
                  <Text style={styles.modalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showDeleteSuccessModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDeleteSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.successIconWrap}>
                <Ionicons name="checkmark" size={28} color="#16A34A" />
              </View>

              <Text style={styles.modalTitle}>Transaction Deleted</Text>
              <Text style={styles.modalSubtitle}>
                Your transaction has been deleted successfully.
              </Text>

              <TouchableOpacity
                style={styles.modalPrimaryBtnSingle}
                onPress={() => {
                  setShowDeleteSuccessModal(false);
                  navigation.goBack();
                }}
              >
                <Text style={styles.modalPrimaryText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showErrorModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowErrorModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.errorIconWrap}>
                <Ionicons name="close" size={28} color="#DC2626" />
              </View>

              <Text style={styles.modalTitle}>Something Went Wrong</Text>
              <Text style={styles.modalSubtitle}>{errorText}</Text>

              <TouchableOpacity
                style={styles.modalPrimaryBtnSingle}
                onPress={() => setShowErrorModal(false)}
              >
                <Text style={styles.modalPrimaryText}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgTop,
  },
  container: {
    padding: 18,
    paddingTop: 16,
  },

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
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
  },

  amountCard: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },
  amountLabel: {
    fontWeight: "900",
    fontSize: 12,
  },
  amountBig: {
    fontSize: 34,
    fontWeight: "900",
    marginTop: 8,
  },
  amountInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  dollar: {
    fontSize: 16,
    fontWeight: "900",
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.65)",
  },

  sectionTitle: {
    fontWeight: "900",
    marginBottom: 8,
  },

  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
  },

  categoryChip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.75)",
    marginRight: 8,
    marginBottom: 8,
  },

  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },

  categoryChipText: {
    fontWeight: "700",
    color: COLORS.text,
  },

  categoryChipTextActive: {
    color: "#fff",
  },

  notesBox: {
    borderRadius: 18,
    padding: 12,
    minHeight: 110,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.75)",
  },

  notesInput: {
    minHeight: 90,
  },

  saveBtn: {
    paddingVertical: 14,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    marginBottom: 10,
  },

  saveText: {
    color: "#fff",
    fontWeight: "900",
  },

  deleteBtn: {
    paddingVertical: 14,
    borderRadius: 22,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
  },

  deleteText: {
    color: "#DC2626",
    fontWeight: "900",
  },

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

  warningIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  successIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  deleteIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  errorIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
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

  modalDeleteBtn: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#FECACA",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  modalDeleteText: {
    fontWeight: "700",
    color: "#B91C1C",
    fontSize: 15,
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