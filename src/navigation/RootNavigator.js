import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import { useAuth } from "../hooks/useAuth";
import { View, ActivityIndicator } from "react-native";

export default function RootNavigator() {
  const { user, authLoading } = useAuth();

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