import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/colors";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { signInWithGoogle } from "../../services/googleAuthService";
import { loginWithGoogleToken } from "../../services/googleBackendAuthService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(email.trim(), password);
      await login(data);
    } catch (err) {
      Alert.alert("Invalid Username/Password", err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
    <LinearGradient
      colors={[COLORS.bgTop, COLORS.bgBottom]}
      style={styles.container}
    >
      <Text style={styles.title}>Welcome</Text>
      <Text style={[styles.title, styles.mb30]}>Back!</Text>
      <Text style={[styles.subtext, styles.mb30]}>
        So happy to see you again
      </Text>

      <CustomInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <CustomInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <CustomButton
        title={loading ? "Logging In..." : "Log In"}
        onPress={handleLogin}
        disabled={loading || googleLoading}
      />

      <TouchableOpacity
        style={[
          styles.googleButton,
          (loading || googleLoading) && styles.googleButtonDisabled,
        ]}
        onPress={handleGoogleLogin}
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
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
        Don’t have an account? Sign Up
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 50,
    color: COLORS.primary,
    textAlign: "center",
  },
  mb30: {
    marginBottom: 30,
  },
  subtext: {
    fontSize: 20,
    color: COLORS.primary,
    textAlign: "center",
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
  link: {
    marginTop: 20,
    textAlign: "center",
    color: COLORS.primary,
    fontWeight: "600",
  },
});