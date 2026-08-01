import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import api from "../api/client";

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get("/wallet/history").then((r) => setTransactions(r.data.transactions)).catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <FlatList
        data={transactions}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.note}>{item.note}</Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.amount, { color: item.amount >= 0 ? "#33D6A6" : "#FF6B5E" }]}>
              {item.amount >= 0 ? "+" : ""}Rs. {item.amount}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No activity yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1330", padding: 20, paddingTop: 50 },
  title: { fontSize: 22, fontWeight: "700", color: "#EDEEFB", marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#191F45", padding: 14, borderRadius: 12, marginBottom: 8 },
  note: { color: "#EDEEFB", fontSize: 13.5 },
  date: { color: "#9A9FC7", fontSize: 11, marginTop: 2 },
  amount: { fontWeight: "700" },
  empty: { color: "#9A9FC7", textAlign: "center", marginTop: 20 },
});
