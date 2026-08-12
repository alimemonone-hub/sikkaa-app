
import WalletScreen from "./screens/WalletScreen";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import WithdrawScreen from "./screens/WithdrawScreen";
import Depositscreen from "./screens/Depositscreen";
import Checkoutscreen from "./screens/Checkoutscreen";
import ReferralScreen from "./screens/ReferralScreen";
import HistoryScreen from "./screens/HistoryScreen";

const Stack = createNativeStackNavigator();

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0F1330", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#F2B705" size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Withdraw" component={WithdrawScreen} options={{ headerShown: true, title: "" }} />
          <Stack.Screen name="Checkout" component={Checkoutscreen} options={{ headerShown: true, title: "Checkout" }} />
          <Stack.Screen name="Deposit" component={Depositscreen} options={{ headerShown: true, title: "Deposit" }} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Referral" component={ReferralScreen} options={{ headerShown: true, title: "Team" }} />
          <Stack.Screen name="Wallet" component={WalletScreen} options={{ headerShown: true, title: "Wallet" }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </AuthProvider>
  );
}
