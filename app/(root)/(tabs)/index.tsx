import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Maverick'}</Text>
        <Text style={styles.title}>Maverick Marketplace</Text>
      </View>

      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Items</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredList}>
          {[1, 2, 3, 4].map((item) => (
            <TouchableOpacity key={item} style={styles.featuredItem}>
              <View style={styles.featuredImage}>
                <Text style={styles.featuredImageText}>Image {item}</Text>
              </View>
              <Text style={styles.featuredItemTitle}>Featured Item {item}</Text>
              <Text style={styles.featuredItemPrice}>$25.00</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {['Books', 'Electronics', 'Furniture', 'Clothing', 'Services', 'More'].map((category) => (
            <TouchableOpacity key={category} style={styles.categoryItem}>
              <Ionicons 
                name={
                  category === 'Books' ? 'book-outline' :
                  category === 'Electronics' ? 'laptop-outline' :
                  category === 'Furniture' ? 'bed-outline' :
                  category === 'Clothing' ? 'shirt-outline' :
                  category === 'Services' ? 'construct-outline' : 'grid-outline'
                } 
                size={24} 
                color="#4A24B0" 
              />
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Listings</Text>
        {[1, 2, 3].map((item) => (
          <TouchableOpacity key={item} style={styles.recentItem}>
            <View style={styles.recentImage}>
              <Text style={styles.recentImageText}>Image</Text>
            </View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentTitle}>Item {item}</Text>
              <Text style={styles.recentDescription}>
                This is a description of the item that is for sale.
              </Text>
              <Text style={styles.recentPrice}>$20.00</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#4A24B0",
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginTop: 4,
  },
  featuredSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  featuredList: {
    marginLeft: -10,
  },
  featuredItem: {
    width: 150,
    marginHorizontal: 10,
  },
  featuredImage: {
    height: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  featuredImageText: {
    color: "#666",
  },
  featuredItemTitle: {
    marginTop: 8,
    fontWeight: "600",
  },
  featuredItemPrice: {
    marginTop: 4,
    color: "#4A24B0",
    fontWeight: "bold",
  },
  categoriesSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "30%",
    height: 80,
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
  },
  recentSection: {
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  recentItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentImage: {
    width: 100,
    height: 100,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  recentImageText: {
    color: "#666",
  },
  recentInfo: {
    flex: 1,
    padding: 15,
  },
  recentTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  recentDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 8,
  },
  recentPrice: {
    color: "#4A24B0",
    fontWeight: "bold",
  },
});