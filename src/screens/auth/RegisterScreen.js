import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/colors";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { registerUser } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { signInWithGoogle } from "../../services/googleAuthService";
import { loginWithGoogleToken } from "../../services/googleBackendAuthService";
export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login } = useAuth();

  const onCreate = async () => {
    if (!fullName.trim() || !email.trim() || !pw.trim() || !confirmPw.trim()) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    if (pw.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    if (pw !== confirmPw) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerUser(fullName.trim(), email.trim(), pw);

      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (err) {
      Alert.alert("Registration Failed", err?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);

      const result = await signInWithGoogle();
      if (!result?.idToken) return;

      const appUser = await loginWithGoogleToken(result.idToken);
      await login(appUser);
    } catch (err) {
      Alert.alert("Google Sign-In Failed", err?.message || "Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.bgTop, COLORS.bgBottom]}
        style={styles.bg}
      >
        <Text style={[styles.heart, { top: 32, left: 24 }]}>♡</Text>
        <Text style={[styles.heart, { top: 70, right: 28, fontSize: 14 }]}>
          ♡
        </Text>
        <Text style={[styles.heart, { bottom: 86, right: 22, fontSize: 16 }]}>
          ♡
        </Text>
        <Text style={[styles.heart, { bottom: 120, left: 26, fontSize: 13 }]}>
          ♡
        </Text>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Join our cute community ✨</Text>

            <View style={styles.formWrap}>
              <CustomInput
                icon="person-outline"
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
              />

              <CustomInput
                icon="mail-outline"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <CustomInput
                icon="lock-closed-outline"
                placeholder="Password"
                value={pw}
                onChangeText={setPw}
                secureTextEntry={!showPw}
                rightIcon={showPw ? "eye-off-outline" : "eye-outline"}
                onPressRightIcon={() => setShowPw((s) => !s)}
              />

              <CustomInput
                icon="lock-closed-outline"
                placeholder="Confirm Password"
                value={confirmPw}
                onChangeText={setConfirmPw}
                secureTextEntry={!showConfirmPw}
                rightIcon={showConfirmPw ? "eye-off-outline" : "eye-outline"}
                onPressRightIcon={() => setShowConfirmPw((s) => !s)}
              />

              <View style={styles.primaryBtnWrap}>
                <CustomButton
                  title={loading ? "Creating Account..." : "Create Account"}
                  onPress={onCreate}
                  disabled={loading || googleLoading}
                />
              </View>

              <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.or}>Or continue with</Text>
                <View style={styles.line} />
              </View>

              <TouchableOpacity
                style={[
                  styles.googleButton,
                  (loading || googleLoading) && styles.googleButtonDisabled,
                ]}
                onPress={handleGoogleSignup}
                disabled={loading || googleLoading}
                activeOpacity={0.85}
              >
                {googleLoading ? (
                  <ActivityIndicator color={COLORS.primary} />
                ) : (
                  <>
                    <Ionicons
                      name="logo-google"
                      size={18}
                      color={COLORS.primary}
                      style={styles.googleIcon}
                    />
                    <Text style={styles.googleButtonText}>
                      Continue with Google
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* <TouchableOpacity onPress={handleGoogleSignup}>
                <Text style={styles.googleButtonText}>
                  Continue with Google
                </Text>
              </TouchableOpacity> */}

              <View style={styles.bottomRow}>
                <Text style={styles.bottomText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.bottomLink}> Log In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 56,
    alignItems: "center",
  },

  title: {
    fontSize: 38,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 0.3,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 12,
    color: "#C56A95",
  },

  formWrap: {
    marginTop: 16,
    width: "100%",
  },

  primaryBtnWrap: {
    marginTop: 14,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 12,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.divider,
  },

  or: {
    marginHorizontal: 10,
    fontSize: 11,
    color: "#C56A95",
  },

  googleBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // shadowColor: COLORS.shadow,
    // shadowOpacity: 1,
    // shadowRadius: 14,
    // shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },

  googleBtnDisabled: {
    opacity: 0.7,
  },

  googleIcon: {
    marginRight: 8,
  },

  googleText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  bottomText: {
    fontSize: 11,
    color: "#8E8E93",
  },

  bottomLink: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "700",
  },

  heart: {
    position: "absolute",
    color: "#F3A9C9",
    opacity: 0.6,
    fontSize: 18,
  },
  googleButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 15,
  },
  googleButton: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#F3DEE7",
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleIcon: {
    marginRight: 8,
  },
  googleButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 15,
  },
});
