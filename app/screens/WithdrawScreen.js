import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export default function WithdrawScreen({ navigation }) {
  const { user, refreshBalance } = useAuth();
  const [method, setMethod] = useState("jazzcash");
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!amount || !accountNumber || !accountName) {
      Alert.alert("Missing info", "Fill all fields.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/withdraw", {
        amount: Number(amount),
        method,
        accountNumber,
        accountName,
      });
      await refreshBalance();
      Alert.alert("Requested", "Your withdrawal is pending approval.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert("Failed", err?.response?.data?.message || "Try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, paddingTop: 50 }}>
      <Text style={styles.title}>Withdraw</Text>
      <Text style={styles.subtitle}>Balance: Rs. {user?.balance}</Text>

      <View style={styles.methodRow}>
        {["jazzcash", "easypaisa"].map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.methodBtn, method === m && styles.methodActive]}
            onPress={() => setMethod(m)}
          >
            <Text style={{ color: method === m ? "#1a0d0a" : "#EDEEFB", fontWeight: "600" }}>
              {m === "jazzcash" ? "JazzCash" : "EasyPaisa"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Amount (Rs.)</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} placeholder="500" placeholderTextColor="#6b6f96" />

      <Text style={styles.label}>Account number</Text>
      <TextInput style={styles.input} keyboardType="phone-pad" value={accountNumber} onChangeText={setAccountNumber} placeholder="03xx xxxxxxx" placeholderTextColor="#6b6f96" />

      <Text style={styles.label}>Account holder name</Text>
      <TextInput style={styles.input} value={accountName} onChangeText={setAccountName} placeholder="Full name" placeholderTextColor="#6b6f96" />

      <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Submitting..." : "Request Withdrawal"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1330" },
  title: { fontSize: 22, fontWeight: "700", color: "#EDEEFB" },
  subtitle: { color: "#9A9FC7", marginTop: 4, marginBottom: 20 },
  methodRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  methodBtn: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: "#191F45", borderWidth: 1, borderColor: "#2C3468", alignItems: "center" },
  methodActive: { backgroundColor: "#F2B705", borderColor: "#F2B705" },
  label: { color: "#9A9FC7", fontSize: 12, marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: "#191F45", borderWidth: 1, borderColor: "#2C3468", borderRadius: 14, padding: 14, color: "#EDEEFB" },
  button: { backgroundColor: "#FF6B5E", borderRadius: 14, padding: 16, alignItems: "center", marginTop: 26 },
  buttonText: { color: "#1a0d0a", fontWeight: "700" },
});
