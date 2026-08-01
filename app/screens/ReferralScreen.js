import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Share, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export default function ReferralScreen() {
  const { user } = useAuth();
  const [referred, setReferred] = useState([]);

  useEffect(() => {
    api.get("/referral/list").then((r) => setReferred(r.data.referred)).catch(() => {});
  }, []);

  const share = () => {
    Share.share({
      message: `Join Sikka and earn real money! Use my referral code ${user?.referralCode} when you sign up.`,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Refer & Earn</Text>
      <View style={styles.codeBox}>
        <Text style={styles.codeLabel}>YOUR CODE</Text>
        <Text style={styles.code}>{user?.referralCode}</Text>
      </View>
      <TouchableOpacity style={styles.shareBtn} onPress={share}>
        <Text style={styles.shareText}>Share invite link</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>People you referred ({referred.length})</Text>
      <FlatList
        data={referred}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowName}>{item.name}</Text>
            <Text style={styles.rowPhone}>{item.phone}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No referrals yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1330", padding: 20, paddingTop: 50 },
  title: { fontSize: 22, fontWeight: "700", color: "#EDEEFB", marginBottom: 20 },
  codeBox: { backgroundColor: "#191F45", borderRadius: 18, padding: 20, alignItems: "center", borderWidth: 1, borderColor: "#2C3468" },
  codeLabel: { color: "#9A9FC7", fontSize: 11 },
  code: { color: "#F2B705", fontSize: 24, fontWeight: "700", marginTop: 6 },
  shareBtn: { backgroundColor: "#FF6B5E", padding: 14, borderRadius: 14, alignItems: "center", marginTop: 14, marginBottom: 26 },
  shareText: { color: "#1a0d0a", fontWeight: "700" },
  sectionTitle: { color: "#EDEEFB", fontWeight: "700", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#191F45", padding: 14, borderRadius: 12, marginBottom: 8 },
  rowName: { color: "#EDEEFB" },
  rowPhone: { color: "#9A9FC7" },
  empty: { color: "#9A9FC7", textAlign: "center", marginTop: 20 },
});
