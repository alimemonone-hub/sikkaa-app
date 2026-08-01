import React, { useState, useCallback } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  RefreshControl, Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const P = "#7C5CFC";       // primary purple
const P_DARK = "#5B3FE0";
const BG = "#0E0B1A";
const CARD = "#191531";
const TEXT = "#F2F0FA";
const DIM = "#9C97B8";
const GREEN = "#3ECF8E";

function StatPill({ emoji, bg, label, value }) {
  return (
    <View style={styles.statCol}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <Text style={{ fontSize: 18 }}>{emoji}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>Rs. {value}</Text>
    </View>
  );
}

function EarnRow({ emoji, bg, title, subtitle, reward, onPress }) {
  return (
    <TouchableOpacity style={styles.earnRow} onPress={onPress}>
      <View style={[styles.earnIcon, { backgroundColor: bg }]}>
        <Text style={{ fontSize: 18 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.earnTitle}>{title}</Text>
        <Text style={styles.earnSub}>{subtitle}</Text>
      </View>
      <View style={styles.earnBadge}>
        <Text style={styles.earnBadgeText}>{reward}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const { user, refreshBalance } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try { await refreshBalance(); } catch (e) {}
    setRefreshing(false);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const earn = async (type, amount) => {
    setBusy(true);
    try {
      await api.post("/wallet/earn", { type, amount });
      await refreshBalance();
      Alert.alert("Nice!", `Rs. ${amount} added to your balance.`);
    } catch (err) {
      Alert.alert("Couldn't add earning", err?.response?.data?.message || "Try again later");
    } finally { setBusy(false); }
  };

  const watchAd = () =>
    Alert.alert("Ad simulation", "In the real app, a rewarded ad plays here.", [
      { text: "Cancel", style: "cancel" },
      { text: "Simulate finished ad", onPress: () => earn("ad", 3) },
    ]);

  const doTask = () =>
    Alert.alert("Task simulation", "In the real app, an offerwall task opens here.", [
      { text: "Cancel", style: "cancel" },
      { text: "Simulate task done", onPress: () => earn("task", 20) },
    ]);

  if (!user) return null;

  const bars = [10, 22, 16, 30, 24, 40, 34, 50]; // fake mini bar chart heights

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 18, paddingTop: 55, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} tintColor={P} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name?.[0]?.toUpperCase() || "U"}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.hi}>Hi, {user.name?.split(" ")[0]} 👋</Text>
          <Text style={styles.hiSub}>Keep using the app & earn more!</Text>
        </View>
        <Text style={{ fontSize: 20 }}>🔔</Text>
      </View>

      {/* Balance card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceTopRow}>
          <View>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>Rs. {user.balance}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.balanceLabel}>Referral code</Text>
            <Text style={styles.monthAmount}>{user.referralCode}</Text>
          </View>
        </View>

        <View style={styles.chartRow}>
          {bars.map((h, i) => (
            <View key={i} style={[styles.bar, { height: h, opacity: 0.35 + (i / bars.length) * 0.65 }]} />
          ))}
        </View>

        <View style={styles.balanceBtnRow}>
          <TouchableOpacity style={styles.withdrawBtn} onPress={() => navigation.navigate("Withdraw")}>
            <Text style={styles.withdrawText}>💳  Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate("History")}>
            <Text style={styles.historyText}>🕘  History</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsCard}>
        <StatPill emoji="🎬" bg="rgba(124,92,252,0.18)" label="Ads Earning" value="7.25" />
        <StatPill emoji="🏆" bg="rgba(255,167,38,0.18)" label="Tasks Earning" value="3.10" />
        <StatPill emoji="🤝" bg="rgba(62,207,142,0.18)" label="Referrals" value="2.10" />
        <StatPill emoji="🎁" bg="rgba(255,92,141,0.18)" label="Bonus" value="0.00" />
      </View>

      {/* Earn more */}
      <View style={styles.sectionHeadRow}>
        <Text style={styles.sectionTitle}>Earn More</Text>
        <Text style={styles.seeAll}>See All ›</Text>
      </View>

      <EarnRow emoji="📢" bg="rgba(124,92,252,0.18)" title="Watch Ads" subtitle="Watch short ads & earn money" reward="Rs. 3 / Ad" onPress={watchAd} />
      <EarnRow emoji="📋" bg="rgba(62,207,142,0.18)" title="Daily Tasks" subtitle="Complete simple tasks" reward="Up to Rs. 20" onPress={doTask} />
      <EarnRow emoji="👥" bg="rgba(255,167,38,0.18)" title="Invite & Earn" subtitle="Invite friends & earn more" reward="Rs. 20 / Invite" onPress={() => navigation.navigate("Refer")} />
      <EarnRow emoji="📄" bg="rgba(92,167,255,0.18)" title="History" subtitle="Your full earnings log" reward="View" onPress={() => navigation.navigate("History")} />

      {/* Boost banner */}
      <View style={styles.boostCard}>
        <Text style={{ fontSize: 30 }}>👛</Text>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.boostTitle}>Extra Earning Boost! 🚀</Text>
          <Text style={styles.boostSub}>Watch more ads daily and unlock bonus rewards!</Text>
          <TouchableOpacity style={styles.boostBtn} onPress={watchAd}>
            <Text style={styles.boostBtnText}>Watch Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: P, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  hi: { color: TEXT, fontSize: 16, fontWeight: "700" },
  hiSub: { color: DIM, fontSize: 12, marginTop: 2 },

  balanceCard: { backgroundColor: P, borderRadius: 22, padding: 20, marginBottom: 16 },
  balanceTopRow: { flexDirection: "row", justifyContent: "space-between" },
  balanceLabel: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
  balanceAmount: { color: "#fff", fontSize: 30, fontWeight: "700", marginTop: 4 },
  monthAmount: { color: "#fff", fontSize: 14, fontWeight: "700", marginTop: 4 },

  chartRow: { flexDirection: "row", alignItems: "flex-end", gap: 6, height: 50, marginVertical: 16 },
  bar: { width: 10, backgroundColor: "#fff", borderRadius: 4 },

  balanceBtnRow: { flexDirection: "row", gap: 10 },
  withdrawBtn: { flex: 1, backgroundColor: "#fff", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  withdrawText: { color: P_DARK, fontWeight: "700", fontSize: 13.5 },
  historyBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.6)" },
  historyText: { color: "#fff", fontWeight: "700", fontSize: 13.5 },

  statsCard: { flexDirection: "row", justifyContent: "space-between", backgroundColor: CARD, borderRadius: 18, padding: 16, marginBottom: 22 },
  statCol: { alignItems: "center", flex: 1 },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  statLabel: { color: DIM, fontSize: 10.5, textAlign: "center" },
  statValue: { color: TEXT, fontSize: 13, fontWeight: "700", marginTop: 2 },

  sectionHeadRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { color: TEXT, fontSize: 16, fontWeight: "700" },
  seeAll: { color: P, fontSize: 12.5, fontWeight: "600" },

  earnRow: { flexDirection: "row", alignItems: "center", backgroundColor: CARD, borderRadius: 16, padding: 14, marginBottom: 10 },
  earnIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  earnTitle: { color: TEXT, fontWeight: "600", fontSize: 14 },
  earnSub: { color: DIM, fontSize: 11.5, marginTop: 2 },
  earnBadge: { backgroundColor: "rgba(124,92,252,0.15)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, marginRight: 6 },
  earnBadgeText: { color: P, fontSize: 11, fontWeight: "700" },
  chevron: { color: DIM, fontSize: 18 },

  boostCard: { flexDirection: "row", backgroundColor: CARD, borderRadius: 18, padding: 18, marginTop: 8, alignItems: "center" },
  boostTitle: { color: TEXT, fontWeight: "700", fontSize: 14.5 },
  boostSub: { color: DIM, fontSize: 12, marginTop: 4, marginBottom: 10 },
  boostBtn: { backgroundColor: P, borderRadius: 10, paddingVertical: 9, alignItems: "center", alignSelf: "flex-start", paddingHorizontal: 16 },
  boostBtnText: { color: "#fff", fontWeight: "700", fontSize: 12.5 },
});