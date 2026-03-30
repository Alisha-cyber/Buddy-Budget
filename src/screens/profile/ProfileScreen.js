import React, { useState, useEffect } from "react";
import {
  Alert,
  Linking,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";

import { useAuth } from "../../hooks/useAuth";
import {
  getUserProfile,
  updateUserProfile,
  updateNotification,
} from "../../services/userService";

const ProfileScreen = ({ navigation }) => {
  const { user, logout, login } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.notificationsEnabled ?? false
  );

  const [currencyMenuVisible, setCurrencyMenuVisible] = useState(false);
  const [currency, setCurrency] = useState(user?.currency || "CAD");

  const profileImageUri =
    user?.profilePicture && user.profilePicture.trim() !== ""
      ? user.profilePicture
      : null;

  const fallbackInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() ||
    user?.email?.trim()?.charAt(0)?.toUpperCase() ||
    "B";

  const openSupportEmail = async () => {
    const email = "support@buddybudget.com";
    const subject = "BuddyBudget Support";
    const body = "Hi BuddyBudget team,\n\nI need help with:\n\n\nRegards,";

    const mailtoUrl =
      `mailto:${email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    try {
      const supported = await Linking.canOpenURL(mailtoUrl);

      if (supported) {
        await Linking.openURL(mailtoUrl);
        return;
      }

      Alert.alert(
        "No Email App Found",
        "We couldn't find an email app on this device. You can still contact support at support@buddybudget.com.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open Gmail",
            onPress: async () => {
              try {
                await Linking.openURL("https://mail.google.com");
              } catch {
                Alert.alert(
                  "Unable to Open",
                  "Please email us manually at support@buddybudget.com."
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Something Went Wrong",
        "Please email us manually at support@buddybudget.com."
      );
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile(user._id);
        login(profile);
        setNotificationsEnabled(profile.notificationsEnabled);
        setCurrency(profile.currency || "CAD");
      } catch (error) {
        console.log("Profile load error", error);
      }
    };

    if (user?._id) {
      loadProfile();
    }
  }, []);

  const handleToggleNotifications = async (value) => {
    try {
      setNotificationsEnabled(value);

      await updateNotification(user._id, {
        notificationsEnabled: value,
      });

      const updated = await getUserProfile(user._id);
      login(updated);
    } catch (error) {
      console.log("Notification update failed", error);
    }
  };

  const handleCurrencyChange = async (value) => {
    try {
      setCurrency(value);
      setCurrencyMenuVisible(false);

      const updatedUser = await updateUserProfile(user._id, {
        currency: value,
      });

      login(updatedUser);
    } catch (error) {
      console.log("Currency update failed", error);
    }
  };

  const settingsData = [
    {
      id: 1,
      title: "Currency",
      subtitle: currency,
      icon: (
        <View style={[styles.iconCircle, { backgroundColor: "#DDF5E5" }]}>
          <Text style={[styles.iconText, { color: "#22A45D" }]}>$</Text>
        </View>
      ),
      right: <Feather name="chevron-down" size={18} color="#A6A6A6" />,
      onPress: () => setCurrencyMenuVisible(true),
    },

    {
      id: 2,
      title: "Notifications",
      subtitle: "Get spending alerts",
      icon: (
        <View style={[styles.iconCircle, { backgroundColor: "#F2E8FF" }]}>
          <Ionicons name="notifications-outline" size={20} color="#A855F7" />
        </View>
      ),
      right: (
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
          trackColor={{ false: "#E5E5E5", true: "#F49AC2" }}
        />
      ),
    },

    {
      id: 3,
      title: "Help & Support",
      subtitle: "Get help with your account",
      icon: (
        <View style={[styles.iconCircle, { backgroundColor: "#E5F0FF" }]}>
          <AntDesign name="questioncircleo" size={18} color="#3B82F6" />
        </View>
      ),
      right: <Feather name="chevron-right" size={20} color="#A6A6A6" />,
      onPress: openSupportEmail,
    },

    {
      id: 4,
      title: "About",
      subtitle: "Buddy Budget v1.0",
      icon: (
        <View style={[styles.iconCircle, { backgroundColor: "#FFF6CC" }]}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#D4A017"
          />
        </View>
      ),
      right: <Feather name="chevron-right" size={20} color="#A6A6A6" />,
      onPress: () => navigation.navigate("About"),
    },

    {
      id: 5,
      title: "Logout",
      subtitle: "See you soon",
      icon: (
        <View style={[styles.iconCircle, { backgroundColor: "#FFE5E5" }]}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </View>
      ),
      right: <Feather name="chevron-right" size={20} color="#A6A6A6" />,
      onPress: logout,
    },
  ];

  const renderSettingItem = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingCard}
        onPress={item.onPress}
        activeOpacity={0.8}
      >
        <View style={styles.settingLeft}>
          {item.icon}

          <View>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
        </View>

        <View>{item.right}</View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              {profileImageUri ? (
                <Image
                  source={{ uri: profileImageUri }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarInitial}>{fallbackInitial}</Text>
                </View>
              )}

              <View style={styles.onlineDot} />
            </View>

            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <Text style={styles.changePasswordText}>
                {user?.hasPassword ? "Change Password" : "Set Password"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Settings</Text>

          {settingsData.map(renderSettingItem)}
        </ScrollView>

        {currencyMenuVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              {["USD", "CAD", "EUR", "INR"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.currencyItem}
                  onPress={() => handleCurrencyChange(item)}
                >
                  <Text style={styles.currencyText}>{item}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setCurrencyMenuVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FDEFF5",
  },

  container: {
    flex: 1,
    backgroundColor: "#FDEFF5",
  },

  header: {
    height: 64,
    backgroundColor: "#FFF8FB",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F5DDE8",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },

  scrollContent: {
    padding: 14,
    paddingBottom: 30,
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
    shadowColor: "#E5B7C9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },

  avatarWrapper: {
    position: "relative",
    marginBottom: 14,
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#F9C8DA",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: 78,
    height: 78,
    borderRadius: 39,
  },

  avatarInitial: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  onlineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    position: "absolute",
    right: 1,
    bottom: 4,
  },

  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  userEmail: {
    fontSize: 13,
    color: "#8B95A7",
    marginBottom: 16,
  },

  editButton: {
    width: "100%",
    backgroundColor: "#F8C9DA",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  editButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#253046",
  },

  changePasswordButton: {
    width: "100%",
    backgroundColor: "#FCE7F3",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5BDD2",
  },

  changePasswordText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DB2777",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
    marginBottom: 10,
    marginLeft: 4,
  },

  settingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  iconText: {
    fontSize: 18,
    fontWeight: "700",
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },

  settingSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "70%",
    backgroundColor: "#FFF",
    borderRadius: 14,
  },

  currencyItem: {
    paddingVertical: 14,
    alignItems: "center",
  },

  currencyText: {
    fontSize: 16,
    fontWeight: "600",
  },

  cancelBtn: {
    borderTopWidth: 1,
    borderColor: "#EEE",
    paddingVertical: 14,
    alignItems: "center",
  },

  cancelText: {
    fontSize: 15,
    color: "#FF4FA3",
  },
});