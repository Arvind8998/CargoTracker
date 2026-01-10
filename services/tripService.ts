import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '../firebaseConfig';

// Initialize Firestore
const db = getFirestore(app);

// Collection name
const TRIPS_COLLECTION = 'trips';

export interface TripFirestore {
  truck: string;
  status: string;
  time: string;
  bidNo: string;              // This is the LR No
  quantity: string;
  departureTime: Date;
  arrivalTime: Date | null;
  fuelFilled: string;
  createdAt: Date;
  userId?: string;
  driverName: string;
  fromPlant: string;
  toPlant: string;
  companyName: string;
  itemType: string;
}

// Helper to convert Firestore Timestamp → Date
const timestampToDate = (ts: Timestamp | Date | null): Date | null => {
  if (!ts) return null;
  if (ts instanceof Date) return ts;
  return ts.toDate();
};

// Get all trips (newest first)
export const getTrips = async (userId?: string): Promise<(TripFirestore & { id: string })[]> => {
  try {
    const q = query(
      collection(db, TRIPS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        truck: data.truck || '',
        status: data.status || '',
        time: data.time || '',
        bidNo: data.bidNo || '',
        quantity: data.quantity || '',
        departureTime: timestampToDate(data.departureTime) || new Date(),
        arrivalTime: timestampToDate(data.arrivalTime),
        fuelFilled: data.fuelFilled || '',
        createdAt: timestampToDate(data.createdAt) || new Date(),
        userId: data.userId || '',
        driverName: data.driverName || '',
        fromPlant: data.fromPlant || '',
        toPlant: data.toPlant || '',
        companyName: data.companyName || '',
        itemType: data.itemType || '',
      };
    });
  } catch (error) {
    console.error("Error getting trips:", error);
    return [];
  }
};

// Add new trip
export const addTrip = async (tripData: Omit<TripFirestore, 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, TRIPS_COLLECTION), {
      ...tripData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding trip:", error);
    throw error;
  }
};

// Update trip
export const updateTrip = async (tripId: string, tripData: Partial<TripFirestore>) => {
  try {
    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    await updateDoc(tripRef, {
      ...tripData,
    });
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error;
  }
};

// Delete trip
export const deleteTrip = async (tripId: string) => {
  try {
    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    await deleteDoc(tripRef);
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
};