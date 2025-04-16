import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, Modal, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ID } from 'react-native-appwrite';
import {
    account,
    databases, 
    storage, 
    DATABASE_ID, 
    LISTINGS_COLLECTION_ID,
    IMAGES_COLLECTION_ID,
    IMAGES_BUCKET_ID 
} from '../../appwrite/config';

export default function ListingForm({ navigation: externalNavigation }){
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [location, setLocation] = useState('');
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [showImageSourceDialog, setShowImageSourceDialog] = useState(false);

    const categories = [
        'Electronics',
        'Textbooks',
        'Furniture',
        'Clothing',
        'Sports Equipment',
        'Home Appliances',
        'School Supplies',
        'Other'
    ];

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await account.getSession('current');
                if (session) {
                    const user = await account.get();
                    setCurrentUser(user);
                }
            } catch (error) {
                console.log('No active session found');
            } finally {
                setIsLoading(false);
            }
        };
        
        checkSession();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
            </View>
        );
    }

    if (!currentUser) {
        return (
            <View style={styles.containerCenter}>
                <Text style={styles.message}>Please log in to create a listing</Text>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
            </View>
        );       
    }

    const requestPermissions = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
            Alert.alert(
                'Permissions Required',
                'We need camera and photo library permissions to upload images',
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    const pickImageFromGallery = async () => {
        setShowImageSourceDialog(false);
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                setImages([...images, result.assets[0]]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image from gallery');
        }
    };

    const takePhotoWithCamera = async () => {
        setShowImageSourceDialog(false);
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                setImages([...images, result.assets[0]]);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    const showImagePickerOptions = () => {
        setShowImageSourceDialog(true);
    };

    const removeImage = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    const validateForm = () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Title is required');
            return false;
        }
          
        if (!description.trim()) {
            Alert.alert('Error', 'Description is required');
            return false;
        }
          
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            Alert.alert('Error', 'Please enter a valid price');
            return false;
        }
          
        if (!category.trim()) {
            Alert.alert('Error', 'Category is required');
            return false;
        }
          
        return true; 
    };
    
    const submitListing = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try{
            const listingId = ID.unique();

            await databases.createDocument(
                DATABASE_ID,
                LISTINGS_COLLECTION_ID,
                listingId,
                {
                  title: title.trim(),
                  description: description.trim(),
                  price: parseFloat(price),
                  category: category.trim(),
                  condition: condition.trim(),
                  location: location.trim(),
                  userId: currentUser.$id,
                  createdAt: new Date().toISOString(),
                  status: 'active',
                }
            );

            if (images.length > 0) {
                await Promise.all(images.map(async (image, index) => {
                  try {
                    const uriParts = image.uri.split('/');
                    const fileName = uriParts[uriParts.length - 1];
                    const fileId = ID.unique();
                    
                    const formData = new FormData();
                    formData.append('fileId', fileId);
                    formData.append('file', {
                      uri: image.uri,
                      name: fileName,
                      type: 'image/jpeg',
                    });
                    
                    const endpoint = `${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${IMAGES_BUCKET_ID}/files`;
                    const response = await fetch(endpoint, {
                      method: 'POST',
                      headers: {
                        'X-Appwrite-Project': process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
                      },
                      body: formData,
                    });
                    
                    if (!response.ok) {
                      throw new Error(`HTTP error ${response.status}`);
                    }
                    
                    const fileData = await response.json();
                    
                    await databases.createDocument(
                      DATABASE_ID,
                      IMAGES_COLLECTION_ID,
                      ID.unique(),
                      {
                        listingId,
                        fileId: fileData.$id || fileId,
                        order: index,
                      }
                    );
                  } catch (error) {
                    console.error(`Upload failed for image ${index}:`, error);
                  }
                }));
              }

            Alert.alert('Success', 'Your listing has been created!');
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Error creating listing:', error);
            Alert.alert('Error', 'Failed to create listing. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectCategory = (selectedCategory) => {
        setCategory(selectedCategory);
        setShowCategoryDropdown(false);
    };

    return (
        <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
  >
          <Text style={styles.title}>Create New Listing</Text>
          
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="What are you selling?"
          />
          
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your item"
            multiline
            numberOfLines={4}
          />
          
          <Text style={styles.label}>Price *</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.priceInput}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>
          
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowCategoryDropdown(true)}
          >
            <Text style={category ? {} : {color: '#999'}}>
              {category || 'Select a category'}
            </Text>
          </TouchableOpacity>
          
          <Modal
            visible={showCategoryDropdown}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowCategoryDropdown(false)}
          >
            <Pressable 
              style={styles.modalOverlay} 
              onPress={() => setShowCategoryDropdown(false)}
            >
              <View style={styles.dropdownContainer}>
                {categories.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => selectCategory(item)}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Pressable>
          </Modal>
          
          <Text style={styles.label}>Condition</Text>
          <TextInput
            style={styles.input}
            value={condition}
            onChangeText={setCondition}
            placeholder="e.g. New, Like New, Good, Fair"
          />
          
          <Text style={styles.label}>Location on Campus</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Where on campus?"
          />
          
          <Text style={styles.label}>Images</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={showImagePickerOptions}>
            <Text style={styles.imagePickerText}>+ Add Photos</Text>
          </TouchableOpacity>
          
          {images.length > 0 && (
            <View style={styles.imagesContainer}>
              {images.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: img.uri }} style={styles.imagePreview} />
                  <TouchableOpacity 
                    style={styles.removeButton} 
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          <Modal
            visible={showImageSourceDialog}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowImageSourceDialog(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Choose Image Source</Text>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cameraButton]}
                  onPress={takePhotoWithCamera}
                >
                  <Text style={styles.modalButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.galleryButton]}
                  onPress={pickImageFromGallery}
                >
                  <Text style={styles.modalButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowImageSourceDialog(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          
          <TouchableOpacity 
            style={[styles.button, isSubmitting && styles.buttonDisabled]} 
            onPress={submitListing}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Post Listing</Text>
            )}
          </TouchableOpacity>
          <View style={styles.bottomSpacer} />
        </ScrollView>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    message: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#9E9E9E',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      fontWeight: '500',
    },
    input: {
      height: 40,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15,
      paddingHorizontal: 10,
      justifyContent: 'center',
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
      paddingTop: 10,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    dollarSign: {
      fontSize: 18,
      marginRight: 5,
    },
    priceInput: {
      flex: 1,
      height: 40,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    imagePicker: {
      height: 100,
      borderStyle: 'dashed',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
    },
    imagePickerText: {
      color: '#2196F3',
    },
    imagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 15,
    },
    imageWrapper: {
      position: 'relative',
      width: 100,
      height: 100,
      margin: 5,
    },
    imagePreview: {
      width: '100%',
      height: '100%',
      borderRadius: 5,
    },
    removeButton: {
      position: 'absolute',
      top: -10,
      right: -10,
      backgroundColor: 'red',
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdownContainer: {
      backgroundColor: 'white',
      width: '80%',
      borderRadius: 8,
      padding: 10,
      maxHeight: '60%',
    },
    dropdownItem: {
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    dropdownItemText: {
      fontSize: 16,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    modalButton: {
      width: '100%',
      padding: 12,
      borderRadius: 5,
      alignItems: 'center',
      marginVertical: 5,
    },
    cameraButton: {
      backgroundColor: '#2196F3',
    },
    galleryButton: {
      backgroundColor: '#4CAF50',
    },
    cancelButton: {
      backgroundColor: '#F44336',
      marginTop: 10,
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    scrollContent: {
      paddingBottom: 100, // Extra space to ensure button is above tab bar
    },
    bottomSpacer: {
      height: 80, // Additional space to ensure scrollability
    },
});