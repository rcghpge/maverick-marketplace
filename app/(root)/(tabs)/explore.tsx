import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Explore = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    
    // Mock data for categories
    const categories = ["All", "Books", "Electronics", "Furniture", "Clothing", "Services"];
    
    // Mock data for listings
    const mockListings = [
        {
            id: "1",
            title: "Calculus Textbook",
            description: "Calculus: Early Transcendentals, 8th Edition. Good condition, minimal highlighting.",
            price: 45,
            category: "Books",
            seller: "John D.",
            postedDate: "2 days ago"
        },
        {
            id: "2",
            title: "HP Laptop",
            description: "HP Spectre x360, 16GB RAM, 512GB SSD, 1 year old in great condition.",
            price: 650,
            category: "Electronics",
            seller: "Sarah M.",
            postedDate: "1 day ago"
        },
        {
            id: "3",
            title: "Desk Chair",
            description: "Ergonomic desk chair, adjustable height, great for studying or working from home.",
            price: 75,
            category: "Furniture",
            seller: "Mike T.",
            postedDate: "3 days ago"
        },
        {
            id: "4",
            title: "UTA Hoodie",
            description: "Size L, worn only a few times. Official UTA merchandise.",
            price: 25,
            category: "Clothing",
            seller: "Emily K.",
            postedDate: "5 hours ago"
        },
        {
            id: "5",
            title: "Math Tutoring",
            description: "Offering tutoring for Calculus I, II, and III. Available weeknights and weekends.",
            price: 20,
            category: "Services",
            seller: "Alex R.",
            postedDate: "1 week ago"
        }
    ];
    
    // Filter listings based on search query and active category
    const filteredListings = mockListings.filter(listing => {
        const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             listing.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || listing.category === activeCategory;
        
        return matchesSearch && matchesCategory;
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore</Text>
                <Text style={styles.headerSubtitle}>Find items around UTA</Text>
            </View>
            
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for items..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                {categories.map(category => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryButton,
                            activeCategory === category && styles.activeCategoryButton
                        ]}
                        onPress={() => setActiveCategory(category)}
                    >
                        <Text
                            style={[
                                styles.categoryButtonText,
                                activeCategory === category && styles.activeCategoryButtonText
                            ]}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            
            <ScrollView style={styles.listingsContainer}>
                {filteredListings.length > 0 ? (
                    filteredListings.map(listing => (
                        <TouchableOpacity key={listing.id} style={styles.listingCard}>
                            <View style={styles.listingImagePlaceholder}>
                                <Text style={styles.listingImageText}>Image</Text>
                            </View>
                            <View style={styles.listingContent}>
                                <Text style={styles.listingTitle}>{listing.title}</Text>
                                <Text style={styles.listingPrice}>${listing.price}</Text>
                                <Text style={styles.listingDescription} numberOfLines={2}>
                                    {listing.description}
                                </Text>
                                <View style={styles.listingMeta}>
                                    <Text style={styles.listingSeller}>{listing.seller}</Text>
                                    <Text style={styles.listingDate}>{listing.postedDate}</Text>
                                </View>
                                <View style={styles.categoryTag}>
                                    <Text style={styles.categoryTagText}>{listing.category}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.noResultsContainer}>
                        <Ionicons name="search-outline" size={64} color="#ccc" />
                        <Text style={styles.noResultsText}>No items found</Text>
                        <Text style={styles.noResultsSubtext}>
                            Try adjusting your search or category filter
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    header: {
        paddingTop: 16,
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    headerSubtitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 8,
        marginHorizontal: 20,
        paddingHorizontal: 12,
        height: 48,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 48,
    },
    categoriesContainer: {
        paddingHorizontal: 16,
        marginTop: 16,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "white",
        borderRadius: 20,
        marginRight: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    activeCategoryButton: {
        backgroundColor: "#4A24B0",
    },
    categoryButtonText: {
        color: "#333",
    },
    activeCategoryButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    listingsContainer: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 16,
        paddingBottom: 20,
    },
    listingCard: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    listingImagePlaceholder: {
        width: 120,
        height: 120,
        backgroundColor: "#e0e0e0",
        justifyContent: "center",
        alignItems: "center",
    },
    listingImageText: {
        color: "#888",
    },
    listingContent: {
        flex: 1,
        padding: 12,
        position: "relative",
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 60,
    },
    listingPrice: {
        position: "absolute",
        top: 12,
        right: 12,
        fontSize: 16,
        fontWeight: "bold",
        color: "#4A24B0",
    },
    listingDescription: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
        marginBottom: 8,
    },
    listingMeta: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    listingSeller: {
        fontSize: 12,
        color: "#333",
    },
    listingDate: {
        fontSize: 12,
        color: "#999",
    },
    categoryTag: {
        position: "absolute",
        bottom: 10,
        left: 12,
        backgroundColor: "#F0EEFF",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    categoryTagText: {
        color: "#4A24B0",
        fontSize: 10,
        fontWeight: "500",
    },
    noResultsContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    noResultsText: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 16,
        color: "#333",
    },
    noResultsSubtext: {
        fontSize: 14,
        color: "#666",
        marginTop: 8,
        textAlign: "center",
    },
});

export default Explore;