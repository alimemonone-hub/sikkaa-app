import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { ShoppingBag } from "lucide-react-native";
import client from "../api/client";

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await client.get("/products");
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <ShoppingBag color="#aaa" size={32} />
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.productDesc} numberOfLines={2}>{item.description}</Text>
        ) : null}
        <Text style={styles.price}>Rs. {item.price}</Text>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => navigation.navigate("Checkout", { product: item })}
        >
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={{ color: "#888" }}>No products available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  listContent: { padding: 15 },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
  },
  image: { width: 100, height: 100 },
  imagePlaceholder: { justifyContent: "center", alignItems: "center", backgroundColor: "#eee" },
  cardContent: { flex: 1, padding: 12, justifyContent: "center" },
  productName: { fontSize: 16, fontWeight: "bold", color: "#222" },
  productDesc: { fontSize: 12, color: "#777", marginTop: 3 },
  price: { fontSize: 15, fontWeight: "700", color: "#4CAF50", marginTop: 6 },
  buyButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buyButtonText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
});