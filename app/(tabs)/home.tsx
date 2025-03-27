import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { account } from '../../appwrite/config';
import { Alert } from 'react-native';

export default function HomeScreen() {
  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      // Use the correct route format
      router.replace('../(auth)');
    } catch (error) {
      Alert.alert('Logout Failed', 'Could not log out');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Maverick Marketplace</Text>
      
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});