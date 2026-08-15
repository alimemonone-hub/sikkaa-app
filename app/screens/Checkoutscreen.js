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
import { Smartphone, Hash, CheckCircle } from "lucide-react-native";
import client from "../api/client";

const CheckoutScreen = ({ route, navigation }) => {
  const { product } = route.params;

  const [method, setMethod] = useState("jazzcash");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);

  const YOUR_NUMBER = "03182181269"; // tumhara JazzCash/EasyPaisa number
  const YOUR_NAME = "Shazia Hassan Ali";

  const handleSubmit = async () => {
    if (!senderNumber || !transactionId) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await client.post("/orders/request", {
        productId: product._id,
        method,
        senderNumber,
        transactionId,
      });
      Alert.alert("Success", res.data.message || "Order submitted", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentcontainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Checkout</Text>

        {/* Product summary */}
        <View style={styles.productBox}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>Rs. {product.price}</Text>
        </View>

        {/* Payment info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Send Rs. {product.price} to this {method === "jazzcash" ? "JazzCash" : "EasyPaisa"} number:
          </Text>
          <Text style={styles.numberText}>{YOUR_NUMBER}</Text>
          <Text style={styles.nameText}>Account Name: {YOUR_NAME}</Text>
        </View>

        {/* Method selector */}
        <Text style={styles.label}>Select Payment Method</Text>
        <View style={styles.methodRow}>
          <TouchableOpacity
            style={[styles.methodButton, method === "jazzcash" && styles.methodButtonActive]}
            onPress={() => setMethod("jazzcash")}
          >
            <Text style={[styles.methodText, method === "jazzcash" && styles.methodTextActive]}>
              JazzCash
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.methodButton, method === "easypaisa" && styles.methodButtonActive]}
            onPress={() => setMethod("easypaisa")}
          >
            <Text style={[styles.methodText, method === "easypaisa" && styles.methodTextActive]}>
              EasyPaisa
            </Text>
          </TouchableOpacity>
        </View>

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

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          <CheckCircle color="#fff" size={20} />
          <Text style={styles.submitText}>
            {loading ? "Submitting..." : "Confirm Order"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Your order will be confirmed after payment verification.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  productBox: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  productName: { fontSize: 16, fontWeight: "bold" },
  productPrice: { fontSize: 18, color: "#4CAF50", fontWeight: "700", marginTop: 4 },
  infoBox: {
    backgroundColor: "#E8F5E9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
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