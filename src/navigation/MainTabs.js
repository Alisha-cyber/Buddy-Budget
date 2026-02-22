import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

import DashboardScreen from "../screens/dashboard/DashboardScreen";
import AddTransactionScreen from "../screens/transactions/AddTransactionScreen";
import TransactionsScreen from "../screens/transactions/TransactionsScreen";
// import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
    lazy: true,           // 👈 VERY IMPORTANT
    unmountOnBlur: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#999",

        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#F6CDE2",
          height: 70,
          paddingBottom: 10,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },

        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = "home-outline";
          } else if (route.name === "AddTransaction") {
            iconName = "add-circle-outline";
          } else if (route.name === "Transactions") {
            iconName = "list-outline";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: "Home" }}
      />

      <Tab.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{ tabBarLabel: "Add" }}
      />

      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{ tabBarLabel: "Transactions" }}
      />

      {/* <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      /> */}
    </Tab.Navigator>
  );
}
