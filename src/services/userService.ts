import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../firebase/config';

export const updateUserProfile = async (userId: string, data: { displayName?: string }) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
    
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: data.displayName
      });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};