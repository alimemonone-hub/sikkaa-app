import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Wallet, Smartphone, Hash, CheckCircle } from "lucide-react-native";
import client from "../api/client"; // tumhara existing axios/api client

const DepositScreen = () => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("jazzcash"); // jazzcash | easypaisa
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);

  const YOUR_NUMBER = "03182181269"; // 👈 tumhara JazzCash/EasyPaisa number
  const YOUR_NAME = "Shazia Hassan Ali";

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (!senderNumber || !transactionId) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await client.post("/deposit/request", {
        amount: Number(amount),
        method,
        senderNumber,
        transactionId,
      });
      Alert.alert("Success", res.data.message || "Deposit request submitted");
      setAmount("");
      setSenderNumber("");
      setTransactionId("");
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Deposit Funds</Text>

        {/* Instructions box */}
        <View style={styles.infoBox}>
          <Wallet color="#4CAF50" size={22} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.infoText}>
              Send money to this {method === "jazzcash" ? "JazzCash" : "EasyPaisa"} number:
            </Text>
            <Text style={styles.numberText}>{YOUR_NUMBER}</Text>
            <Text style={styles.nameText}>Account Name: {YOUR_NAME}</Text>
          </View>
        </View>

        {/* Method selector */}
        <Text style={styles.label}>Select Method</Text>
        <View style={styles.methodRow}>
          <TouchableOpacity
            style={[
              styles.methodButton,
              method === "jazzcash" && styles.methodButtonActive,
            ]}
            onPress={() => setMethod("jazzcash")}
          >
            <Text
              style={[
                styles.methodText,
                method === "jazzcash" && styles.methodTextActive,
              ]}
            >
              JazzCash
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.methodButton,
              method === "easypaisa" && styles.methodButtonActive,
            ]}
            onPress={() => setMethod("easypaisa")}
          >
            <Text
              style={[
                styles.methodText,
                method === "easypaisa" && styles.methodTextActive,
              ]}
            >
              EasyPaisa
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <Text style={styles.label}>Amount (Rs.)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Sender Number */}
        <Text style={styles.label}>Your {method === "jazzcash" ? "JazzCash" : "EasyPaisa"} Number</Text>
        <View style={styles.inputRow}>
          <Smartphone color="#666" size={20} />
          <TextInput
            style={styles.inputFlex}
            placeholder="03xxxxxxxxx"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={senderNumber}
            onChangeText={setSenderNumber}
          />
        </View>

        {/* Transaction ID */}
        <Text style={styles.label}>Transaction ID (TID)</Text>
        <View style={styles.inputRow}>
          <Hash color="#666" size={20} />
          <TextInput
            style={styles.inputFlex}
            placeholder="Enter transaction ID"
            placeholderTextColor="#999"
            value={transactionId}
            onChangeText={setTransactionId}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <CheckCircle color="#fff" size={20} />
          <Text style={styles.submitText}>
            {loading ? "Submitting..." : "Submit Deposit Request"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Your deposit will be reviewed and approved within a few hours.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DepositScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  infoText: { fontSize: 13, color: "#333" },
  numberText: { fontSize: 18, fontWeight: "bold", color: "#2E7D32", marginTop: 4 },
  nameText: { fontSize: 13, color: "#555", marginTop: 2 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, marginTop: 12, color: "#333" },
  methodRow: { flexDirection: "row", gap: 10 },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
  },
  methodButtonActive: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  methodText: { color: "#333", fontWeight: "600" },
  methodTextActive: { color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  inputFlex: { flex: 1, paddingVertical: 12, marginLeft: 8, fontSize: 15 },
  submitButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    gap: 8,
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  note: { textAlign: "center", color: "#888", fontSize: 12, marginTop: 15 },
});