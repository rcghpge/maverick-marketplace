import { Client, Account, Databases, Storage } from 'react-native-appwrite';
import { Platform } from 'react-native';

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)

 if (Platform.OS !== 'web') {
    client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM);
}

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const DATABASE_ID = '67eafaec0002f174820f';
export const USERS_COLLECTION_ID = 'users';
export const LISTINGS_COLLECTION_ID = 'listings';
export const IMAGES_COLLECTION_ID = 'images';
export const IMAGES_BUCKET_ID = 'listing-images';
export const CHATS_COLLECTION_ID = '67eafb63001e983d4770';
export const MESSAGES_COLLECTION_ID = '67eafb6600296246d0e0';

export { client, account, databases, storage };