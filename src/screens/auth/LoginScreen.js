import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      login(data);
    } catch (err) {
      Alert.alert("Login Failed");
      Alert.alert("Login Failed", err.message);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.bgTop, COLORS.bgBottom]}
      style={styles.container}
    >
      <Text style={styles.title}>Welcome</Text>
      <Text style={[styles.title, styles.mb30]}>Back !</Text>
      <Text style={[styles.subtext, styles.mb30]}>
        so happy to see you again{" "}
      </Text>

      <CustomInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <CustomInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <CustomButton title="Log In" onPress={handleLogin} />

      <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
        Don’t have an account? Sign Up
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
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
  link: {
    marginTop: 20,
    textAlign: "center",
    color: COLORS.primary,
    fontWeight: "600",
  },
});
