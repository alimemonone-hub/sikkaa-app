import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !phone || !password) {
      Alert.alert("Missing info", "Name, phone and password are required.");
      return;
    }
    setLoading(true);
    try {
      await register(name, phone, password, referralCode);
    } catch (err) {
      Alert.alert("Registration failed", err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Start earning in a couple of minutes</Text>

        <Text style={styles.label}>Full name</Text>
        <TextInput
          style={styles.input}
          placeholder="Ali Memon"
          placeholderTextColor="#6b6f96"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.input}
          placeholder="03xx xxxxxxx"
          placeholderTextColor="#6b6f96"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#6b6f96"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Referral code (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="SIKKA-XXXXX"
          placeholderTextColor="#6b6f96"
          autoCapitalize="characters"
          value={referralCode}
          onChangeText={setReferralCode}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Creating..." : "Create Account"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1330" },
  title: { fontSize: 24, fontWeight: "700", color: "#EDEEFB" },
  subtitle: { color: "#9A9FC7", fontSize: 13, marginTop: 4, marginBottom: 20 },
  label: { color: "#9A9FC7", fontSize: 12, marginTop: 14, marginBottom: 6 },
  input: {
    backgroundColor: "#191F45",
    borderWidth: 1,
    borderColor: "#2C3468",
    borderRadius: 14,
    padding: 14,
    color: "#EDEEFB",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#FF6B5E",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 26,
  },
  buttonText: { color: "#1a0d0a", fontWeight: "700", fontSize: 15 },
  link: { color: "#F2B705", textAlign: "center", marginTop: 20, fontSize: 13 },
});
