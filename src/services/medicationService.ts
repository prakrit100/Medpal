import { db, storage } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface Medication {
  id?: string;
  userId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  type: string;
  interval: string;
  instruction: string;
  time: string;
  imageUrl?: string;
  status?: 'take' | 'skip' | ''; // Add this line
}

const MEDICATIONS_COLLECTION = 'medications';

export const addMedication = async (medication: Omit<Medication, 'id'>, imageFile?: File): Promise<string> => {
  try {
    console.log('Adding medication:', medication);
    const docRef = await addDoc(collection(db, MEDICATIONS_COLLECTION), medication);
    console.log('Medication added with ID:', docRef.id);
    
    if (imageFile) {
      console.log('Uploading image for medication:', docRef.id);
      const imageUrl = await uploadMedicationImage(docRef.id, imageFile);
      console.log('Image uploaded, URL:', imageUrl);
      await updateDoc(docRef, { imageUrl });
      console.log('Medication updated with image URL');
    }

    return docRef.id;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw new Error('Failed to add medication. Please try again.');
  }
};

export const updateMedication = async (id: string, medication: Partial<Medication>, imageFile?: File): Promise<void> => {
  try {
    const medicationRef = doc(db, MEDICATIONS_COLLECTION, id);
    await updateDoc(medicationRef, medication);

    if (imageFile) {
      const imageUrl = await uploadMedicationImage(id, imageFile);
      await updateDoc(medicationRef, { imageUrl });
    }
  } catch (error) {
    console.error('Error updating medication:', error);
    throw new Error('Failed to update medication. Please try again.');
  }
};

export const deleteMedication = async (id: string): Promise<void> => {
  try {
    const medicationRef = doc(db, MEDICATIONS_COLLECTION, id);
    await deleteDoc(medicationRef);
    await deleteMedicationImage(id);
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw new Error('Failed to delete medication');
  }
};

export const getMedications = async (userId: string): Promise<Medication[]> => {
  try {
    const q = query(collection(db, MEDICATIONS_COLLECTION), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Medication));
  } catch (error) {
    console.error('Error fetching medications:', error);
    throw new Error('Failed to fetch medications');
  }
};

export const getMedication = async (id: string, userId: string): Promise<Medication | null> => {
  try {
    const medicationRef = doc(db, MEDICATIONS_COLLECTION, id);
    const medicationDoc = await getDoc(medicationRef);
    if (medicationDoc.exists() && medicationDoc.data()?.userId === userId) {
      return { id: medicationDoc.id, ...medicationDoc.data() } as Medication;
    }
    return null;
  } catch (error) {
    console.error('Error fetching medication:', error);
    throw new Error('Failed to fetch medication');
  }
};

const uploadMedicationImage = async (medicationId: string, imageFile: File): Promise<string> => {
  try {
    console.log('Starting image upload for medication:', medicationId);
    const storageRef = ref(storage, `medication_images/${medicationId}`);
    const uploadResult = await uploadBytes(storageRef, imageFile);
    console.log('Image uploaded successfully:', uploadResult);
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL obtained:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading medication image:', error);
    throw new Error('Failed to upload medication image. Please try again.');
  }
};

const deleteMedicationImage = async (medicationId: string): Promise<void> => {
  const storageRef = ref(storage, `medication_images/${medicationId}`);
  try {
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting medication image:', error);
    // Don't throw an error here, as the medication document has already been deleted
  }
};