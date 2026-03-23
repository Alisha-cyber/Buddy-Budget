import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "../screens/dashboard/DashboardScreen";
import MonthlyBreakdownScreen from "../screens/budget/MonthlyBreakdownScreen";
import RemainingBudgetScreen from "../screens/budget/RemainingBudgetScreen";
import AddTransactionScreen from "../screens/transactions/AddTransactionScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import CategoryTransactionsScreen from "../screens/transactions/CategoryTransactionsScreen";
import { COLORS } from "../constants/theme";
import AboutUsScreen from "../screens/profile/AboutUsScreen";
import ChangePasswordScreen from "../screens/profile/ChangePasswordScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="About" component={AboutUsScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DashboardHome"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MonthlyBreakdown"
        component={MonthlyBreakdownScreen}
      />

      <Stack.Screen
        name="RemainingBudget"
        component={RemainingBudgetScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CategoryTransactions"
        component={CategoryTransactionsScreen}
        options={{
          headerShown: true,
          title: "",
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#FFF7FA",
          },
          headerTintColor: "#FF4F87",
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function BudgetStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BudgetHome"
        component={RemainingBudgetScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CategoryTransactions"
        component={CategoryTransactionsScreen}
        options={{
          headerShown: true,
          title: "",
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#FFF7FA",
          },
          headerTintColor: "#FF4F87",
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        lazy: true,
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
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = "home-outline";
          } else if (route.name === "AddTransaction") {
            iconName = "add-circle-outline";
          } else if (route.name === "Budget") {
            iconName = "list-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{ tabBarLabel: "Home" }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ tabBarLabel: "Profile" }}
      />

      <Tab.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{ tabBarLabel: "Add" }}
      />

      <Tab.Screen
        name="Budget"
        component={BudgetStack}
        options={{ tabBarLabel: "Budget" }}
      />
    </Tab.Navigator>
  );
}