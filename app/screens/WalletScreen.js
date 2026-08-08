import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react-native";

const WalletScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Wallet color="#7c5cfc" size={40} />
        <Text style={styles.title}>Wallet</Text>
      </View>

      <TouchableOpacity
        style={[styles.card, styles.depositCard]}
        onPress={() => navigation.navigate("Deposit")}
      >
        <ArrowDownCircle color="#fff" size={28} />
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.cardTitle}>Deposit</Text>
          <Text style={styles.cardSubtitle}>Add funds to your wallet</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.withdrawCard]}
        onPress={() => navigation.navigate("Withdraw")}
      >
        <ArrowUpCircle color="#fff" size={28} />
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.cardTitle}>Withdraw</Text>
          <Text style={styles.cardSubtitle}>Withdraw your earnings</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1330", padding: 20 },
  header: { alignItems: "center", marginVertical: 30 },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold", marginTop: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 14,
    marginBottom: 15,
  },
  depositCard: { backgroundColor: "#4CAF50" },
  withdrawCard: { backgroundColor: "#E53935" },
  cardTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  cardSubtitle: { color: "#fff", fontSize: 12, opacity: 0.85, marginTop: 3 },
});