import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to restore a saved session on app start
    (async () => {
      const token = await AsyncStorage.getItem("token");
      const savedUser = await AsyncStorage.getItem("user");
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    })();
  }, []);

  const login = async (phone, password) => {
    const { data } = await api.post("/auth/login", { phone, password });
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (name, phone, password, referralCode) => {
    const { data } = await api.post("/auth/register", {
      name,
      phone,
      password,
      referralCode: referralCode || undefined,
    });
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  const refreshBalance = async () => {
    const { data } = await api.get("/wallet/balance");
    setUser((prev) => {
      const updated = { ...prev, balance: data.balance };
      AsyncStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshBalance, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
