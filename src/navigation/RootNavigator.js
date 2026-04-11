import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import { useAuth } from "../hooks/useAuth";
import { registerForPushNotifications } from "../services/pushTokenService";

export default function RootNavigator() {
  const { user, authLoading } = useAuth();

  useEffect(() => {
    const setupPush = async () => {
      if (user?._id && user?.notificationsEnabled) {
        await registerForPushNotifications(user._id);
      }
    };

    setupPush();
  }, [user?._id, user?.notificationsEnabled]);

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF4FA3" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}