import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from "../../constants/colors";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { registerUser } from "../../services/authService";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const onCreate = async () => {
    try {
      const data = await registerUser(fullName, email, pw);
      navigation.navigate("Login");
    } catch (err) {
      alert.alert("Registration Failed");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.bgTop, COLORS.bgBottom]}
        style={styles.bg}
      >
        {/* cute floating hearts */}
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
            <Text style={styles.subtitle}>Join our cute community! ✨</Text>

            <View style={{ marginTop: 16, width: "100%" }}>
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

              <View style={{ marginTop: 14 }}>
                <CustomButton title="Create Account" onPress={onCreate} />
              </View>

              {/* divider */}
              <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.or}>Or sign up with</Text>
                <View style={styles.line} />
              </View>

              {/* social buttons */}
              <View style={styles.socialRow}>
                <SocialIcon name="logo-google" />
                <SocialIcon name="logo-facebook" />
                <SocialIcon name="logo-apple" />
              </View>

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

function SocialIcon({ name }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.socialBtn}>
      <Icon name={name} size={18} color={COLORS.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
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
  subtitle: { marginTop: 6, fontSize: 12, color: "#C56A95" },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  line: { flex: 1, height: 1, backgroundColor: COLORS.divider },
  or: { marginHorizontal: 10, fontSize: 11, color: "#C56A95" },

  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginBottom: 14,
  },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomText: { fontSize: 11, color: "#8E8E93" },
  bottomLink: { fontSize: 11, color: COLORS.primary, fontWeight: "700" },

  heart: { position: "absolute", color: "#F3A9C9", opacity: 0.6, fontSize: 18 },
});
