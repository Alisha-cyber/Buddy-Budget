import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { changePassword } from "../../services/userService";

const PasswordInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  toggleSecure,
}) => {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.inputLabel}>{label}</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B8A8B0"
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity onPress={toggleSecure} style={styles.eyeButton}>
          <Feather
            name={secureTextEntry ? "eye-off" : "eye"}
            size={18}
            color="#9C8C94"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ChangePasswordScreen = ({ navigation }) => {
  const { user, login } = useAuth();

  const hasPassword = !!user?.hasPassword;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (hasPassword) {
      if (!oldPassword || !newPassword || !confirmPassword) {
        Alert.alert("Missing Fields", "Please fill in all password fields.");
        return;
      }
    } else {
      if (!newPassword || !confirmPassword) {
        Alert.alert("Missing Fields", "Please fill in all password fields.");
        return;
      }
    }

    if (newPassword.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const payload = hasPassword
        ? { oldPassword, newPassword }
        : { newPassword, mode: "set" };

      const response = await changePassword(user._id, payload);

      if (response?.data?.user) {
        await login(response.data.user);
      }

      Alert.alert(
        "Success",
        hasPassword
          ? "Password updated successfully!"
          : "Password set successfully!",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          (hasPassword
            ? "Failed to update password."
            : "Failed to set password.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerIconButton}
            >
              <Ionicons name="chevron-back" size={22} color="#5B4B55" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              {hasPassword ? "Change Password" : "Set Password"}
            </Text>

            <View style={{ width: 34 }} />
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.card}>
              <View style={styles.lockCircle}>
                <Ionicons name="lock-closed" size={28} color="#fff" />
              </View>

              <Text style={styles.title}>
                {hasPassword ? "Update Your Password" : "Create a Password"}
              </Text>

              <Text style={styles.subtitle}>
                {hasPassword
                  ? "Keep your BuddyBudget account secure with a strong password."
                  : "Set a password so you can also log in with email and password later."}
              </Text>

              {hasPassword && (
                <PasswordInput
                  label="Old Password"
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholder="Enter old password"
                  secureTextEntry={!showOldPassword}
                  toggleSecure={() => setShowOldPassword(!showOldPassword)}
                />
              )}

              <PasswordInput
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry={!showNewPassword}
                toggleSecure={() => setShowNewPassword(!showNewPassword)}
              />

              <PasswordInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry={!showConfirmPassword}
                toggleSecure={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleChangePassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#253046" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {hasPassword ? "Save Password" : "Set Password"}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FDEFF5",
  },

  container: {
    flex: 1,
  },

  header: {
    height: 64,
    backgroundColor: "#FFF8FB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F5DDE8",
  },

  headerIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F9E7EE",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3F2F39",
  },

  content: {
    padding: 18,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#E8B7CA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },

  lockCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F7BFD3",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#2F2730",
  },

  subtitle: {
    fontSize: 13,
    textAlign: "center",
    color: "#9D8C95",
    marginBottom: 24,
    marginTop: 6,
  },

  inputBlock: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5E4D57",
    marginBottom: 6,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7FA",
    borderWidth: 1,
    borderColor: "#F4D5E2",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#3F2F39",
  },

  eyeButton: {
    paddingLeft: 8,
  },

  saveButton: {
    backgroundColor: "#F8C9DA",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 10,
  },

  saveButtonText: {
    fontWeight: "700",
    color: "#253046",
    fontSize: 15,
  },

  cancelButton: {
    backgroundColor: "#FCECF3",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5C8D8",
  },

  cancelButtonText: {
    fontWeight: "700",
    color: "#D94C8A",
    fontSize: 15,
  },
});