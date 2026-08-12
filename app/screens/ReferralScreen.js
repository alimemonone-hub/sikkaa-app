import React, { useState, useEffect } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  Alert,
} from "react-native";
import { Award } from "lucide-react-native";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

const ReferralScreen = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    referralCount: 0,
    todayCommission: 0,
    totalIncome: 0,
  });

  useEffect(() => {
    const fetchReferralStats = async () => {
      try {
        const res = await client.get("/referral/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load referral stats:", err);
      }
    };
    fetchReferralStats();
  }, []);

  const copyCode = () => {
    Clipboard.setString(user?.referralCode || "");
    Alert.alert("Copied", "Referral code copied to clipboard");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Team</Text>

        {/* Levels */}
        <View style={styles.levelsCard}>
          <View style={styles.levelsRow}>
            <View style={styles.levelItem}>
              <Award color="#4FC3F7" size={40} />
              <Text style={styles.levelText}>LV1  35%</Text>
            </View>
            <View style={styles.levelItem}>
              <Award color="#66BB6A" size={40} />
              <Text style={styles.levelText}>LV2  3%</Text>
            </View>
            <View style={styles.levelItem}>
              <Award color="#FFA726" size={40} />
              <Text style={styles.levelText}>LV3  1%</Text>
            </View>
          </View>

          {/* Stats box */}
          <View style={styles.statsBox}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Referral Number</Text>
              <Text style={styles.statValue}>{stats.referralCount}/12</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Today commission</Text>
              <Text style={styles.statValue}>Rs{stats.todayCommission}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Income</Text>
              <Text style={styles.statValueHighlight}>Rs{stats.totalIncome}</Text>
            </View>
          </View>
        </View>

        {/* Explanation */}
        <Text style={styles.infoText}>
          If you invite A to invest successfully, you will get a reward of 35% of A's total investment.
        </Text>
        <Text style={styles.infoText}>A invites B, you will get 3% of B's total investment</Text>
        <Text style={styles.infoText}>B invites C, you will get 1% of C's total investment</Text>

        {/* Invitation code */}
        <View style={styles.codeRow}>
          <Text style={styles.codeText}>
            Invitation code: {user?.referralCode}
          </Text>
          <TouchableOpacity style={styles.copyButton} onPress={copyCode}>
            <Text style={styles.copyButtonText}>Copy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReferralScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1330" },
  scrollContent: { padding: 20 },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  levelsCard: { backgroundColor: "#1A1F3D", borderRadius: 16, padding: 20 },
  levelsRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  levelItem: { alignItems: "center" },
  levelText: { color: "#fff", fontWeight: "bold", marginTop: 8 },
  statsBox: { backgroundColor: "#fff", borderRadius: 12, padding: 15 },
  statRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  statLabel: { color: "#555", fontSize: 14 },
  statValue: { color: "#333", fontSize: 14, fontWeight: "600" },
  statValueHighlight: { color: "#4CAF50", fontSize: 18, fontWeight: "bold" },
  infoText: { color: "#aaa", fontSize: 13, marginTop: 12, lineHeight: 20 },
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    backgroundColor: "#1A1F3D",
    padding: 15,
    borderRadius: 12,
  },
  codeText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  copyButton: { backgroundColor: "#4FC3F7", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  copyButtonText: { color: "#fff", fontWeight: "bold" },
});