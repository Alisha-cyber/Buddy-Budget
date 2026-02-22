import React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { BudgetProvider } from "./src/context/BudgetContext";
import { TransactionProvider } from "./src/context/TransactionContext";
import { CategoryProvider } from "./src/context/CategoryContext";
import { InsightProvider } from "./src/context/InsightContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CategoryProvider>
          <BudgetProvider>
            <TransactionProvider>
              <InsightProvider>
                <RootNavigator />
              </InsightProvider>
            </TransactionProvider>
          </BudgetProvider>
        </CategoryProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
