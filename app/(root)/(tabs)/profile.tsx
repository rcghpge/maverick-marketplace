import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { router } from "expo-router";

const Profile = () => {
    const { user, logout, isLoading } = useAuth();

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            router.replace("/sign-in");
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A24B0" />
            </View>
        );
    }

    if (!user) {
        router.replace("/sign-in");
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            
            <View style={styles.profileCard}>
                <View style={styles.profileInfo}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                </View>
            </View>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                
                <TouchableOpacity style={styles.menuItem}>
                    <Text>Edit Profile</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.menuItem}>
                    <Text>My Listings</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.menuItem}>
                    <Text>Saved Items</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>
                
                <TouchableOpacity style={styles.menuItem}>
                    <Text>Notifications</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.menuItem}>
                    <Text>Privacy</Text>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f8f8f8",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 40,
        marginBottom: 20,
    },
    profileCard: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    profileInfo: {
        alignItems: "center",
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: "#666",
    },
    section: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 16,
    },
    menuItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    logoutButton: {
        backgroundColor: "#FF3B30",
        borderRadius: 8,
        padding: 15,
        alignItems: "center",
        marginTop: 10,
    },
    logoutButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    }
});

export default Profile;