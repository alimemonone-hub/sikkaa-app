import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Smartphone, Hash, CheckCircle } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
        <Text style={styles.title}>     Checkout</Text>

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
        <Text style={styles.label}>   Select Payment Method</Text>
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
        <Text style={styles.label}>   Your {method === "jazzcash" ? "JazzCash" : "EasyPaisa"} Number</Text>
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
        <Text style={styles.label}>    Transaction ID (TID)</Text>
        <View style={styles.inputRow}>
          <Hash color="#666" size={20} />
          <TextInput
            style={styles.inputFlex}
            placeholder=    "Enter transaction ID"
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
  container: { flex: 1, backgroundColor: "#0f0c1b" },
  scrollContent: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#fff" },
  productBox: {
    backgroundColor: "#1a1625",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  productName: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  productPrice: { fontSize: 18, color: "#4ade80", fontWeight: "700", marginTop: 4 },
  infoBox: {
    backgroundColor: "#16251c",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: { fontSize: 13, color: "#c7c7d1" },
  numberText: { fontSize: 18, fontWeight: "bold", color: "#4ade80", marginTop: 4 },
  nameText: { fontSize: 13, color: "#a1a1aa", marginTop: 2 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, marginTop: 12, color: "#fff" },
  methodRow: { flexDirection: "row", gap: 10 },
  methodButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2d254d",
    backgroundColor: "#1a1625",
    alignItems: "center",
  },
  methodButtonActive: {
    backgroundColor: "#4ade80",
    borderColor: "#4ade80",
  },
  methodText: { color: "#a1a1aa", fontWeight: "600" },
  methodTextActive: { color: "#0f0c1b", fontWeight: "700" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2d254d",
    backgroundColor: "#1a1625",
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  inputFlex: {
    flex: 1,
    paddingVertical: 12,
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#4ade80",
    borderRadius: 10,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  submitText: { color: "#0f0c1b", fontSize: 16, fontWeight: "700" },
  note: { fontSize: 12, color: "#a1a1aa", textAlign: "center", marginTop: 12 },
});